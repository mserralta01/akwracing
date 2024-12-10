import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timezone } from "@/types/user";
import { userService } from "@/lib/services/user-service";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone | null>(null);

  useEffect(() => {
    if (user?.settings?.timezone) {
      setSelectedTimezone(user.settings.timezone);
    }
  }, [user]);

  const handleTimezoneChange = async (value: Timezone) => {
    setSelectedTimezone(value);
    if (user) {
      await userService.updateUserSettings(user.uid, { timezone: value });
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Timezone</h2>
        <Select onValueChange={handleTimezoneChange} value={selectedTimezone || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            <SelectItem value="America/Anchorage">Alaska (AKT)</SelectItem>
            <SelectItem value="America/Adak">Hawaii-Aleutian (HST)</SelectItem>
            <SelectItem value="America/Phoenix">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="America/Boise">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Indiana/Indianapolis">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Indiana/Knox">Central Time (CT)</SelectItem>
            <SelectItem value="America/Indiana/Marengo">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Indiana/Petersburg">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Indiana/Tell_City">Central Time (CT)</SelectItem>
            <SelectItem value="America/Indiana/Vevay">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Indiana/Vincennes">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Indiana/Winamac">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Kentucky/Louisville">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Kentucky/Monticello">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Detroit">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Menominee">Central Time (CT)</SelectItem>
            <SelectItem value="America/North_Dakota/Beulah">Central Time (CT)</SelectItem>
            <SelectItem value="America/North_Dakota/Center">Central Time (CT)</SelectItem>
            <SelectItem value="America/North_Dakota/New_Salem">Central Time (CT)</SelectItem>
            <SelectItem value="Pacific/Honolulu">Hawaii-Aleutian (HST)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 