// src/pages/Home.tsx
import { Helmet } from 'react-helmet-async';
import { usePage } from '../hooks/usePage';
import type { PageContent, Hero, Stat, ProgramSummary } from '../types/page';
import { Hero as HeroComponent } from '../components/sections/Hero';
import { StatsGrid } from '../components/sections/StatsGrid';
import { ProgramsGrid } from '../components/sections/ProgramsGrid';

export const Home: React.FC = () => {
  const { data, isLoading, error } = usePage();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading page</div>;
  }

  const { content, programs } = data;

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
      </Helmet>

      <main>
        {content.hero && (
          <HeroComponent data={content.hero as Hero} />
        )}
        {content.sections.map((section, index) => (
          <section key={index}>
            {section.type === 'stats' && section.items && (
              <StatsGrid 
                stats={section.items as Stat[]} 
                title={section.title} 
              />
            )}
            {section.type === 'programs' && section.items && (
              <ProgramsGrid 
                programs={section.items as ProgramSummary[]} 
                title={section.title}
              />
            )}
          </section>
        ))}
      </main>
    </>
  );
};
