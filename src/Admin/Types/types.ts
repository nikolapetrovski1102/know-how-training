export interface PageSummary {
  id: number;
  slug: string;
  isPublished: boolean;
  sortOrder: string;
}

export interface PageContent {
  seo: { title: string; description: string };
  hero?: { title: string; subtitle?: string; cta?: { label: string; url: string } };
  sections: Array<{
    type: string;
    title?: string;
    items?: any[];
  }>;
}

export interface EditState {
  [key: string]: { original: string; current: string };
}
