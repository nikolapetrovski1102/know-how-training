/**
 * ContentSection Type Definitions
 * 
 * Defines the structure for all content sections used in the KnowHow Training Provider platform.
 * Each section type has strict typing to ensure admin-friendly editing and frontend rendering.
 */

// ============================================================================
// Base Types
// ============================================================================

export type SectionType =
    | 'hero'
    | 'intro-text'
    | 'feature-grid'
    | 'training-category'
    | 'testimonial'
    | 'call-to-action';

export type BackgroundType = 'color' | 'image' | 'gradient';

export interface BackgroundConfig {
    type: BackgroundType;
    imageUrl?: string;
    color?: string;
    gradientFrom?: string;
    gradientTo?: string;
    overlayColor?: string;
    overlayOpacity?: number; // 0-1
}

export interface CallToAction {
    label: string;
    href: string;
}

// ============================================================================
// Section Data Interfaces
// ============================================================================

export interface HeroSectionData {
    title: string;
    subtitle: string;
    background: BackgroundConfig;
    primaryCta?: CallToAction;
    secondaryCta?: CallToAction;
}

export interface IntroTextSectionData {
    headline: string;
    body: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface Feature {
    icon: string; // Icon name or emoji
    title: string;
    description: string;
}

export interface FeatureGridSectionData {
    title: string;
    subtitle?: string;
    features: Feature[];
    columns?: 2 | 3 | 4;
}

export interface TrainingCategory {
    name: string;
    slug: string;
    description: string;
    href: string;
    imageUrl?: string;
}

export interface TrainingCategorySectionData {
    title: string;
    subtitle?: string;
    categories: TrainingCategory[];
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatarUrl?: string;
}

export interface TestimonialSectionData {
    title: string;
    subtitle?: string;
    items: Testimonial[];
}

export interface CallToActionSectionData {
    title: string;
    subtitle?: string;
    ctaLabel: string;
    ctaHref: string;
    background?: BackgroundConfig;
}

// ============================================================================
// Section Types (Union)
// ============================================================================

export interface ContentSectionBase {
    key: string;
    type: SectionType;
    order: number;
    isActive: boolean;
}

export interface HeroSection extends ContentSectionBase {
    type: 'hero';
    data: HeroSectionData;
}

export interface IntroTextSection extends ContentSectionBase {
    type: 'intro-text';
    data: IntroTextSectionData;
}

export interface FeatureGridSection extends ContentSectionBase {
    type: 'feature-grid';
    data: FeatureGridSectionData;
}

export interface TrainingCategorySection extends ContentSectionBase {
    type: 'training-category';
    data: TrainingCategorySectionData;
}

export interface TestimonialSection extends ContentSectionBase {
    type: 'testimonial';
    data: TestimonialSectionData;
}

export interface CallToActionSection extends ContentSectionBase {
    type: 'call-to-action';
    data: CallToActionSectionData;
}

// Union type for all sections
export type ContentSection =
    | HeroSection
    | IntroTextSection
    | FeatureGridSection
    | TrainingCategorySection
    | TestimonialSection
    | CallToActionSection;

// ============================================================================
// Helper Types
// ============================================================================

export interface ContentSectionsResponse {
    sections: ContentSection[];
}
