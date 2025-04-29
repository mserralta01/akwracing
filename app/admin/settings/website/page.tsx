"use client";

import { useState, useEffect } from 'react';
import { WebsiteContent, settingsService } from '@/lib/services/settings-service';
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle, Info, HelpCircle, FileText, ExternalLink, AlertCircle, Brain, Car, Clock, Heart, Activity, Trophy, Target, Users, Handshake, Star } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { storageService } from '@/lib/services/storage-service';

export default function WebsiteSettingsPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [isHelpOpen, setIsHelpOpen] = useState(true);
  const [justSavedSection, setJustSavedSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const websiteContent = await settingsService.getWebsiteContent();
        console.log('Loaded website content:', websiteContent);
        setContent(websiteContent);
      } catch (error) {
        console.error('Error loading website content:', error);
        toast({
          title: "Error",
          description: "Failed to load website content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [toast]);

  const handleSave = async (sectionName: string) => {
    if (!content || justSavedSection) return;

    try {
      const sectionToUpdate = { 
        [sectionName]: content[sectionName as keyof WebsiteContent] 
      };
      
      console.log(`Saving ${sectionName} section:`, sectionToUpdate);
      
      await settingsService.updateWebsiteContent(sectionToUpdate);
      
      toast({
        title: "Success",
        description: "Website content updated successfully",
      });
      setJustSavedSection(sectionName);
      setTimeout(() => setJustSavedSection(null), 1500);
    } catch (error) {
      console.error('Error updating website content:', error);
      toast({
        title: "Error",
        description: "Failed to update website content",
        variant: "destructive",
      });
    }
  };

  const handleStringChange = (section: keyof WebsiteContent, field: string, value: string) => {
    if (!content) return;
    
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    });
  };

  const handleArrayItemChange = (
    section: keyof WebsiteContent,
    arrayField: string,
    index: number,
    field: string,
    value: string | any[]
  ) => {
    if (!content) return;

    const newArray = [...(content[section] as any)[arrayField]];
    newArray[index] = { ...newArray[index], [field]: value };

    setContent({
      ...content,
      [section]: {
        ...content[section],
        [arrayField]: newArray
      }
    });
  };

  const addArrayItem = (section: keyof WebsiteContent, arrayField: string, template: any) => {
    if (!content) return;

    const newArray = [...(content[section] as any)[arrayField], template];

    setContent({
      ...content,
      [section]: {
        ...content[section],
        [arrayField]: newArray
      }
    });
  };

  const removeArrayItem = (section: keyof WebsiteContent, arrayField: string, index: number) => {
    if (!content) return;

    const newArray = [...(content[section] as any)[arrayField]];
    newArray.splice(index, 1);

    setContent({
      ...content,
      [section]: {
        ...content[section],
        [arrayField]: newArray
      }
    });
  };

  const handleImageUpload = async (section: keyof WebsiteContent, field: string, file: File | null) => {
    if (!content) return;

    if (file) {
      try {
        // Show loading state
        toast({
          title: "Uploading...",
          description: "Please wait while we upload your image",
        });
        
        // Upload the image to Firebase Storage
        const imageUrl = await storageService.uploadWebsiteImage(file, `${section}-${field}`);
        
        // Update the content with the permanent URL
        handleStringChange(section, field, imageUrl);
        
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      handleStringChange(section, field, '');
    }
  };

  const initializeAllContent = async () => {
    try {
      console.log("Initializing all website content with defaults");
      const defaultContent = settingsService.getDefaultWebsiteContent();
      setContent(defaultContent);
      await settingsService.updateWebsiteContent(defaultContent);
      
      toast({
        title: "Success",
        description: "Website content initialized with default values",
      });
    } catch (error) {
      console.error('Error initializing website content:', error);
      toast({
        title: "Error",
        description: "Failed to initialize website content",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !content) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-4 text-lg">Loading website content...</p>
    </div>;
  }

  const heroContent = content?.hero || { title: '', description: '', videoUrl: '' };
  const aboutContent = content?.about || { title: '', description: '', features: [], imageUrl: '' };
  const benefitsContent = content?.benefits || { title: '', items: [] };
  const partnersContent = content?.partners || { title: '', description: '', items: [] };
  const facilitiesContent = content?.facilities || { title: '', description: '', items: [] };
  const teamContent = content?.team || { title: '', description: '' };
  const contactContent = content?.contact || { title: '', description: '', address: '', phone: '', email: '' };
  
  return (
    <div className="space-y-6 pb-10">
      <TooltipProvider>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold">Website Content Manager</h1>
            <p className="text-muted-foreground mt-1">Customize your public website content with live previews</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={initializeAllContent}
                className="bg-amber-100 hover:bg-amber-200 border-amber-300 flex gap-2"
              >
                <FileText className="h-4 w-4" />
                Reset All Content
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore all website content to default values</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen} className="mb-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-500" />
            <AlertTitle className="text-blue-700 flex items-center gap-2">
              Website Content Editor Guide
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 rounded-full">
                  {isHelpOpen ? "Hide Tips" : "Show Tips"}
                </Button>
              </CollapsibleTrigger>
            </AlertTitle>
            <CollapsibleContent>
              <AlertDescription className="mt-3 text-blue-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 h-5 w-5 p-0 flex items-center justify-center">1</Badge>
                    <span>Select any section tab to edit content for that part of your website</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 h-5 w-5 p-0 flex items-center justify-center">2</Badge>
                    <span>Use the rich text editor to format content with styling options</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                    <span>Remember to save each section after making changes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 border-t border-blue-200 pt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    <span>Changes will be reflected immediately on your public website</span>
                  </div>
                  <a 
                    href="https://lucide.dev/icons" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Lucide Icons Reference</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </AlertDescription>
            </CollapsibleContent>
          </Alert>
        </Collapsible>

        <Tabs 
          defaultValue="hero" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="hero" className="flex items-center gap-1">Hero</TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-1">About</TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-1">Benefits</TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-1">Partners</TabsTrigger>
            <TabsTrigger value="facilities" className="flex items-center gap-1">Facilities</TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">Team</TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                      Hero Section
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>The hero section is the first thing visitors see on your website. Make it impactful and clear.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>
                      Update the main hero section of your homepage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hero-title" className="text-sm font-medium">Title</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Keep your title short and compelling (2-8 words recommended)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        id="hero-title" 
                        value={heroContent.title} 
                        onChange={(e) => handleStringChange('hero', 'title', e.target.value)}
                        placeholder="Enter a captivating title"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hero-description" className="text-sm font-medium">Description</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Write a brief, engaging description that explains your value proposition</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <RichTextEditor 
                        content={heroContent.description} 
                        onChange={(value) => handleStringChange('hero', 'description', value)}
                        placeholder="Describe your academy and what makes it unique..."
                        className="min-h-[150px] border rounded-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hero-video" className="text-sm font-medium">Video URL</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p>For best results, use a high-quality MP4 file hosted on a fast CDN</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        id="hero-video" 
                        value={heroContent.videoUrl} 
                        onChange={(e) => handleStringChange('hero', 'videoUrl', e.target.value)}
                        placeholder="https://example.com/videos/racing.mp4"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Enter the full URL to your background video (MP4 format recommended)</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t flex justify-between">
                    <div className="text-xs text-muted-foreground">Last edited: Today</div>
                    <Button 
                      onClick={() => handleSave('hero')}
                      disabled={justSavedSection === 'hero'}
                      className={cn(
                        "bg-green-600 hover:bg-green-700 text-white",
                        justSavedSection === 'hero' && "bg-green-100 text-green-800"
                      )}
                    >
                      {justSavedSection === 'hero' ? 'Saved!' : 'Save Hero Section'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="hidden md:block">
                <Card>
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-sm">Preview</CardTitle>
                    <CardDescription>
                      How your hero section might appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-hidden h-[320px] bg-slate-100 relative">
                    {heroContent.videoUrl ? (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 p-4">
                          <h1 className="text-2xl font-bold text-white">{heroContent.title || "Your Academy Title"}</h1>
                          <div className="text-sm text-white/90 mt-2" dangerouslySetInnerHTML={{ __html: heroContent.description || "Your academy description will appear here" }} />
                        </div>
                        <div className="absolute inset-0 z-0 flex items-center justify-center text-slate-400">
                          {heroContent.videoUrl && <ExternalLink className="h-12 w-12" />}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                        <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-slate-500">Add a video URL to see a preview</p>
                        <p className="text-xs text-slate-400 mt-1">Preview is for guidance only and may differ from the actual website</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t">
                    <div className="w-full text-center text-xs text-slate-500">
                      <a href="/" target="_blank" className="flex items-center justify-center gap-1 hover:text-primary transition-colors">
                        View live website <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    About Section
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>The About section helps visitors understand your academy's story and unique offerings.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    Update the about section of your homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="about-title" className="text-sm font-medium">Section Title</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Choose a title that reflects your academy's mission</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input 
                          id="about-title" 
                          value={aboutContent.title} 
                          onChange={(e) => handleStringChange('about', 'title', e.target.value)}
                          placeholder="About Our Academy"
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="about-description" className="text-sm font-medium">Description</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Tell your story and explain what makes your academy special</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <RichTextEditor 
                          content={aboutContent.description} 
                          onChange={(value) => handleStringChange('about', 'description', value)}
                          placeholder="Share your academy's story, mission, and vision..."
                          className="min-h-[200px] border rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Key Features</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Highlight 3-5 key features or advantages of your academy</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-md border">
                          {aboutContent.features.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                              <p>No features added yet</p>
                              <p className="text-xs mt-1">Add features to highlight what makes your academy special</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                              {aboutContent.features.map((feature, index) => (
                                <div key={index} className="flex gap-2 items-center group">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                                    {index + 1}
                                  </div>
                                  <Input
                                    value={feature}
                                    onChange={(e) => {
                                      const newFeatures = [...aboutContent.features];
                                      newFeatures[index] = e.target.value;
                                      setContent({
                                        ...content,
                                        about: {
                                          ...content.about,
                                          features: newFeatures
                                        }
                                      });
                                    }}
                                    className="flex-1 transition-all focus:ring-2 focus:ring-primary/20"
                                  />
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem('about', 'features', index)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Remove this feature</TooltipContent>
                                  </Tooltip>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            variant="outline"
                            className="mt-4 w-full flex items-center justify-center gap-1 border-dashed"
                            onClick={() => {
                              const newFeatures = [...aboutContent.features, ""];
                              setContent({
                                ...content,
                                about: {
                                  ...content.about,
                                  features: newFeatures
                                }
                              });
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> Add Feature
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="about-image" className="text-sm font-medium">Feature Image</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Upload a high-quality image that represents your academy (recommended size: 800×600px)</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <ImageUpload
                          preloadedImage={aboutContent.imageUrl ? { 
                            preview: aboutContent.imageUrl, 
                            name: aboutContent.imageUrl.split('/').pop() || 'current-image', 
                            size: 0,
                            type: 'image/*'
                          } : null}
                          onChange={(file) => handleImageUpload('about', 'imageUrl', file)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t flex justify-between">
                  <div className="text-xs text-muted-foreground">Last edited: Today</div>
                  <Button 
                    onClick={() => handleSave('about')}
                    className={cn(
                      "relative group overflow-hidden transition-colors duration-200",
                      justSavedSection === 'about' && "bg-green-600 hover:bg-green-700"
                    )}
                    disabled={justSavedSection === 'about'}
                  >
                    <span className="relative z-10">
                      {justSavedSection === 'about' ? "Saved!" : "Save About Section"}
                    </span>
                    {justSavedSection !== 'about' && (
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Benefits Section
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>The Benefits section highlights the advantages of karting for children. Each benefit should be compelling and easy to understand.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>
                      Update the benefits section of your homepage
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-amber-100 hover:bg-amber-200 border-amber-300"
                        onClick={async () => {
                          try {
                            const websiteBenefits = {
                              title: "Why Karting for Your Child?",
                              items: [
                                {
                                  title: "Professional Racing Pathway",
                                  description: "Follow in the footsteps of F1 champions who started karting at ages 5-7. Open doors to racing academies and professional teams.",
                                  iconName: "Trophy"
                                },
                                {
                                  title: "Cognitive Development",
                                  description: "Enhance quick decision-making, spatial awareness, and strategic thinking while processing information under pressure.",
                                  iconName: "Brain"
                                },
                                {
                                  title: "Personal Growth",
                                  description: "Build confidence, discipline, and resilience through handling victory and defeat, developing a strong work ethic.",
                                  iconName: "Heart"
                                },
                                {
                                  title: "Social Skills",
                                  description: "Make lifelong friendships with like-minded peers while developing sportsmanship in a supportive racing community.",
                                  iconName: "Users"
                                },
                                {
                                  title: "Active Lifestyle",
                                  description: "Trade screen time for an exciting sport that improves physical fitness, hand-eye coordination, and reflexes.",
                                  iconName: "Activity"
                                },
                                {
                                  title: "Goal Setting",
                                  description: "Progress from basic skills to racing, developing a growth mindset and determination through achievement milestones.",
                                  iconName: "Target"
                                },
                                {
                                  title: "Time Management",
                                  description: "Learn to balance practice schedules, race preparation, and academics while developing organizational skills.",
                                  iconName: "Clock"
                                },
                                {
                                  title: "Team Collaboration",
                                  description: "Experience the power of teamwork through pit crew coordination, strategy planning, and supporting fellow racers in a collaborative environment.",
                                  iconName: "Handshake"
                                },
                                {
                                  title: "Future Driving Excellence",
                                  description: "Develop advanced vehicle control, safety awareness, and crisis management skills that translate into becoming a more capable and responsible future driver.",
                                  iconName: "Car"
                                }
                              ]
                            };
                            
                            setContent({
                              ...content,
                              benefits: websiteBenefits
                            });
                            
                            await settingsService.updateWebsiteContent({ 
                              benefits: websiteBenefits 
                            });
                            
                            toast({
                              title: "Success",
                              description: "Benefits section reset to match website",
                            });
                          } catch (error) {
                            console.error('Error resetting benefits section:', error);
                            toast({
                              title: "Error",
                              description: "Failed to reset benefits section",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Reset Benefits
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset to the default benefits from the website</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="benefits-title" className="text-sm font-medium">Section Title</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>The default title "Why Karting for Your Child?" works well for most academies</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    id="benefits-title" 
                    value={benefitsContent.title} 
                    onChange={(e) => handleStringChange('benefits', 'title', e.target.value)}
                    placeholder="Why Karting for Your Child?"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Benefits section uses default title: "Why Karting for Your Child?"</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Benefits</Label>
                    <div className="flex items-center gap-3">
                      <a 
                        href="https://lucide.dev/icons" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        Browse Lucide Icons
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {benefitsContent.items.length} Items
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {benefitsContent.items.map((item, index) => (
                      <Card key={index} className="group overflow-hidden border-slate-200 hover:border-primary/50 transition-colors">
                        <CardHeader className="p-4 bg-slate-50 border-b flex justify-between items-start space-y-0">
                          <div className="space-y-1">
                            <Badge 
                              variant="outline" 
                              className="bg-primary/10 text-primary border-primary/20 mb-1"
                            >
                              Benefit #{index + 1}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className="p-1 rounded-md bg-primary/10 text-primary">
                                <span className="font-mono text-xs">{item.iconName}</span>
                              </div>
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeArrayItem('benefits', 'items', index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove this benefit</TooltipContent>
                          </Tooltip>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Title</Label>
                            <Input 
                              value={item.title} 
                              onChange={(e) => handleArrayItemChange('benefits', 'items', index, 'title', e.target.value)}
                              className="transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <Textarea 
                              value={item.description} 
                              onChange={(e) => handleArrayItemChange('benefits', 'items', index, 'description', e.target.value)}
                              rows={3}
                              className="transition-all focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Icon Name</Label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent side="left" className="w-[260px]">
                                  <p className="mb-1">Popular Lucide icon names:</p>
                                  <div className="grid grid-cols-4 gap-1 text-xs">
                                    <span>Trophy</span>
                                    <span>Target</span>
                                    <span>Users</span>
                                    <span>Heart</span>
                                    <span>Brain</span>
                                    <span>Activity</span>
                                    <span>Clock</span>
                                    <span>Car</span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="relative">
                              <Input 
                                value={item.iconName} 
                                onChange={(e) => handleArrayItemChange('benefits', 'items', index, 'iconName', e.target.value)}
                                className="transition-all focus:ring-2 focus:ring-primary/20 pr-8"
                                placeholder="Icon name (e.g., Trophy)"
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href="https://lucide.dev/icons"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>View all Lucide icons</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                              <span>Example icons:</span>
                              <div className="flex items-center gap-2">
                                <Trophy className="h-3 w-3" />
                                <Heart className="h-3 w-3" />
                                <Brain className="h-3 w-3" />
                                <Clock className="h-3 w-3" />
                                <Target className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-slate-50/50 h-full min-h-[230px]">
                      <Button
                        variant="ghost"
                        className="h-auto p-6 flex flex-col gap-2 hover:bg-primary/5"
                        onClick={() => addArrayItem('benefits', 'items', {
                          title: "New Benefit",
                          description: "Describe this benefit in a few sentences that highlight the value for children.",
                          iconName: "Star"
                        })}
                      >
                        <PlusCircle className="h-8 w-8 text-muted-foreground" />
                        <span className="text-muted-foreground font-normal">Add New Benefit</span>
                      </Button>
                    </Card>
                  </div>
                  
                  <Alert className="bg-amber-50 border-amber-200 mt-6">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700">Recommended</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <p className="mb-2">For best results, include 6-9 benefits with concise titles and descriptions.</p>
                      <Button
                        variant="outline"
                        className="w-full bg-amber-100 hover:bg-amber-200 border-amber-300 mt-2"
                        onClick={() => {
                          const websiteBenefits = [
                            {
                              title: "Professional Racing Pathway",
                              description: "Follow in the footsteps of F1 champions who started karting at ages 5-7. Open doors to racing academies and professional teams.",
                              iconName: "Trophy"
                            },
                            {
                              title: "Cognitive Development",
                              description: "Enhance quick decision-making, spatial awareness, and strategic thinking while processing information under pressure.",
                              iconName: "Brain"
                            },
                            {
                              title: "Personal Growth",
                              description: "Build confidence, discipline, and resilience through handling victory and defeat, developing a strong work ethic.",
                              iconName: "Heart"
                            },
                            {
                              title: "Social Skills",
                              description: "Make lifelong friendships with like-minded peers while developing sportsmanship in a supportive racing community.",
                              iconName: "Users"
                            },
                            {
                              title: "Active Lifestyle",
                              description: "Trade screen time for an exciting sport that improves physical fitness, hand-eye coordination, and reflexes.",
                              iconName: "Activity"
                            },
                            {
                              title: "Goal Setting",
                              description: "Progress from basic skills to racing, developing a growth mindset and determination through achievement milestones.",
                              iconName: "Target"
                            },
                            {
                              title: "Time Management",
                              description: "Learn to balance practice schedules, race preparation, and academics while developing organizational skills.",
                              iconName: "Clock"
                            },
                            {
                              title: "Team Collaboration",
                              description: "Experience the power of teamwork through pit crew coordination, strategy planning, and supporting fellow racers in a collaborative environment.",
                              iconName: "Handshake"
                            },
                            {
                              title: "Future Driving Excellence",
                              description: "Develop advanced vehicle control, safety awareness, and crisis management skills that translate into becoming a more capable and responsible future driver.",
                              iconName: "Car"
                            }
                          ];

                          if (content?.benefits) {
                            setContent({
                              ...content,
                              benefits: {
                                ...content.benefits,
                                items: websiteBenefits
                              }
                            });
                          }
                        }}
                      >
                        Replace With Website Benefits (All 9)
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t flex justify-between">
                <div className="text-xs text-muted-foreground">Last edited: Today</div>
                <Button 
                  onClick={() => handleSave('benefits')}
                  className={cn(
                    "text-white transition-colors duration-200",
                    justSavedSection === 'benefits' 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                  disabled={justSavedSection === 'benefits'}
                >
                  {justSavedSection === 'benefits' ? "Saved!" : "Save Benefits Section"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Partners Section</CardTitle>
                <CardDescription>
                  Update the partners section of your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partners-title">Title</Label>
                  <Input 
                    id="partners-title" 
                    value={partnersContent.title} 
                    onChange={(e) => handleStringChange('partners', 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="partners-description">Description</Label>
                  <RichTextEditor 
                    content={partnersContent.description} 
                    onChange={(value) => handleStringChange('partners', 'description', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Partner Items</Label>
                  {partnersContent.items.map((item, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Partner #{index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('partners', 'items', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input 
                            value={item.name} 
                            onChange={(e) => handleArrayItemChange('partners', 'items', index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Logo Path</Label>
                          <Input 
                            value={item.logoPath} 
                            onChange={(e) => handleArrayItemChange('partners', 'items', index, 'logoPath', e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Path to the partner logo file (e.g., /images/partners/logo.png)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <RichTextEditor 
                            content={item.description} 
                            onChange={(value) => handleArrayItemChange('partners', 'items', index, 'description', value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Image Path</Label>
                          <Input 
                            value={item.imagePath} 
                            onChange={(e) => handleArrayItemChange('partners', 'items', index, 'imagePath', e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Path to the partner image file (e.g., /images/partners/image.png)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input 
                            value={item.link} 
                            onChange={(e) => handleArrayItemChange('partners', 'items', index, 'link', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Highlights</Label>
                          {item.highlights.map((highlight, hlIndex) => (
                            <div key={hlIndex} className="grid grid-cols-6 gap-2 mb-2">
                              <div className="col-span-1">
                                <Input
                                  value={highlight.icon}
                                  onChange={(e) => {
                                    const newHighlights = [...item.highlights];
                                    newHighlights[hlIndex] = {
                                      ...newHighlights[hlIndex],
                                      icon: e.target.value
                                    };
                                    handleArrayItemChange('partners', 'items', index, 'highlights', newHighlights);
                                  }}
                                  placeholder="Icon"
                                />
                              </div>
                              <div className="col-span-4">
                                <Input
                                  value={highlight.text}
                                  onChange={(e) => {
                                    const newHighlights = [...item.highlights];
                                    newHighlights[hlIndex] = {
                                      ...newHighlights[hlIndex],
                                      text: e.target.value
                                    };
                                    handleArrayItemChange('partners', 'items', index, 'highlights', newHighlights);
                                  }}
                                  placeholder="Text"
                                />
                              </div>
                              <div className="col-span-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const newHighlights = [...item.highlights];
                                    newHighlights.splice(hlIndex, 1);
                                    handleArrayItemChange('partners', 'items', index, 'highlights', newHighlights);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              const newHighlights = [...item.highlights, { icon: '🏆', text: 'New highlight' }];
                              handleArrayItemChange('partners', 'items', index, 'highlights', newHighlights);
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Highlight
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => addArrayItem('partners', 'items', {
                      name: "New Partner",
                      logoPath: "/images/partners/logo.png",
                      description: "Partner description goes here",
                      highlights: [{ icon: '🏆', text: 'Partner highlight' }],
                      imagePath: "/images/partners/image.png",
                      link: "/partners/new-partner"
                    })}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Partner
                  </Button>
                </div>
                
                <CardFooter className="bg-slate-50 border-t flex justify-between mt-6 pt-6">
                  <div className="text-xs text-muted-foreground">Last edited: Today</div>
                  <Button 
                    onClick={() => handleSave('partners')}
                    className={cn(
                      "transition-colors duration-200",
                      justSavedSection === 'partners' && "bg-green-600 hover:bg-green-700 text-white"
                    )}
                    disabled={justSavedSection === 'partners'}
                  >
                    {justSavedSection === 'partners' ? "Saved!" : "Save Partners Section"}
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facilities Section</CardTitle>
                <CardDescription>
                  Update the facilities section of your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilities-title">Title</Label>
                  <Input 
                    id="facilities-title" 
                    value={facilitiesContent.title} 
                    onChange={(e) => handleStringChange('facilities', 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facilities-description">Description</Label>
                  <RichTextEditor 
                    content={facilitiesContent.description} 
                    onChange={(value) => handleStringChange('facilities', 'description', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Facility Items</Label>
                  {facilitiesContent.items.map((item, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Facility #{index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('facilities', 'items', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input 
                            value={item.title} 
                            onChange={(e) => handleArrayItemChange('facilities', 'items', index, 'title', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <RichTextEditor 
                            content={item.description} 
                            onChange={(value) => handleArrayItemChange('facilities', 'items', index, 'description', value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Image Source</Label>
                          <Input 
                            value={item.imageSrc} 
                            onChange={(e) => handleArrayItemChange('facilities', 'items', index, 'imageSrc', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Image Alt Text</Label>
                          <Input 
                            value={item.imageAlt} 
                            onChange={(e) => handleArrayItemChange('facilities', 'items', index, 'imageAlt', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Class Name (Optional)</Label>
                          <Input 
                            value={item.className || ''} 
                            onChange={(e) => handleArrayItemChange('facilities', 'items', index, 'className', e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            CSS class for layout control (e.g., 'md:col-span-2')
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Features</Label>
                          {item.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...item.features];
                                  newFeatures[featureIndex] = e.target.value;
                                  handleArrayItemChange('facilities', 'items', index, 'features', newFeatures);
                                }}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const newFeatures = [...item.features];
                                  newFeatures.splice(featureIndex, 1);
                                  handleArrayItemChange('facilities', 'items', index, 'features', newFeatures);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              const newFeatures = [...item.features, "New facility feature"];
                              handleArrayItemChange('facilities', 'items', index, 'features', newFeatures);
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => addArrayItem('facilities', 'items', {
                      title: "New Facility",
                      description: "Description of the new facility",
                      features: ["Feature 1", "Feature 2"],
                      imageSrc: "/images/new-facility.jpg",
                      imageAlt: "New Facility Image",
                      className: ""
                    })}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Facility
                  </Button>
                </div>
                
                <CardFooter className="bg-slate-50 border-t flex justify-between mt-6 pt-6">
                  <div className="text-xs text-muted-foreground">Last edited: Today</div>
                  <Button 
                    onClick={() => handleSave('facilities')}
                    className={cn(
                      "transition-colors duration-200",
                      justSavedSection === 'facilities' && "bg-green-600 hover:bg-green-700 text-white"
                    )}
                    disabled={justSavedSection === 'facilities'}
                  >
                    {justSavedSection === 'facilities' ? "Saved!" : "Save Facilities Section"}
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Section</CardTitle>
                <CardDescription>
                  Update the team section of your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-title">Title</Label>
                  <Input 
                    id="team-title" 
                    value={teamContent.title} 
                    onChange={(e) => handleStringChange('team', 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <RichTextEditor 
                    content={teamContent.description} 
                    onChange={(value) => handleStringChange('team', 'description', value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Note: Team members are managed separately as dynamic content
                  </p>
                </div>
                
                <CardFooter className="bg-slate-50 border-t flex justify-between mt-6 pt-6">
                  <div className="text-xs text-muted-foreground">Last edited: Today</div>
                  <Button 
                    onClick={() => handleSave('team')}
                    className={cn(
                      "transition-colors duration-200",
                      justSavedSection === 'team' && "bg-green-600 hover:bg-green-700 text-white"
                    )}
                    disabled={justSavedSection === 'team'}
                  >
                    {justSavedSection === 'team' ? "Saved!" : "Save Team Section"}
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  Contact Section
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>The contact section provides visitors with ways to reach your academy. Make sure all information is accurate and up-to-date.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Update the contact section of your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-title" className="text-sm font-medium">Section Title</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>A simple title like "Contact Us" works well</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        id="contact-title" 
                        value={contactContent.title} 
                        onChange={(e) => handleStringChange('contact', 'title', e.target.value)}
                        placeholder="Contact Us"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-description" className="text-sm font-medium">Description</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>A brief introduction to how visitors can get in touch</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <RichTextEditor 
                        content={contactContent.description} 
                        onChange={(value) => handleStringChange('contact', 'description', value)}
                        placeholder="Let us know how we can help you..."
                        className="min-h-[150px] border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-address" className="text-sm font-medium">Address</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Include your full physical address</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea 
                        id="contact-address" 
                        value={contactContent.address} 
                        onChange={(e) => handleStringChange('contact', 'address', e.target.value)}
                        rows={3}
                        placeholder="123 Racing Lane, Speedway City, SP 12345"
                        className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Use line breaks for multi-line addresses</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-phone" className="text-sm font-medium">Phone</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Include your country code for international visitors</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        id="contact-phone" 
                        value={contactContent.phone} 
                        onChange={(e) => handleStringChange('contact', 'phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-email" className="text-sm font-medium">Email</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Use a professional email address that is checked regularly</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        id="contact-email" 
                        value={contactContent.email} 
                        onChange={(e) => handleStringChange('contact', 'email', e.target.value)}
                        placeholder="info@youracademy.com"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 mt-6">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700">Contact Form</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p>The website includes a built-in contact form that sends inquiries to the email address specified above.</p>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t flex justify-between">
                <div className="text-xs text-muted-foreground">Last edited: Today</div>
                <Button 
                  onClick={() => handleSave('contact')}
                  className={cn(
                    "relative group overflow-hidden transition-colors duration-200",
                    justSavedSection === 'contact' && "bg-green-600 hover:bg-green-700"
                  )}
                  disabled={justSavedSection === 'contact'}
                >
                  <span className="relative z-10">
                    {justSavedSection === 'contact' ? "Saved!" : "Save Contact Section"}
                  </span>
                  {justSavedSection !== 'contact' && (
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
} 