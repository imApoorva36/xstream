"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { Name } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload as UploadIcon,
  Video,
  DollarSign,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle,
  Target,
  Loader2,
  X,
} from "lucide-react";

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [category, setCategory] = useState("Education");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 500MB for demo)
      if (file.size > 500 * 1024 * 1024) {
        setUploadError("File size must be less than 500MB");
        return;
      }

      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
      ];
      if (!validTypes.includes(file.type)) {
        setUploadError("Please upload a valid video file (MP4, MOV, AVI, WMV)");
        return;
      }

      setVideoFile(file);
      setUploadError(null);
      setUploadStep(2);
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
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

    if (!title.trim()) {
      setUploadError("Please enter a video title");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("pricePerSecond", pricePerSecond);
      formData.append("maxQuality", maxQuality);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("creatorId", address);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      console.log(formData)
      setUploadProgress(10);

      // Upload and process video
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || error.details || "Failed to upload video"
        );
      }

      const data = await response.json();
      console.log("Video uploaded successfully:", data);

      setUploadProgress(95);

      // Save to your videos table
      const saveResponse = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          videoUrl: data.playlistUrl,
          thumbnailUrl: data.thumbnailUrl,
          duration: data.video.duration,
          pricePerSecond: parseFloat(pricePerSecond),
          category,
          tags: tags
            ? tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [],
          creatorId: address,
        }),
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        console.error("Failed to save metadata:", error);
        // Don't throw - video is already uploaded
      }

      setUploadProgress(100);
      setUploadedVideoUrl(data.playlistUrl);
      setUploadStep(5);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getQualityOptions = () => {
    return [
      { value: "4K", label: "4K (2160p)", multiplier: 1.0 },
      { value: "1080p", label: "Full HD (1080p)", multiplier: 0.75 },
      { value: "720p", label: "HD (720p)", multiplier: 0.5 },
      { value: "480p", label: "SD (480p)", multiplier: 0.35 },
      { value: "360p", label: "Low (360p)", multiplier: 0.2 },
    ];
  };

  const resetForm = () => {
    setUploadStep(1);
    setVideoFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    setPricePerSecond("0.01");
    setMaxQuality("1080p");
    setThumbnail(null);
    setThumbnailPreview(null);
    setUploadError(null);
    setUploadProgress(0);
    setUploadedVideoUrl("");
    setCategory("Education");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />

      {/* Creator Tool Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
                <UploadIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">
                  Creator Studio - Upload
                </h2>
                <p className="text-blue-100 text-sm">
                  Share your content and start earning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/advertise" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Advertise
                </Button>
              </Link>
              <Badge className="bg-white/20 text-white border-white/30 hidden sm:flex">
                Creator Tool
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-gray-300">
            Share your content and earn with x402 micropayments
          </p>
        </div>

        {/* Upload Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step <= uploadStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  } ${
                    step === uploadStep
                      ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950"
                      : ""
                  }`}
                >
                  {step < uploadStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 transition-all ${
                      step < uploadStep ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <div className="text-sm text-gray-400 font-medium">
              {uploadStep === 1 && "Upload Video"}
              {uploadStep === 2 && "Video Details"}
              {uploadStep === 3 && "Pricing & Settings"}
              {uploadStep === 4 && "Review & Publish"}
              {uploadStep === 5 && "Complete!"}
            </div>
          </div>
        </div>

        {/* Step 1: Upload Video */}
        {uploadStep === 1 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-blue-500 transition-colors cursor-pointer">
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
                    <Button
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <span>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Select Video File
                      </span>
                    </Button>
                  </label>

                  <div className="mt-6 text-sm text-gray-400 space-y-1">
                    <p>Supported formats: MP4, MOV, AVI, WMV</p>
                    <p>Maximum file size: 500MB</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Your video will be processed into HLS format for streaming
                    </p>
                  </div>

                  {uploadError && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <p className="text-red-400 text-sm">{uploadError}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Video Details */}
        {uploadStep === 2 && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Video Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Add information about your video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoFile && (
                  <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Selected file:</p>
                        <p className="text-white font-medium">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(videoFile.size)}
                        </p>
                      </div>
                      <Video className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe your video content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Tags
                  </label>
                  <Input
                    placeholder="Enter tags separated by commas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: blockchain, tutorial, crypto, x402
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Thumbnail (Optional)
                  </label>
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload">
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer text-center">
                          <UploadIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400">
                            Click to upload thumbnail
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1280x720px. If not provided, a thumbnail will
                    be auto-generated.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setUploadStep(1)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={() => setUploadStep(3)}
                disabled={!title.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Pricing
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Settings */}
        {uploadStep === 3 && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set your video pricing and quality options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Price per Second (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.001"
                        min="0.001"
                        max="1"
                        placeholder="0.010"
                        value={pricePerSecond}
                        onChange={(e) => setPricePerSecond(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: $0.005 - $0.020 per second
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Maximum Quality
                    </label>
                    <Select value={maxQuality} onValueChange={setMaxQuality}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {getQualityOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher quality = better viewing experience
                    </p>
                  </div>
                </div>

                {/* Pricing Preview */}
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
                  <h4 className="font-medium text-blue-300 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Pricing Preview (5 min video example)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getQualityOptions()
                      .filter(
                        (q) =>
                          q.multiplier <=
                          getQualityOptions().find(
                            (opt) => opt.value === maxQuality
                          )?.multiplier!
                      )
                      .map((option) => (
                        <div
                          key={option.value}
                          className="text-center bg-gray-900/50 p-3 rounded-lg"
                        >
                          <Badge
                            variant="outline"
                            className="mb-2 border-blue-500 text-blue-300"
                          >
                            {option.value}
                          </Badge>
                          <p className="font-bold text-white text-lg">
                            $
                            {(
                              parseFloat(pricePerSecond) *
                              option.multiplier *
                              300
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">per 5 min</p>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Viewers pay only for what they watch. Quality adjusts
                    automatically based on connection.
                  </p>
                </div>

                {/* Upload Fee Info */}
                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-300 mb-1">
                        Upload Fee
                      </h4>
                      <p className="text-sm text-amber-400">
                        A one-time fee of <strong>$0.50</strong> (paid via x402)
                        is required to upload to xStream. This helps maintain
                        platform quality and covers storage costs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Fee Info */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    Creator Earnings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Revenue Share:</span>
                      <span className="text-green-400 font-medium">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee:</span>
                      <span className="text-gray-300">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setUploadStep(2)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={() => setUploadStep(4)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Review & Publish
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Publishing */}
        {uploadStep === 4 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Ready to Publish
              </CardTitle>
              <CardDescription className="text-gray-400">
                Review your video details and publish to xStream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Summary */}
              <div className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                <h4 className="font-medium mb-4 text-white flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Video Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Title:</span>
                    <p className="font-medium text-white mt-1">
                      {title || "Untitled Video"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="font-medium text-white mt-1">{category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Max Quality:</span>
                    <p className="font-medium text-white mt-1">{maxQuality}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Price per Second:</span>
                    <p className="font-medium text-white mt-1">
                      ${pricePerSecond}
                    </p>
                  </div>
                  {videoFile && (
                    <div>
                      <span className="text-gray-400">File Size:</span>
                      <p className="font-medium text-white mt-1">
                        {formatFileSize(videoFile.size)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Upload Fee:</span>
                    <p className="font-medium text-white mt-1">
                      $0.50 (via x402)
                    </p>
                  </div>
                  {tags && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Tags:</span>
                      <p className="font-medium text-white mt-1">{tags}</p>
                    </div>
                  )}
                  {description && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Description:</span>
                      <p className="font-medium text-white mt-1 text-sm">
                        {description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">
                  Creator Agreement
                </h4>
                <div className="text-sm text-gray-400 space-y-2">
                  <p className="text-white mb-2">
                    By publishing, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>xStream's Terms of Service and Creator Guidelines</li>
                    <li>
                      Instant settlement of viewer payments to your connected
                      wallet
                    </li>
                    <li>Quality-based pricing as configured above</li>
                    <li>Platform fee of 5% on all viewer payments</li>
                    <li>
                      Content ownership and responsibility for uploaded material
                    </li>
                  </ul>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">
                      Processing video...
                    </span>
                    <span className="text-sm text-blue-400 font-bold">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300 relative"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    {uploadProgress < 10 && "Uploading video file..."}
                    {uploadProgress >= 10 &&
                      uploadProgress < 90 &&
                      "Processing with FFmpeg and creating HLS segments..."}
                    {uploadProgress >= 90 &&
                      uploadProgress < 95 &&
                      "Uploading segments to MinIO..."}
                    {uploadProgress >= 95 && "Finalizing upload..."}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-300 mb-1">
                        Upload Failed
                      </h4>
                      <p className="text-sm text-red-400">{uploadError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadError(null)}
                        className="mt-3 border-red-700 text-red-300 hover:bg-red-900/30"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Connection Notice */}
              {!isConnected && (
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-300 mb-1">
                        Wallet Not Connected
                      </h4>
                      <p className="text-sm text-yellow-400">
                        Please connect your wallet to publish your video and
                        receive payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep(3)}
                  disabled={isUploading}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || !isConnected}
                  className="bg-green-600 hover:bg-green-700 min-w-[200px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

        {/* Step 5: Success Message */}
        {uploadStep === 5 && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-800">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isConnected && address ? (
                    <span className="flex items-center justify-center gap-2">
                      🎉 Congratulations,{" "}
                      <Name address={address} className="text-blue-400" />!
                    </span>
                  ) : (
                    <>Video Published Successfully!</>
                  )}
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Your video is now live on xStream and ready for viewers to
                  watch. Start earning with every second watched!
                </p>

                {/* Success Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <p className="text-gray-400 text-sm mb-1">Video Title</p>
                    <p className="text-white font-medium">{title}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <p className="text-gray-400 text-sm mb-1">Pricing</p>
                    <p className="text-white font-medium">
                      ${pricePerSecond}/second
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <p className="text-gray-400 text-sm mb-1">Max Quality</p>
                    <p className="text-white font-medium">{maxQuality}</p>
                  </div>
                </div>

                {uploadedVideoUrl && (
                  <div className="bg-gray-900/50 p-4 rounded-lg mb-6 text-sm border border-gray-800">
                    <p className="text-gray-400 mb-2">HLS Stream URL:</p>
                    <code className="text-blue-400 break-all text-xs block bg-black/30 p-2 rounded">
                      {uploadedVideoUrl}
                    </code>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/browse">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Videos
                    </Button>
                  </Link>
                  <Button
                    onClick={resetForm}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Another Video
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What's Next Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">What's Next?</CardTitle>
                <CardDescription className="text-gray-400">
                  Tips to maximize your video's success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Target className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Promote Your Video
                        </h4>
                        <p className="text-sm text-gray-400">
                          Create an ad campaign to reach more viewers and boost
                          earnings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Track Earnings
                        </h4>
                        <p className="text-sm text-gray-400">
                          Monitor your video performance and earnings in
                          real-time
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Video className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Upload More Content
                        </h4>
                        <p className="text-sm text-gray-400">
                          Keep your audience engaged with regular uploads
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Engage Your Audience
                        </h4>
                        <p className="text-sm text-gray-400">
                          Build a loyal following with quality content
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promote Video with Ads CTA */}
            <Card className="border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 animate-pulse"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg shadow-blue-500/50">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Want More Views? Try Advertising! 🚀
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Promote your video to the right audience with xStream's
                      targeted advertising. Pay only for actual views, and earn
                      even when viewers skip!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pay-Per-View
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Skip Revenue Share
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                        <Target className="h-3 w-3 mr-1" />
                        Precision Targeting
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Link href="/advertise">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                      >
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
