"use client";

import { useState } from "react";
import Link from "next/link";
import { Name } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Upload as UploadIcon, 
  Video, 
  DollarSign, 
  Settings, 
  Eye, 
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  Target
} from "lucide-react";
import Image from "next/image";

export default function UploadPage() {
  const [uploadStep, setUploadStep] = useState(1);
  const { address, isConnected } = useAccount();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [pricePerSecond, setPricePerSecond] = useState("0.01");
  const [maxQuality, setMaxQuality] = useState("1080p");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [category, setCategory] = useState("Education");

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setUploadStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!address || !isConnected) {
      setUploadError("Please connect your wallet first");
      return;
    }

    if (!videoFile) {
      setUploadError("Please select a video file");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // For now, we'll use placeholder URLs since actual file upload requires a storage service
      // In production, you'd upload to IPFS, Arweave, or cloud storage first
      const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      const thumbnailUrl = thumbnail 
        ? URL.createObjectURL(thumbnail)
        : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640&h=360&fit=crop";

      // Get video duration (mock for now - would use actual video metadata)
      const videoDuration = 300; // 5 minutes in seconds

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          videoUrl,
          thumbnailUrl,
          duration: videoDuration,
          pricePerSecond: parseFloat(pricePerSecond),
          category,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          creatorId: address,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload video');
      }

      const data = await response.json();
      console.log('Video uploaded successfully:', data);
      
      setUploadStep(5);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const calculateVideoCost = () => {
    if (!videoFile) return "0.00";
    // Mock calculation - in real app, you'd determine duration from video file
    const estimatedDuration = 300; // 5 minutes
    return (parseFloat(pricePerSecond) * estimatedDuration).toFixed(2);
  };

  const getQualityOptions = () => {
    return [
      { value: "4K", label: "4K (2160p)", multiplier: 1.0 },
      { value: "1080p", label: "Full HD (1080p)", multiplier: 0.75 },
      { value: "720p", label: "HD (720p)", multiplier: 0.5 },
      { value: "480p", label: "SD (480p)", multiplier: 0.35 },
      { value: "240p", label: "Low (240p)", multiplier: 0.2 }
    ];
  };

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-lg">
      
      {/* Creator Tool Banner */}
      <div className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src='/logo.png' alt='xStream Logo' width={36} height={36} />
              <div>
                <h2 className="text-white font-base text-lg">Creator Studio - Upload</h2>
                <p className="text-slate-100 font-light text-xs">Share your content and start earning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 hidden sm:flex">
                Creator Tool
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-white mb-2">
            Upload Video
          </h1>
          <p className="text-gray-300">
            Share your content and earn with x402 micropayments
          </p>
        </div>

        {/* Upload Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-base ${
                    step <= uploadStep
                      ? "bg-slate-200 text-black"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {step < uploadStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-0.5 ${
                      step < uploadStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {uploadStep === 1 && "Upload Video"}
              {uploadStep === 2 && "Video Details"}
              {uploadStep === 3 && "Pricing & Settings"}
              {uploadStep === 4 && "Publishing"}
            </div>
          </div>
        </div>

        {/* Step 1: Upload Video */}
        {uploadStep === 1 && (
          <Card className="bg-slate-950 backdrop-blur border-white/10">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="border-2 border-dashed border-white/10 rounded-md p-12 bg-white/5">
                  <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Upload your video
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Choose a video file to get started
                  </p>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button variant="outline" size="sm" className="border-white/20 text-gray-200 cursor-pointer">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Select Video File
                    </Button>
                  </label>

                  <div className="mt-4 text-sm text-gray-400">
                    <p>Supported formats: MP4, MOV, AVI, WMV</p>
                    <p>Maximum file size: 2GB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Video Details */}
        {uploadStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
                <CardDescription>
                  Add information about your video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-base mb-2">Title</label>
                  <Input
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-base mb-2">Description</label>
                  <Textarea
                    placeholder="Describe your video content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-base mb-2">Tags</label>
                  <Input
                    placeholder="Enter tags separated by commas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: blockchain, tutorial, crypto, x402
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-base mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-base mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setUploadStep(1)}>
                Back
              </Button>
              <Button onClick={() => setUploadStep(3)} disabled={!title.trim()}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Settings */}
        {uploadStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Settings
                </CardTitle>
                <CardDescription>
                  Set your video pricing and quality options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-base mb-2">
                      Price per Second (USD)
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0.010"
                      value={pricePerSecond}
                      onChange={(e) => setPricePerSecond(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: $0.005 - $0.020 per second
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-base mb-2">
                      Maximum Quality
                    </label>
                    <Select value={maxQuality} onValueChange={setMaxQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getQualityOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing Preview */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <h4 className="font-base text-blue-700 dark:text-blue-300 mb-3">
                    Pricing Preview (5 min video example)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {getQualityOptions()
                      .filter(q => q.multiplier <= getQualityOptions().find(opt => opt.value === maxQuality)?.multiplier!)
                      .map((option) => (
                        <div key={option.value} className="text-center">
                          <Badge variant="outline" className="mb-1">
                            {option.value}
                          </Badge>
                          <p className="font-base">
                            ${(parseFloat(pricePerSecond) * option.multiplier * 300).toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Upload Fee Info */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-base text-amber-700 dark:text-amber-300">
                        Upload Fee
                      </h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        A one-time fee of $0.50 (paid via x402) is required to upload to xStream. 
                        This helps maintain platform quality and covers storage costs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setUploadStep(2)}>
                Back
              </Button>
              <Button onClick={() => setUploadStep(4)}>
                Review & Publish
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Publishing */}
        {uploadStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Ready to Publish
              </CardTitle>
              <CardDescription>
                Review your video details and publish to xStream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Summary */}
              <div className="border rounded-md p-4">
                <h4 className="font-base mb-3">Video Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <p className="font-base">{title || "Untitled Video"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Quality:</span>
                    <p className="font-base">{maxQuality}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price per Second:</span>
                    <p className="font-base">${pricePerSecond}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Upload Fee:</span>
                    <p className="font-base">$0.50 (via x402)</p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>By publishing, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>xStream's Terms of Service and Creator Guidelines</li>
                  <li>Instant settlement of viewer payments to your connected wallet</li>
                  <li>Quality-based pricing as configured above</li>
                  <li>Platform fee of 5% on all viewer payments</li>
                </ul>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-base text-red-700 dark:text-red-300">
                        Upload Failed
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {uploadError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setUploadStep(3)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isUploading || !isConnected}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : !isConnected ? (
                    <>Connect Wallet to Publish</>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Publish Video
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {uploadStep === 5 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-medium text-white mb-2">
                  {isConnected && address ? (
                    <>🎉 Congratulations, <Name address={address} className="text-blue-400" />!</>
                  ) : (
                    <>Video Published Successfully!</>
                  )}
                </h3>
                <p className="text-gray-300 mb-6">
                  Your video is now live on xStream and ready for viewers to watch and pay per second.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Note:</strong> In this demo, a sample video URL is used. In production, your actual video file would be uploaded to decentralized storage (IPFS/Arweave) or cloud storage.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Link href="/browse">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Videos
                    </Button>
                  </Link>
                  <Button onClick={() => { 
                    setUploadStep(1); 
                    setVideoFile(null); 
                    setTitle(""); 
                    setDescription("");
                    setTags("");
                    setUploadError(null);
                  }} className="bg-blue-600 hover:bg-blue-700">
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Promote Video with Ads CTA */}
            <Card className="border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-md">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-medium text-white mb-2">
                      Want More Views? Try Advertising! 🚀
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Promote your video to the right audience with xStream's targeted advertising. 
                      Pay only for actual views, and earn even when viewers skip!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        Pay-Per-View
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Skip Revenue Share
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                        Precision Targeting
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Link href="/advertise">
                      <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/50">
                        <Target className="h-5 w-5 mr-2" />
                        Create Ad Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}