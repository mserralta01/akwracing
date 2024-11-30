export type SocialMedia = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export type Language = string;

export type ExperienceEntry = {
  description: string;
  icon: RacingIcon;
  year: string;
}

export type AchievementEntry = {
  description: string;
  icon: RacingIcon;
  year: string;
}

export type RacingIcon = 
  | 'Trophy'      // For championships
  | 'Flag'        // For race wins
  | 'Medal'       // For podium finishes
  | 'Star'        // For special achievements
  | 'Crown'       // For championship titles
  | 'Certificate' // For certifications
  | 'Timer'       // For lap records
  | 'Car'         // For car-specific achievements
  | 'Tools'       // For technical expertise
  | 'Users'       // For team achievements
  | 'Target'      // For goals achieved
  | 'Chart'       // For performance milestones
  | 'Award';      // For special recognition

export type Instructor = {
  id: string;
  name: string;
  role: string;
  experiences: ExperienceEntry[];
  achievements: AchievementEntry[];
  languages: string[];
  featured: boolean;
  socialMedia: SocialMedia;
  imageUrl: string;
  phone?: string;
  email?: string;
}

export type InstructorFormData = Omit<Instructor, 'id' | 'createdAt' | 'updatedAt'>; 