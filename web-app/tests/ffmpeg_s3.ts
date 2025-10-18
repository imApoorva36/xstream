import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { spawn } from 'child_process';
import { readdir, readFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';

// Configure MinIO client
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin123',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = 'xstream';

interface ProcessVideoOptions {
  inputPath: string;
  videoId: string;
  segmentDuration?: number;
}

interface Resolution {
  name: string;
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
}

const RESOLUTIONS: Resolution[] = [
  {
    name: '480p',
    width: 854,
    height: 480,
    videoBitrate: '1000k',
    audioBitrate: '96k',
  },
  {
    name: '720p',
    width: 1280,
    height: 720,
    videoBitrate: '2500k',
    audioBitrate: '128k',
  },
  {
    name: '1080p',
    width: 1920,
    height: 1080,
    videoBitrate: '5000k',
    audioBitrate: '192k',
  },
];

/**
 * Run FFmpeg command using spawn for better control
 */
function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('FFmpeg command:', 'ffmpeg', args.join(' '));
    
    const ffmpegProcess = spawn('ffmpeg', args);

    let stderr = '';

    ffmpegProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      // Parse progress from FFmpeg output
      const timeMatch = data.toString().match(/time=(\d+:\d+:\d+\.\d+)/);
      if (timeMatch) {
        process.stdout.write(`\rProgress: ${timeMatch[1]}`);
      }
    });

    ffmpegProcess.on('close', (code) => {
      console.log(''); // New line after progress
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}\n${stderr}`));
      }
    });

    ffmpegProcess.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg: ${err.message}`));
    });
  });
}

/**
 * Create HLS segments for a specific resolution
 */
async function createHLSForResolution(
  inputPath: string,
  outputDir: string,
  resolution: Resolution,
  segmentDuration: number
): Promise<void> {
  const resolutionDir = path.join(outputDir, resolution.name);
  await mkdir(resolutionDir, { recursive: true });

  const playlistPath = path.join(resolutionDir, 'playlist.m3u8');
  const segmentPattern = path.join(resolutionDir, 'segment_%03d.ts');

  console.log(`Creating HLS segments for ${resolution.name}...`);

  const args = [
    '-i', inputPath,
    // Scale and ensure dimensions are divisible by 2
    '-vf', `scale=${resolution.width}:${resolution.height}:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-b:v', resolution.videoBitrate,
    '-maxrate', resolution.videoBitrate,
    '-bufsize', `${parseInt(resolution.videoBitrate) * 2}k`,
    '-c:a', 'aac',
    '-b:a', resolution.audioBitrate,
    '-start_number', '0',
    '-hls_time', segmentDuration.toString(),
    '-hls_list_size', '0',
    '-hls_segment_filename', segmentPattern,
    '-f', 'hls',
    playlistPath,
  ];

  await runFFmpeg(args);
  console.log(`✅ ${resolution.name} segments created successfully`);
}

/**
 * Create master playlist that references all resolution playlists
 */
async function createMasterPlaylist(
  outputDir: string,
  videoId: string,
  baseUrl: string
): Promise<void> {
  const masterPlaylistContent = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    '',
  ];

  for (const resolution of RESOLUTIONS) {
    // Calculate bandwidth (video + audio bitrates in bits per second)
    const videoBandwidth = parseInt(resolution.videoBitrate) * 1000;
    const audioBandwidth = parseInt(resolution.audioBitrate) * 1000;
    const totalBandwidth = videoBandwidth + audioBandwidth;
    
    masterPlaylistContent.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${totalBandwidth},RESOLUTION=${resolution.width}x${resolution.height}`,
      `${baseUrl}/${videoId}/${resolution.name}/playlist.m3u8`
    );
    masterPlaylistContent.push('');
  }

  const masterPath = path.join(outputDir, 'master.m3u8');
  await writeFile(masterPath, masterPlaylistContent.join('\n'));
  console.log('✅ Master playlist created');
}

/**
 * Upload all segments and playlists to MinIO/S3
 */
async function uploadHLSToS3(
  outputDir: string,
  videoId: string
): Promise<string> {
  const uploadPromises: Promise<void>[] = [];

  // Upload master playlist
  const masterPath = path.join(outputDir, 'master.m3u8');
  const masterContent = await readFile(masterPath);
  const masterCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${videoId}/master.m3u8`,
    Body: masterContent,
    ContentType: 'application/vnd.apple.mpegurl',
  });
  uploadPromises.push(
    s3Client.send(masterCommand).then(() => {
      console.log(`Uploaded: ${videoId}/master.m3u8`);
    })
  );

  // Upload each resolution's files
  for (const resolution of RESOLUTIONS) {
    const resolutionDir = path.join(outputDir, resolution.name);
    const files = await readdir(resolutionDir);

    for (const file of files) {
      const filePath = path.join(resolutionDir, file);
      const fileContent = await readFile(filePath);

      const contentType = file.endsWith('.m3u8')
        ? 'application/vnd.apple.mpegurl'
        : 'video/MP2T';

      const s3Key = `${videoId}/${resolution.name}/${file}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
      });

      uploadPromises.push(
        s3Client.send(command).then(() => {
          console.log(`Uploaded: ${s3Key}`);
        })
      );
    }
  }

  await Promise.all(uploadPromises);

  return `http://localhost:9000/${BUCKET_NAME}/${videoId}/master.m3u8`;
}

/**
 * Main function to process and upload video
 */
export async function processAndUploadVideo(
  options: ProcessVideoOptions
): Promise<string> {
  const { inputPath, videoId, segmentDuration = 10 } = options;
  const outputDir = path.join('/tmp', `hls-${videoId}`);

  try {
    await mkdir(outputDir, { recursive: true });

    // Step 1: Create HLS segments for each resolution in parallel
    await Promise.all(
      RESOLUTIONS.map((resolution) =>
        createHLSForResolution(inputPath, outputDir, resolution, segmentDuration)
      )
    );

    // Step 2: Create master playlist
    const baseUrl = `http://localhost:9000/${BUCKET_NAME}`;
    await createMasterPlaylist(outputDir, videoId, baseUrl);

    // Step 3: Upload to MinIO/S3
    const masterPlaylistUrl = await uploadHLSToS3(outputDir, videoId);

    console.log('\n✅ Video processing complete!');
    console.log(`Master Playlist URL: ${masterPlaylistUrl}`);

    return masterPlaylistUrl;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const masterPlaylistUrl = await processAndUploadVideo({
    inputPath: '/home/vedant/code/hackathons/xstream/web-app/tests/test.mp4',
    videoId: 'video-123',
    segmentDuration: 10,
  });

  console.log('\n🎥 Use this URL in your video player:', masterPlaylistUrl);
  console.log('\nThe player will automatically select the best quality based on bandwidth.');
}

// Uncomment to run
main();