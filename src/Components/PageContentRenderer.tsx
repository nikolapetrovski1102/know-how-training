
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
import { HeroBanner } from './Sections/HeroBanner';
import { Collaborators } from './Sections/Collaborators';

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
                const type = (section.type || section.Type || '').toLowerCase();

                // Normalize props for grid-based sections
                const columns = Math.max(1, section.columns || section.Columns || 3);
                const alignment = (section.alignment || section.Alignment || 'left') as 'left' | 'center' | 'right';

                const commonProps = {
                    key: idx,
                    ...section,
                    items: section.items || section.Items || [],
                    columns,
                    alignment,
                    styleId: section.styleId || section.StyleId || 0
                };

                const { key: sectionKey, ...restProps } = commonProps;

                switch (type) {
                    case 'intro-card':
                        return <IntroCard key={idx} {...restProps} />;
                    case 'stats':
                        return <Stats key={idx} {...restProps} />;
                    case 'videos':
                        return <Videos key={idx} {...restProps} />;
                    case 'coaches':
                    case 'instructors':
                    case 'trainers':
                        return <Coaches key={idx} {...restProps} />;
                    case 'resources':
                    case 'pdfs':
                    case 'downloads':
                        return <Resources key={idx} {...restProps} />;
                    case 'faq':
                        return <Faq key={idx} {...restProps} />;
                    case 'testimonials':
                        return <Testimonials key={idx} {...restProps} />;
                    case 'featured-programs':
                        return <FeaturedPrograms key={idx} {...restProps} programs={programs} />;
                    case 'feature-grid':
                        return <FeatureGridSectionComponent key={idx} data={{
                            title: section.title || section.Title || '',
                            subtitle: section.subtitle || section.Subtitle,
                            features: (section.items || section.Items || []).map((item: any) => ({
                                icon: item.icon || item.Icon || '⭐',
                                title: item.title || item.Title || '',
                                description: item.description || item.Description || ''
                            })),
                            columns: (columns === 2 || columns === 3 || columns === 4 ? columns : 3) as 2 | 3 | 4
                        }} />;

                    case 'intro-text':
                        return <IntroTextSectionComponent key={idx} data={{
                            headline: section.title || section.Title || '',
                            body: section.description || section.Description || '',
                            alignment: alignment
                        }} />;

                    case 'hero-banner':
                        return <HeroBanner key={idx}
                            Title={section.title || section.Title || ''}
                            Subtitle={section.subtitle || section.Subtitle}
                            ImageUrl={section.ImageUrl || section.imageUrl || section.heroImage || ''}
                            CtaText={section.ctaText || section.CtaText}
                            CtaUrl={section.ctaUrl || section.CtaUrl}
                            alignment={alignment}
                        />;

                    case 'collaborators':
                    case 'partners':
                    case 'logos':
                        return <Collaborators key={idx} {...restProps} />;

                    default:
                        return null;
                }
            })}
        </>
    );
};
