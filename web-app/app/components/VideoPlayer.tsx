"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  DollarSign, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Wallet
} from "lucide-react";

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    creator: string;
    duration: string;
    pricePerSecond: number;
    maxQuality: string;
    videoUrl?: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState(video.maxQuality);
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [currentSpent, setCurrentSpent] = useState(0);
  const [isStaked, setIsStaked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Calculate quality multiplier for pricing
  const getQualityMultiplier = (selectedQuality: string) => {
    const qualityMap: { [key: string]: number } = {
      '4K': 1.0,
      '1080p': 0.75,
      '720p': 0.5,
      '480p': 0.35,
      '240p': 0.2
    };
    return qualityMap[selectedQuality] || 1.0;
  };

  // Calculate current price per second based on quality
  const getCurrentPricePerSecond = () => {
    return video.pricePerSecond * getQualityMultiplier(quality);
  };

  // Calculate total video cost
  const calculateTotalCost = () => {
    const [minutes, seconds] = video.duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    return (getCurrentPricePerSecond() * totalSeconds).toFixed(2);
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (!isStaked) {
      setShowStakeDialog(true);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle stake submission
  const handleStakeSubmit = () => {
    const totalCost = parseFloat(calculateTotalCost());
    const userStake = parseFloat(stakeAmount);

    if (userStake >= totalCost) {
      setIsStaked(true);
      setShowStakeDialog(false);
      setShowPaymentConfirm(false);
      // Here you would integrate with x402 to actually stake the amount
    } else {
      alert(`Minimum stake required: $${totalCost}`);
    }
  };

  // Handle payment confirmation before watching
  const handlePaymentConfirm = () => {
    setShowPaymentConfirm(false);
    togglePlayPause();
  };

  // Update spending based on watch time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isStaked) {
      interval = setInterval(() => {
        setCurrentSpent(prev => prev + getCurrentPricePerSecond());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isStaked, quality]);

  // Available quality options (simplified for demo)
  const qualityOptions = ['4K', '1080p', '720p', '480p', '240p'].filter(q => 
    getQualityMultiplier(q) <= getQualityMultiplier(video.maxQuality)
  );

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full"
            src={video.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setCurrentTime(0)}
          />
          
          {/* Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-4">
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
              onClick={(e) => {
                if (videoRef.current && progressBarRef.current) {
                  const rect = progressBarRef.current.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * videoRef.current.duration;
                  videoRef.current.currentTime = newTime;
                }
              }}
            >
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ 
                  width: videoRef.current ? `${(currentTime / videoRef.current.duration) * 100}%` : '0%' 
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:text-blue-400"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-blue-400"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>

                <span className="text-sm">
                  {formatTime(currentTime)} / {video.duration}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quality Selector */}
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="w-24 h-8 bg-black/50 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-blue-400"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stake Required Overlay */}
          {!isStaked && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
              <Card className="max-w-md w-full mx-4">
                <CardContent className="p-6 text-center">
                  <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">Stake to Watch</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Stake funds to start watching. You'll only be charged for what you actually watch.
                  </p>
                  <Button onClick={() => setShowStakeDialog(true)} className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Stake ${calculateTotalCost()}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Info */}
      {isStaked && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Staked
                </Badge>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current spend: </span>
                  <span className="font-semibold">${currentSpent.toFixed(4)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Rate: </span>
                  <span className="font-semibold">${getCurrentPricePerSecond().toFixed(4)}/sec</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-base">Quality: {quality}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stake Funds to Watch</DialogTitle>
            <DialogDescription>
              Stake the maximum amount you're willing to spend. You'll only be charged for the time you actually watch.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-base">Recommended Stake:</span>
                <span className="text-lg font-medium text-blue-600">${calculateTotalCost()}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                For full video at {quality} quality
              </p>
            </div>

            <div>
              <label className="block text-sm font-base mb-2">Stake Amount (USD)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min={calculateTotalCost()}
                step="0.01"
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              • Minimum stake: ${calculateTotalCost()}<br/>
              • Unused funds will be automatically refunded<br/>
              • Charges are calculated per second watched
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStakeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStakeSubmit}>
              <Wallet className="h-4 w-4 mr-2" />
              Stake ${stakeAmount || calculateTotalCost()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Starting playback will begin charging ${getCurrentPricePerSecond().toFixed(4)} per second.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 border rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="font-base">Payment Authorization</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This video will charge you based on your watch time and selected quality.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentConfirm}>
              <Play className="h-4 w-4 mr-2" />
              Start Watching
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
