import { 
  convertVideoToStandardResolutions, 
  convertVideoToResolution,
  isValidVideoFile,
  getSupportedFormats,
  ConversionProgress,
} from './ffmpeg';

async function testVideoConversion() {
  console.log('🎬 Testing Video Conversion Utility\n');

  // Test 1: Check supported formats
  console.log('📋 Supported video formats:');
  console.log(getSupportedFormats().join(', '));
  console.log();

  // Test 2: Test file validation
  const testVideoPath = './test.mp4'; // You'll need to provide this
  console.log(`🔍 Checking if ${testVideoPath} is valid:`, isValidVideoFile(testVideoPath));
  console.log();

  // Test 3: Convert to all standard resolutions
  try {
    console.log('🚀 Starting conversion to all standard resolutions...');
    
    const results = await convertVideoToStandardResolutions(
      testVideoPath,
      ['480p', '720p', '1080p'],
      {
        outputDir: './output',
        overwrite: true,
        quality: 'medium'
      },
      (progress: ConversionProgress) => {
        console.log(`📊 ${progress.resolution}: ${progress.percent?.toFixed(1)}% - ${progress.timemark}`);
      }
    );

    console.log('\n✅ Conversion completed!');
    results.forEach(result => {
      console.log(`📁 ${result.resolution}: ${result.outputPath} (${(result.size / 1024 / 1024).toFixed(2)} MB)`);
    });

  } catch (error) {
    console.error('❌ Conversion failed:', error);
  }
}

async function testSingleResolution() {
  console.log('\n🎯 Testing single resolution conversion...');
  
  const inputPath = './test.mp4';
  const outputPath = './output/test-720p.mp4';
  
  try {
    const result = await convertVideoToResolution(
      inputPath,
      outputPath,
      '720p',
      { quality: 'fast', overwrite: true }
    );
    
    console.log('✅ Single conversion completed:');
    console.log(`📁 Output: ${result.outputPath} (${(result.size / 1024 / 1024).toFixed(2)} MB)`);
    
  } catch (error) {
    console.error('❌ Single conversion failed:', error);
  }
}

// Run tests
async function runTests() {
  await testVideoConversion();
  await testSingleResolution();
}

runTests().catch(console.error);
