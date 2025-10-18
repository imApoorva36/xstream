// app/api/videos/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readdir, readFile, mkdir, rm } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

// Configure MinIO client
const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'videos';

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  bitrate: number;
}

/**
 * Get video metadata using FFprobe
 */
async function getVideoMetadata(filePath: string): Promise<VideoMetadata> {
  const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
  const { stdout } = await execAsync(command);
  const metadata = JSON.parse(stdout);
  
  const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
  
  return {
    duration: parseFloat(metadata.format.duration),
    width: videoStream?.width || 1920,
    height: videoStream?.height || 1080,
    bitrate: parseInt(metadata.format.bit_rate) || 0,
  };
}

/**
 * Process video with FFmpeg to create HLS segments
 */
async function createHLSSegments(
  inputPath: string,
  outputDir: string,
  segmentDuration: number = 6
): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'playlist.m3u8');

  // FFmpeg command for HLS segmentation
  // vf=scale forces dimensions to be divisible by 2
  const command = `ffmpeg -i "${inputPath}" \
    -vf "scale='trunc(iw/2)*2:trunc(ih/2)*2'" \
    -c:v libx264 -profile:v baseline -level 3.0 \
    -c:a aac -b:a 128k \
    -start_number 0 \
    -hls_time ${segmentDuration} \
    -hls_list_size 0 \
    -f hls \
    -hls_segment_filename "${outputDir}/segment_%03d.ts" \
    "${outputPath}"`;

  console.log('Creating HLS segments...');
  await execAsync(command);
  console.log('HLS segments created successfully');
}

/**
 * Create adaptive bitrate versions (multiple quality levels)
 */
async function createAdaptiveBitrate(
  inputPath: string,
  outputDir: string,
  maxQuality: string = '1080p'
): Promise<void> {
  const qualities = [
    { name: '1080p', width: 1920, height: 1080, bitrate: '5000k', enabled: ['4K', '1080p'].includes(maxQuality) },
    { name: '720p', width: 1280, height: 720, bitrate: '2800k', enabled: ['4K', '1080p', '720p'].includes(maxQuality) },
    { name: '480p', width: 854, height: 480, bitrate: '1400k', enabled: ['4K', '1080p', '720p', '480p'].includes(maxQuality) },
    { name: '360p', width: 640, height: 360, bitrate: '800k', enabled: true },
  ].filter(q => q.enabled);

  // Create variant playlists for each quality
  for (const quality of qualities) {
    const qualityDir = path.join(outputDir, quality.name);
    await mkdir(qualityDir, { recursive: true });

    // Force dimensions to be divisible by 2 using scale filter
    const command = `ffmpeg -i "${inputPath}" \
      -vf "scale='min(${quality.width},iw)':'min(${quality.height},ih)':force_original_aspect_ratio=decrease,scale='trunc(iw/2)*2:trunc(ih/2)*2'" \
      -c:v libx264 -preset fast -crf 23 -b:v ${quality.bitrate} \
      -c:a aac -b:a 128k \
      -start_number 0 \
      -hls_time 6 \
      -hls_list_size 0 \
      -f hls \
      -hls_segment_filename "${qualityDir}/segment_%03d.ts" \
      "${qualityDir}/playlist.m3u8"`;

    console.log(`Creating ${quality.name} quality...`);
    await execAsync(command);
  }

  // Create master playlist
  const masterPlaylist = qualities.map((q, i) => 
    `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(q.bitrate) * 1000},RESOLUTION=${q.width}x${q.height}\n${q.name}/playlist.m3u8`
  ).join('\n');

  const masterContent = `#EXTM3U\n#EXT-X-VERSION:3\n${masterPlaylist}`;
  await writeFile(path.join(outputDir, 'master.m3u8'), masterContent);
}

/**
 * Upload all HLS files to MinIO/S3
 */
async function uploadHLSToS3(
  outputDir: string,
  videoId: string
): Promise<string> {
  const uploadFile = async (filePath: string, s3Key: string) => {
    const fileContent = await readFile(filePath);
    const contentType = filePath.endsWith('.m3u8') 
      ? 'application/vnd.apple.mpegurl'
      : 'video/MP2T';

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: filePath.endsWith('.m3u8') ? 'no-cache' : 'public, max-age=31536000',
    });

    await s3Client.send(command);
    console.log(`Uploaded: ${s3Key}`);
  };

  const uploadDirectory = async (dir: string, prefix: string = '') => {
    const files = await readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      const s3Key = `${videoId}/${prefix}${file.name}`;
      
      if (file.isDirectory()) {
        await uploadDirectory(filePath, `${prefix}${file.name}/`);
      } else {
        await uploadFile(filePath, s3Key);
      }
    }
  };

  await uploadDirectory(outputDir);
  
  // Return the master playlist URL
  return `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${BUCKET_NAME}/${videoId}/master.m3u8`;
}

/**
 * Generate thumbnail from video
 */
async function generateThumbnail(
  inputPath: string,
  outputPath: string
): Promise<void> {
  // Force dimensions to be divisible by 2
  const command = `ffmpeg -i "${inputPath}" -ss 00:00:02 -vframes 1 -vf "scale='trunc(iw/2)*2:trunc(ih/2)*2'" "${outputPath}"`;
  await execAsync(command);
}

export async function POST(request: NextRequest) {
  const videoId = randomUUID();
  const tempDir = path.join('/tmp', `video-${videoId}`);
  
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const pricePerSecond = parseFloat(formData.get('pricePerSecond') as string);
    const maxQuality = formData.get('maxQuality') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const creatorId = formData.get('creatorId') as string;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Save uploaded file to temp directory
    await mkdir(tempDir, { recursive: true });
    const inputPath = path.join(tempDir, 'input.mp4');
    const bytes = await videoFile.arrayBuffer();
    await writeFile(inputPath, Buffer.from(bytes));

    console.log('Video saved, extracting metadata...');
    
    // Get video metadata
    const metadata = await getVideoMetadata(inputPath);
    console.log('Metadata:', metadata);

    // Generate thumbnail
    const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');
    await generateThumbnail(inputPath, thumbnailPath);
    
    // Upload thumbnail to S3
    const thumbnailContent = await readFile(thumbnailPath);
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${videoId}/thumbnail.jpg`,
      Body: thumbnailContent,
      ContentType: 'image/jpeg',
    }));
    const thumbnailUrl = `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${BUCKET_NAME}/${videoId}/thumbnail.jpg`;

    // Create HLS segments
    const hlsDir = path.join(tempDir, 'hls');
    
    // Use adaptive bitrate or simple HLS based on quality setting
    if (maxQuality === '1080p' || maxQuality === '4K') {
      await createAdaptiveBitrate(inputPath, hlsDir, maxQuality);
    } else {
      await createHLSSegments(inputPath, hlsDir);
    }

    console.log('Uploading to MinIO...');
    
    // Upload HLS files to MinIO
    const playlistUrl = await uploadHLSToS3(hlsDir, videoId);

    // Clean up temp files
    await rm(tempDir, { recursive: true, force: true });

    console.log('Processing complete!');

    // Save video metadata to database (you'll need to implement this)
    const videoData = {
      id: videoId,
      title,
      description,
      videoUrl: playlistUrl,
      thumbnailUrl,
      duration: Math.floor(metadata.duration),
      width: metadata.width,
      height: metadata.height,
      pricePerSecond,
      maxQuality,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      creatorId,
      createdAt: new Date(),
    };

    // TODO: Save to your database using Prisma
    // await prisma.video.create({ data: videoData });

    return NextResponse.json({
      success: true,
      video: videoData,
      playlistUrl,
      thumbnailUrl,
      message: 'Video processed and uploaded successfully',
    });

  } catch (error) {
    console.error('Video processing error:', error);
    
    // Clean up on error
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {}

    return NextResponse.json(
      { 
        error: 'Failed to process video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Increase body size limit for video uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};