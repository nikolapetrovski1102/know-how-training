import React from 'react';
import type { ContentSection } from '../Types/ContentSectionTypes';
import { HeroSectionComponent } from './sections/HeroSection';
import { IntroTextSectionComponent } from './sections/IntroTextSection';
import { FeatureGridSectionComponent } from './sections/FeatureGridSection';
import { TrainingCategorySectionComponent } from './sections/TrainingCategorySection';
import { TestimonialSectionComponent } from './sections/TestimonialSection';
import { CallToActionSectionComponent } from './sections/CallToActionSection';

interface ContentSectionRendererProps {
    sections: ContentSection[];
}

export const ContentSectionRenderer: React.FC<ContentSectionRendererProps> = ({ sections }) => {
    // Sort sections by order and filter inactive ones
    const activeSections = sections
        .filter(section => section.isActive)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {activeSections.map((section) => {
                switch (section.type) {
                    case 'hero':
                        return <HeroSectionComponent key={section.key} data={section.data} />;

                    case 'intro-text':
                        return <IntroTextSectionComponent key={section.key} data={section.data} />;

                    case 'feature-grid':
                        return <FeatureGridSectionComponent key={section.key} data={section.data} />;

                    case 'training-category':
                        return <TrainingCategorySectionComponent key={section.key} data={section.data} />;

                    case 'testimonial':
                        return <TestimonialSectionComponent key={section.key} data={section.data} />;

                    case 'call-to-action':
                        return <CallToActionSectionComponent key={section.key} data={section.data} />;

                    default:
                        console.warn(`Unknown section type: ${(section as any).type}`);
                        return null;
                }
            })}
        </>
    );
};
