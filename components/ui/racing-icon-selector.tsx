import { 
  Trophy, Flag, Medal, Star, Crown, 
  Scroll, Timer, Car, Wrench, Users, 
  Target, TrendingUp, Award
} from "lucide-react";
import { RacingIcon } from "@/types/instructor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RacingIconSelectorProps = {
  value: RacingIcon;
  onChange: (value: RacingIcon) => void;
}

const icons = {
  Trophy: Trophy,
  Flag: Flag,
  Medal: Medal,
  Star: Star,
  Crown: Crown,
  Certificate: Scroll,
  Timer: Timer,
  Car: Car,
  Tools: Wrench,
  Users: Users,
  Target: Target,
  Chart: TrendingUp,
  Award: Award,
};

export function RacingIconSelector({ value, onChange }: RacingIconSelectorProps) {
  const IconComponent = icons[value];

  return (
    <Select value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-4 w-4 text-racing-red" />}
            {value}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(icons).map(([key, Icon]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-racing-red" />
              {key}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 