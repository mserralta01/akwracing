export type SocialMedia = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
}

export type Language = {
  language: string;
  level: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  experience: string;
  achievements: string[];
  languages: Language[];
  imageUrl: string;
  featured: boolean;
  socialMedia: SocialMedia;
  createdAt: string;
  updatedAt: string;
}

export type InstructorFormData = Omit<Instructor, 'id' | 'createdAt' | 'updatedAt'>; 