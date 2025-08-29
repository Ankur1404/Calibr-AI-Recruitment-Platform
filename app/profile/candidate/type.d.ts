
export interface ProfileData {
  name: string;
  tagline: string;
  summary?: string;
  workDetails: string;
  education: Education[];
  skills: string; 
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLinks;
}


export interface Education {
  year: string;
  degree: string;
  institution: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  link: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
}


export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData | null;
  completionPercentage: number;
}