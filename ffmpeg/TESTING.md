# Testing the FFmpeg Video Conversion Utility

## Prerequisites

1. **Install FFmpeg** on your system:
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (RHEL/CentOS)
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

## Testing Steps

### 1. Prepare a Test Video
Place a sample video file named `sample-video.mp4` in the `~/xstream/ffmpeg` directory, or update the test script with the path to your video file.

### 2. Run the Test Script
```bash
npm test
```

This will:
- Check supported video formats
- Validate your video file
- Convert the video to 480p, 720p, and 1080p
- Show progress updates during conversion
- Display file sizes of the converted videos

### 3. Manual Testing

You can also test individual functions:

```typescript
import { convertVideoToStandardResolutions } from './ffmpeg';

// Convert to all standard resolutions
const results = await convertVideoToStandardResolutions(
  'path/to/your/video.mp4',
  ['720p', '1080p'], // Optional: specify which resolutions
  {
    outputDir: './converted-videos',
    overwrite: true,
    quality: 'medium' // 'fast', 'medium', or 'slow'
  },
  (progress) => {
    console.log(`${progress.resolution}: ${progress.percent}%`);
  }
);
```

### 4. Expected Output Structure
After conversion, you'll get:
```
output/
├── your-video_480p.mp4
├── your-video_720p.mp4
└── your-video_1080p.mp4
```

### 5. Using in Next.js

To use this in your Next.js project:

1. Copy the `ffmpeg.ts` file to your Next.js project
2. Install dependencies: `npm install fluent-ffmpeg @types/fluent-ffmpeg`
3. Use in API routes or server-side code:

```typescript
// pages/api/convert-video.ts (or app/api/convert-video/route.ts for App Router)
import { convertVideoToStandardResolutions } from '@/utils/ffmpeg';

export default async function handler(req, res) {
  try {
    const { videoPath } = req.body;
    
    const results = await convertVideoToStandardResolutions(
      videoPath,
      ['720p', '1080p'],
      { outputDir: './public/converted' }
    );
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Troubleshooting

- **FFmpeg not found**: Make sure FFmpeg is installed and available in your PATH
- **Permission errors**: Ensure the output directory is writable
- **Large file sizes**: Adjust the quality setting or bitrate in the STANDARD_RESOLUTIONS config
- **Unsupported format**: Check if your input file format is in the supported formats list
