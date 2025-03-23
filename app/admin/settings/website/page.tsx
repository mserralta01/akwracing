"use client";

import { useState, useEffect } from 'react';
import { WebsiteContent, settingsService } from '@/lib/services/settings-service';
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import { Textarea } from "@/components/ui/textarea";

export default function WebsiteSettingsPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
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
    if (!content) return;

    try {
      // Only update the specific section
      const sectionToUpdate = { 
        [sectionName]: content[sectionName as keyof WebsiteContent] 
      };
      
      console.log(`Saving ${sectionName} section:`, sectionToUpdate);
      
      await settingsService.updateWebsiteContent(sectionToUpdate);
      
      toast({
        title: "Success",
        description: "Website content updated successfully",
      });
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

  // Handle file upload and set a URL
  const handleImageUpload = (section: keyof WebsiteContent, field: string, file: File | null) => {
    if (!content) return;

    if (file) {
      // In a real app, you would upload the file to a storage service
      // and get a URL back. For now, we'll create a temporary URL.
      const newUrl = URL.createObjectURL(file);
      
      // Update the content state with the new URL
      handleStringChange(section, field, newUrl);
    } else {
      // If no file is selected, clear the image
      handleStringChange(section, field, '');
    }
  };

  const initializeAllContent = async () => {
    try {
      console.log("Initializing all website content with defaults");
      // Get the default content from the service
      const defaultContent = settingsService.getDefaultWebsiteContent();
      // Update the local state
      setContent(defaultContent);
      // Save to the database
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
    return <div className="py-4">Loading website content...</div>;
  }

  // Create local variables with default values to prevent null/undefined errors
  const heroContent = content?.hero || { title: '', description: '', videoUrl: '' };
  const aboutContent = content?.about || { title: '', description: '', features: [], imageUrl: '' };
  const benefitsContent = content?.benefits || { title: '', items: [] };
  const partnersContent = content?.partners || { title: '', description: '', items: [] };
  const facilitiesContent = content?.facilities || { title: '', description: '', items: [] };
  const teamContent = content?.team || { title: '', description: '' };
  const contactContent = content?.contact || { title: '', description: '', address: '', phone: '', email: '' };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Content</h1>
        <Button 
          variant="outline" 
          onClick={initializeAllContent}
          className="bg-amber-100 hover:bg-amber-200 border-amber-300"
        >
          Reset All Content To Defaults
        </Button>
      </div>
      <p className="text-muted-foreground">Manage your website's static content</p>

      <Tabs 
        defaultValue="hero" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Update the main hero section of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input 
                  id="hero-title" 
                  value={heroContent.title} 
                  onChange={(e) => handleStringChange('hero', 'title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <RichTextEditor 
                  content={heroContent.description} 
                  onChange={(value) => handleStringChange('hero', 'description', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-video">Video URL</Label>
                <Input 
                  id="hero-video" 
                  value={heroContent.videoUrl} 
                  onChange={(e) => handleStringChange('hero', 'videoUrl', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the full URL to your background video (MP4 format recommended)
                </p>
              </div>
              
              <Button onClick={() => handleSave('hero')}>Save Hero Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Update the about section of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Title</Label>
                <Input 
                  id="about-title" 
                  value={aboutContent.title} 
                  onChange={(e) => handleStringChange('about', 'title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-description">Description</Label>
                <RichTextEditor 
                  content={aboutContent.description} 
                  onChange={(value) => handleStringChange('about', 'description', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Key Features</Label>
                {aboutContent.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
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
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('about', 'features', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    const newFeatures = [...aboutContent.features, "New feature"];
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        features: newFeatures
                      }
                    });
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-image">Image</Label>
                <ImageUpload
                  value={aboutContent.imageUrl}
                  onChange={(file) => handleImageUpload('about', 'imageUrl', file)}
                />
              </div>
              
              <Button onClick={() => handleSave('about')}>Save About Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Section */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Section</CardTitle>
              <CardDescription>
                Update the benefits section of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="benefits-title">Title</Label>
                <Input 
                  id="benefits-title" 
                  value={benefitsContent.title} 
                  onChange={(e) => handleStringChange('benefits', 'title', e.target.value)}
                />
              </div>
              
              <div className="flex justify-between items-center mt-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  Benefits section uses default title: "Why Karting for Your Child?"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-amber-100 hover:bg-amber-200 border-amber-300"
                  onClick={async () => {
                    try {
                      // Create a benefits object with all 9 benefits from the website
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
                      
                      // Update the local state for benefits
                      setContent({
                        ...content,
                        benefits: websiteBenefits
                      });
                      
                      // Save to the database
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
                  Reset Benefits Section
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Benefit Items</Label>
                {benefitsContent.items.map((item, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Benefit #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('benefits', 'items', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          value={item.title} 
                          onChange={(e) => handleArrayItemChange('benefits', 'items', index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <RichTextEditor 
                          content={item.description} 
                          onChange={(value) => handleArrayItemChange('benefits', 'items', index, 'description', value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon Name</Label>
                        <Input 
                          value={item.iconName} 
                          onChange={(e) => handleArrayItemChange('benefits', 'items', index, 'iconName', e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Use Lucide icon names (e.g., Trophy, Settings, User)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => addArrayItem('benefits', 'items', {
                    title: "New Benefit",
                    description: "Describe this benefit",
                    iconName: "Star"
                  })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Benefit
                </Button>

                <Button
                  variant="outline"
                  className="mt-4 w-full bg-blue-100 hover:bg-blue-200 border-blue-300"
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

                    // Create a new content object with the website benefits
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
                
                <div className="mt-6">
                  <Button 
                    onClick={() => handleSave('benefits')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Benefits Section
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Section */}
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
              
              <Button onClick={() => handleSave('partners')}>Save Partners Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Section */}
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
              
              <Button onClick={() => handleSave('facilities')}>Save Facilities Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Section */}
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
              
              <Button onClick={() => handleSave('team')}>Save Team Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>
                Update the contact section of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">Title</Label>
                <Input 
                  id="contact-title" 
                  value={contactContent.title} 
                  onChange={(e) => handleStringChange('contact', 'title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-description">Description</Label>
                <RichTextEditor 
                  content={contactContent.description} 
                  onChange={(value) => handleStringChange('contact', 'description', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea 
                  id="contact-address" 
                  value={contactContent.address} 
                  onChange={(e) => handleStringChange('contact', 'address', e.target.value)}
                  rows={2}
                />
                <p className="text-sm text-muted-foreground">
                  Use line breaks for multi-line addresses
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input 
                  id="contact-phone" 
                  value={contactContent.phone} 
                  onChange={(e) => handleStringChange('contact', 'phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input 
                  id="contact-email" 
                  value={contactContent.email} 
                  onChange={(e) => handleStringChange('contact', 'email', e.target.value)}
                />
              </div>
              
              <Button onClick={() => handleSave('contact')}>Save Contact Section</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 