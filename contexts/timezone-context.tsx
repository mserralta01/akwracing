'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { settingsService } from '@/lib/services/settings-service';

type TimezoneContextType = {
  timezone: string;
  setTimezone: (timezone: string) => void;
  formatDateTime: (date: Date | string | number | undefined) => {
    formattedDate: string;
    formattedTime: string;
    timezoneAbbr: string;
  };
};

const defaultTimezone = 'America/New_York';

const timezoneAbbreviations: Record<string, string> = {
  'America/New_York': 'ET',
  'America/Los_Angeles': 'PT',
  'America/Denver': 'MT',
  'America/Chicago': 'CT'
};

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState(defaultTimezone);

  useEffect(() => {
    // Load timezone from settings
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getGeneralSettings();
        if (settings.timezone) {
          setTimezone(settings.timezone);
        }
      } catch (error) {
        console.error('Error loading timezone settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSetTimezone = async (newTimezone: string) => {
    setTimezone(newTimezone);
    try {
      // Save to settings in Firestore
      await settingsService.updateGeneralSettings({ timezone: newTimezone });
    } catch (error) {
      console.error('Error saving timezone setting:', error);
    }
  };

  const formatDateTime = (date: Date | string | number | undefined) => {
    if (!date) {
      return {
        formattedDate: 'N/A',
        formattedTime: 'N/A',
        timezoneAbbr: timezoneAbbreviations[timezone] || timezone
      };
    }

    try {
      // Use formatInTimeZone directly to handle the timezone conversion and formatting
      return {
        formattedDate: formatInTimeZone(date, timezone, 'MM/dd/yyyy'),
        formattedTime: formatInTimeZone(date, timezone, 'h:mm aa'),
        timezoneAbbr: timezoneAbbreviations[timezone] || timezone
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return {
        formattedDate: 'Invalid Date',
        formattedTime: 'Invalid Time',
        timezoneAbbr: timezoneAbbreviations[timezone] || timezone
      };
    }
  };

  return (
    <TimezoneContext.Provider value={{ 
      timezone, 
      setTimezone: handleSetTimezone,
      formatDateTime 
    }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
} 