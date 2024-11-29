import { 
  Trophy,
  Flag,
  Medal,
  Star,
  Crown,
  Scroll,
  Timer,
  Car,
  Wrench,
  Users,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

export const icons = {
  Trophy,
  Flag,
  Medal,
  Star,
  Crown,
  Certificate: Scroll, // Using Scroll as Certificate
  Timer,
  Car,
  Tools: Wrench, // Using Wrench as Tools
  Users,
  Target,
  Chart: TrendingUp, // Using TrendingUp as Chart
  Award
} as const;

export type IconName = keyof typeof icons; 