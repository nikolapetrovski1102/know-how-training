// src/hooks/usePage.ts
import { useQuery } from '@tanstack/react-query';
import type { 
  PageContent, 
  Hero, 
  ContentSection, 
  ProgramSummary, 
  Stat,
  ApiResponse 
} from '../types/page';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const fetchPage = async (slug: string, lang: string = 'en'): Promise<PageContent> => {
  const url = `${API_BASE_URL}/api/pages/${slug}?lang=${lang}`;
  console.log('Fetching:', url); // Debug log
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const result = await response.json() as ApiResponse<PageContent>;
  if (!result.success || !result.data) {
    throw new Error(result.message || 'No data received');
  }
  
  return result.data;
};

export const usePage = (slug: string = 'home', lang: string = 'en') => {
  return useQuery<PageContent, Error>({
    queryKey: ['page', slug, lang],
    queryFn: () => fetchPage(slug, lang),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
