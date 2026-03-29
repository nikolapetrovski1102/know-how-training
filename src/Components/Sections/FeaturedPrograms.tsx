
import React from 'react';
import { Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

// Note: Program data usually comes from the page data programs array, not directly from the section items.
// We'll accept programs as a prop.

interface ProgramSummary {
    id: number;
    slug: string;
    title: string;
    shortDescription?: string;
    imageUrl?: string;
    durationHours?: number;
    maxParticipants?: number;
    categoryName?: string;
}

interface FeaturedProgramsProps {
    title?: string;
    subtitle?: string;
    programs?: ProgramSummary[];
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
}

export const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ title, subtitle, programs, columns = 3, alignment = 'center' }) => {
    if (!programs || programs.length === 0) return null;

    const gridCols = columns === 2 ? 'lg:grid-cols-2' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
    const textAlign = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-8">
                {title && (
                    <h2 className={`text-3xl font-light text-slate-900 mb-4 ${textAlign}`}>
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                    </h2>
                )}

                {subtitle && (
                    <p className={`text-slate-600 mb-12 max-w-2xl px-4 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto'} ${textAlign}`} dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}

                <div className={`grid md:grid-cols-2 ${gridCols} gap-8`}>
                    {programs.slice(0, 6).map(program => (
                        <Link
                            key={program.id}
                            to={`/programs/${program.slug}`}
                            className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {program.imageUrl && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={program.imageUrl.startsWith('/') ? `${API_BASE}${program.imageUrl}` : program.imageUrl}
                                        alt={program.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                </div>
                            )}

                            <div className="p-6">
                                {program.categoryName && (
                                    <span className="text-xs text-red-600 font-medium uppercase tracking-wider">
                                        {program.categoryName}
                                    </span>
                                )}

                                {program.durationHours && (
                                    <span className="text-xs text-slate-500 ml-3">
                                        {program.durationHours}h
                                    </span>
                                )}

                                <h3 className="text-xl font-medium text-slate-900 mt-2 mb-3">
                                    {program.title}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    {program.shortDescription}
                                </p>

                                <span className="text-red-600 text-sm font-medium group-hover:underline">
                                    Learn More →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
