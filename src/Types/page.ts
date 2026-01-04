// src/types/page.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PageContent {
  slug: string;
  content: {
    seo: Seo;
    hero?: Hero;
    sections: ContentSection[];
  };
  programs: ProgramSummary[];
}

export interface Seo {
  title: string;
  description: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage?: string;
}

export interface ContentSection {
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items?: any[];
  [key: string]: any;
}

export interface Stat {
  label: string;
  value: string;
}

export interface ProgramSummary {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  durationHours?: number;
  maxParticipants?: number;
  categoryName?: string;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorPosition?: string;
  companyLogoUrl?: string;
}

export interface PageData {
  id: number;
  slug: string;
  isPublished: boolean;
  languageCode: string;
  
  // SEO
  seoTitle: string;
  seoDescription?: string;
  
  // Hero
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  heroImage?: string;
  
  // Content
  contentSectionsJson?: string;
  
  // OpenGraph
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  
  // Programs
  programs?: Program[];
}

export interface Program {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  durationHours?: number;
  maxParticipants?: number;
  categoryName?: string;
}
