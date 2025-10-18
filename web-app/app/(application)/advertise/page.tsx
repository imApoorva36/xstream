"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  PlayCircle,
  Upload,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";

export default function AdvertisePage() {
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [targetVideo, setTargetVideo] = useState("");
  const [adBudget, setAdBudget] = useState("");
  const [adDuration, setAdDuration] = useState("30");

  // Mock data for existing campaigns
  const adCampaigns = [
    {
      id: "1",
      title: "Base Blockchain Tutorial",
      targetVideo: "Introduction to x402",
      budget: 50.00,
      spent: 23.45,
      views: 1240,
      skips: 89,
      status: "active"
    },
    {
      id: "2",
      title: "DeFi Investment Guide",
      targetVideo: "Building on Base",
      budget: 100.00,
      spent: 67.80,
      views: 2850,
      skips: 234,
      status: "active"
    }
  ];

  const adStats = [
    {
      title: "Total Ad Spend",
      value: "$1,234",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-gray-400"
    },
    {
      title: "Total Views",
      value: "45.2K",
      change: "+18.3%",
      icon: Eye,
      color: "text-gray-400"
    },
    {
      title: "Skip Rate",
      value: "15.4%",
      change: "-5.2%",
      icon: Target,
      color: "text-gray-400"
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      icon: TrendingUp,
      color: "text-gray-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-lg">
      <div className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src='/logo.png' alt='xStream Logo' width={36} height={36} />
              <div>
                <h2 className="text-white font-base text-lg">Creator Studio - Advertising</h2>
                <p className="text-gray-300 font-light text-xs">Reach your audience with targeted ads</p>
              </div>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 hidden sm:flex">
              Creator Tool
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col items-start gap-3 mb-4">
            <h1 className="text-4xl font-medium text-white">Advertise on xStream</h1>
            <p className="text-gray-300 text-sm font-light">Create campaigns, track performance, and grow your reach</p>
          </div>
        </div>

        <Tabs defaultValue="create" className="mb-8 text-sm font-light">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="create" className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border">
              <Upload className="w-4 h-4" />
              Create Ad
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border">
              <Settings className="w-4 h-4" />
              My Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Ad Tab */}
          <TabsContent value="create" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ad Creation Form */}
              <div className="space-y-6">
                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Upload className="h-5 w-5" />
                      <span>Create New Ad</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload your ad and set targeting preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Ad Title</label>
                      <Input
                        placeholder="Enter ad title"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Description</label>
                      <Textarea
                        placeholder="Describe your ad"
                        value={adDescription}
                        onChange={(e) => setAdDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Ad Video</label>
                      <div className="border-2 border-dashed border-white/10 rounded-md p-6 text-center bg-white/5">
                        <PlayCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400 mb-2">
                          Upload your ad video
                        </p>
                        <Button variant="outline" size="sm" className="border-white/20 text-gray-200">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Max duration: 60 seconds | Formats: MP4, MOV
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Ad Duration</label>
                      <Select value={adDuration} onValueChange={setAdDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ad Preview & Pricing */}
              <div className="space-y-6">
                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Pricing Model</CardTitle>
                    <CardDescription className="text-gray-400">
                      xStream's unique ad pricing system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-md border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-slate-200" />
                          <span className="font-base text-white">Pay-Per-View Model</span>
                        </div>
                        <p className="text-xs font-light text-gray-400">
                          You only pay when viewers actually watch your ad, not for impressions
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-md border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-slate-200" />
                          <span className="font-base text-white">Skip Revenue Share</span>
                        </div>
                        <p className="text-xs font-light text-gray-400">
                          When viewers skip ads, they pay via x402 - creators and you both earn
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-md border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-slate-200" />
                          <span className="base text-white">Quality Targeting</span>
                        </div>
                        <p className="text-xs font-light text-gray-400">
                          Target viewers by video quality preference and engagement patterns
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="h-5 w-5" />
                      <span>Targeting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Target Video</label>
                      <Select value={targetVideo} onValueChange={setTargetVideo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a video to show your ad on" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intro-x402">Introduction to x402 Micropayments</SelectItem>
                          <SelectItem value="base-dev">Building on Base: Developer Guide</SelectItem>
                          <SelectItem value="nft-rewards">NFT Rewards & Loyalty Programs</SelectItem>
                          <SelectItem value="any">Any video (platform choice)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Choose specific videos or let xStream optimize placement
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Budget (USD)</label>
                      <Input
                        type="number"
                        placeholder="50.00"
                        value={adBudget}
                        onChange={(e) => setAdBudget(e.target.value)}
                        min="10"
                        step="1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum budget: $10 | You pay only when viewers watch your ad
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Cost Estimate Card - always at bottom */}
            <div className="mt-6">
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Cost Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Base cost per view:</span>
                      <span className="font-medium text-white">$0.02</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Estimated views with ${adBudget || '0'} budget:</span>
                      <span className="font-medium text-white">{adBudget ? Math.floor(parseFloat(adBudget) / 0.02) : 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Platform fee (10%):</span>
                      <span className="font-medium text-white">${adBudget ? (parseFloat(adBudget) * 0.1).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium text-white">
                        <span>Total budget needed:</span>
                        <span>${adBudget ? (parseFloat(adBudget) * 1.1).toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" disabled={!adTitle || !adBudget}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Ad Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="campaigns" className="mt-8 space-y-6">
            <div className="space-y-4">
              {adCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center">
                          <PlayCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{campaign.title}</h4>
                          <p className="text-sm text-gray-400">Target: {campaign.targetVideo}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {campaign.views.toLocaleString()} views
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">
                          ${campaign.spent.toFixed(2)} / ${campaign.budget.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {campaign.skips} skips ({((campaign.skips / campaign.views) * 100).toFixed(1)}%)
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" className="border-white/20 text-gray-200">
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-gray-200">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Stats
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-8 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adStats.map((stat, index) => (
                <Card key={index} className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-medium text-white">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.color.replace('600', '400')}`}>{stat.change} this week</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color.replace('600', '400')}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Key metrics and recommendations for your ad campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-gray-300" />
                      <span className="font-base text-gray-300">
                        High Engagement
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Your "Base Blockchain Tutorial" ad has 85% completion rate - consider increasing budget
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-gray-300" />
                      <span className="font-base text-gray-300">
                        Peak Hours
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Best performance between 7-9 PM on weekdays - optimize your scheduling
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-gray-300" />
                      <span className="font-base text-gray-300">
                        Audience Preference
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Viewers prefer 30-second ads over 60-second ones - 23% better completion rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}