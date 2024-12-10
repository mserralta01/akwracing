"use client";

import { useEffect, useState } from 'react';
import { settingsService } from '@/lib/services/settings-service';
import { useTimezone } from '@/contexts/timezone-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function GeneralSettingsPage() {
  const { timezone, setTimezone } = useTimezone();
  const [selectedTimezone, setSelectedTimezone] = useState<string>(timezone);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getGeneralSettings();
        if (settings.timezone) {
          setSelectedTimezone(settings.timezone);
        }
      } catch (error) {
        console.error('Error loading timezone settings:', error);
        toast({
          title: "Error",
          description: "Failed to load timezone settings",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [toast]);

  const handleTimezoneChange = async (newTimezone: string) => {
    try {
      setSelectedTimezone(newTimezone);
      await settingsService.updateGeneralSettings({ timezone: newTimezone });
      setTimezone(newTimezone);
      toast({
        title: "Success",
        description: "Timezone updated successfully",
      });
    } catch (error) {
      console.error('Error updating timezone:', error);
      toast({
        title: "Error",
        description: "Failed to update timezone",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Timezone</h2>
        <Select onValueChange={handleTimezoneChange} value={selectedTimezone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 