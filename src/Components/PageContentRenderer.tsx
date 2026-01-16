
import type { ContentSection, ProgramSummary } from '../Types/page';
import { IntroCard } from './Sections/IntroCard';
import { Stats } from './Sections/Stats';
import { Videos } from './Sections/Videos';
import { Coaches } from './Sections/Coaches';
import { Resources } from './Sections/Resources';
import { Faq } from './Sections/Faq';
import { Testimonials } from './Sections/Testimonials';
import { FeaturedPrograms } from './Sections/FeaturedPrograms';
import { FeatureGridSectionComponent } from './Sections/FeatureGridSection';
import { IntroTextSectionComponent } from './Sections/IntroTextSection';

interface PageContentRendererProps {
    sections: ContentSection[];
    programs?: ProgramSummary[];
}

export const PageContentRenderer: React.FC<PageContentRendererProps> = ({ sections, programs }) => {
    if (!sections || !Array.isArray(sections)) return null;

    // Filter valid sections
    const validSections = sections.filter(s => s.type && s.type.trim() !== '');

    return (
        <>
            {validSections.map((section, idx) => {
                const type = section.type.toLowerCase();

                switch (type) {
                    case 'intro-card':
                        // IntroCard needs to be positioned absolutely relative to Hero.
                        // But here we are rendering it in the flow.
                        // In Home.tsx, it's inside the Hero section.
                        // DynamicPage structure might differ.
                        // For generic pages, we probably want it as a standard section OR we handle Hero + IntroCard separately.
                        // Let's assume for now it renders as a block if not in Hero.
                        // Or we can just render it. 
                        return <IntroCard key={idx} {...section} />;
                    case 'stats':
                        return <Stats key={idx} {...section} />;
                    case 'videos':
                        return <Videos key={idx} {...section} />;
                    case 'coaches':
                    case 'instructors':
                    case 'trainers':
                        return <Coaches key={idx} {...section} />;
                    case 'resources':
                    case 'pdfs':
                    case 'downloads':
                        return <Resources key={idx} {...section} />;
                    case 'faq':
                        return <Faq key={idx} {...section} />;
                    case 'testimonials':
                        return <Testimonials key={idx} {...section} />;
                    case 'featured-programs':
                        return <FeaturedPrograms key={idx} {...section} programs={programs} />;

                    case 'feature-grid':
                        return <FeatureGridSectionComponent key={idx} data={{
                            title: section.title || '',
                            subtitle: section.subtitle,
                            // Map generic items to features if extracted from generic list
                            features: (section.items || []).map((item: any) => ({
                                icon: item.icon || item.Icon || '⭐',
                                title: item.title || item.Title || '',
                                description: item.description || item.Description || ''
                            })),
                            columns: section.columns || 3
                        }} />;

                    case 'intro-text':
                        return <IntroTextSectionComponent key={idx} data={{
                            headline: section.title || '',
                            body: section.description || '',
                            alignment: (section.alignment as any) || 'center'
                        }} />;

                    default:
                        return null;
                }
            })}
        </>
    );
};
