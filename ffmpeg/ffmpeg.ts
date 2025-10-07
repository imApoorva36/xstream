import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export interface ConversionOptions {
  outputDir?: string;
  overwrite?: boolean;
  quality?: 'fast' | 'medium' | 'slow';
  audioCodec?: string;
  videoCodec?: string;
}

export interface ConversionResult {
  resolution: string;
  outputPath: string;
  size: number;
  duration?: number;
}

export interface ConversionProgress {
  resolution: string;
  percent: number;
  currentFps: number;
  targetSize: number;
  timemark: string;
}

const STANDARD_RESOLUTIONS = {
  '480p': { width: 854, height: 480, bitrate: '1000k' },
  '720p': { width: 1280, height: 720, bitrate: '2500k' },
  '1080p': { width: 1920, height: 1080, bitrate: '4000k' }
} as const;

export type Resolution = keyof typeof STANDARD_RESOLUTIONS;

/**
 * Convert a video file to standard resolutions (480p, 720p, 1080p)
 * @param inputPath - Path to the input video file
 * @param resolutions - Array of resolutions to convert to (default: all standard resolutions)
 * @param options - Conversion options
 * @param onProgress - Progress callback function
 * @returns Promise resolving to array of conversion results
 */
export async function convertVideoToStandardResolutions(
  inputPath: string,
  resolutions: Resolution[] = ['480p', '720p', '1080p'],
  options: ConversionOptions = {},
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConversionResult[]> {
  
  // Validate input file exists
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${inputPath}`);
  }

  const {
    outputDir = path.dirname(inputPath),
    overwrite = false,
    quality = 'medium',
    audioCodec = 'aac',
    videoCodec = 'libx264'
  } = options;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const inputFileName = path.parse(inputPath).name;
  const results: ConversionResult[] = [];

  // Get video metadata
  const metadata = await getVideoMetadata(inputPath);
  const inputWidth = metadata.width || 1920;
  const inputHeight = metadata.height || 1080;

  for (const resolution of resolutions) {
    const config = STANDARD_RESOLUTIONS[resolution];
    
    // Skip if input resolution is lower than target resolution
    if (inputHeight < config.height) {
      console.warn(`Skipping ${resolution} conversion: input resolution (${inputHeight}p) is lower than target (${config.height}p)`);
      continue;
    }

    const outputPath = path.join(outputDir, `${inputFileName}_${resolution}.mp4`);
    
    // Check if file exists and overwrite option
    if (fs.existsSync(outputPath) && !overwrite) {
      console.warn(`Output file already exists: ${outputPath}. Use overwrite: true to replace.`);
      continue;
    }

    try {
      await convertToResolution(
        inputPath,
        outputPath,
        config,
        {
          quality,
          audioCodec,
          videoCodec
        },
        (progress) => {
          if (onProgress) {
            onProgress({
              resolution,
              percent: progress.percent || 0,
              currentFps: progress.currentFps || 0,
              targetSize: progress.targetSize || 0,
              timemark: progress.timemark || '00:00:00'
            });
          }
        }
      );

      // Get file size
      const stats = fs.statSync(outputPath);
      
      results.push({
        resolution,
        outputPath,
        size: stats.size,
        duration: metadata.duration
      });

      console.log(`✅ Successfully converted to ${resolution}: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to convert to ${resolution}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Get video metadata using ffmpeg
 */
function getVideoMetadata(inputPath: string): Promise<{
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      
      resolve({
        width: videoStream?.width,
        height: videoStream?.height,
        duration: metadata.format?.duration,
        format: metadata.format?.format_name
      });
    });
  });
}

/**
 * Convert video to specific resolution
 */
function convertToResolution(
  inputPath: string,
  outputPath: string,
  config: { width: number; height: number; bitrate: string },
  options: {
    quality: 'fast' | 'medium' | 'slow';
    audioCodec: string;
    videoCodec: string;
  },
  onProgress?: (progress: any) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec(options.videoCodec)
      .audioCodec(options.audioCodec)
      .videoBitrate(config.bitrate)
      .size(`${config.width}x${config.height}`)
      .format('mp4')
      .outputOptions([
        '-movflags', '+faststart', // Enable streaming
        '-pix_fmt', 'yuv420p' // Ensure compatibility
      ]);

    // Set quality preset
    switch (options.quality) {
      case 'fast':
        command.outputOptions(['-preset', 'ultrafast']);
        break;
      case 'medium':
        command.outputOptions(['-preset', 'medium']);
        break;
      case 'slow':
        command.outputOptions(['-preset', 'slow']);
        break;
    }

    // Maintain aspect ratio with scaling filter
    command.videoFilters([
      {
        filter: 'scale',
        options: `${config.width}:${config.height}:force_original_aspect_ratio=decrease`,
      },
      {
        filter: 'pad',
        options: `${config.width}:${config.height}:(ow-iw)/2:(oh-ih)/2:black`
      }
    ]);

    // Add progress listener
    if (onProgress) {
      command.on('progress', onProgress);
    }

    // Handle completion
    command
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}

/**
 * Utility function to convert a single video to a specific resolution
 * @param inputPath - Path to input video
 * @param outputPath - Path for output video
 * @param resolution - Target resolution
 * @param options - Conversion options
 * @returns Promise resolving to conversion result
 */
export async function convertVideoToResolution(
  inputPath: string,
  outputPath: string,
  resolution: Resolution,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const config = STANDARD_RESOLUTIONS[resolution];
  const {
    quality = 'medium',
    audioCodec = 'aac',
    videoCodec = 'libx264'
  } = options;

  const metadata = await getVideoMetadata(inputPath);
  
  await convertToResolution(
    inputPath,
    outputPath,
    config,
    { quality, audioCodec, videoCodec }
  );

  const stats = fs.statSync(outputPath);
  
  return {
    resolution,
    outputPath,
    size: stats.size,
    duration: metadata.duration
  };
}

/**
 * Get supported video formats
 */
export function getSupportedFormats(): string[] {
  return ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.m4v'];
}

/**
 * Validate if file is a supported video format
 */
export function isValidVideoFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return getSupportedFormats().includes(ext);
}

export default {
  convertVideoToStandardResolutions,
  convertVideoToResolution,
  getSupportedFormats,
  isValidVideoFile,
  STANDARD_RESOLUTIONS
};