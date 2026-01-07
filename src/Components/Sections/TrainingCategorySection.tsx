import React from 'react';
import { Link } from 'react-router-dom';
import type { TrainingCategorySectionData } from '../../Types/ContentSectionTypes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface TrainingCategorySectionProps {
    data: TrainingCategorySectionData;
}

export const TrainingCategorySectionComponent: React.FC<TrainingCategorySectionProps> = ({ data }) => {
    const { title, subtitle, categories } = data;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-8">
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-light text-slate-900 mb-4"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    {subtitle && (
                        <p
                            className="text-lg text-slate-600 max-w-2xl mx-auto"
                            dangerouslySetInnerHTML={{ __html: subtitle }}
                        />
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, idx) => (
                        <Link
                            key={idx}
                            to={category.href}
                            className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {category.imageUrl && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={category.imageUrl.startsWith('/') ? `${API_BASE}${category.imageUrl}` : category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                            )}

                            <div className="p-6">
                                <h3
                                    className="text-xl font-semibold text-slate-900 mb-3"
                                    dangerouslySetInnerHTML={{ __html: category.name }}
                                />

                                <p
                                    className="text-slate-600 leading-relaxed mb-4"
                                    dangerouslySetInnerHTML={{ __html: category.description }}
                                />

                                <span className="text-red-600 text-sm font-medium group-hover:underline">
                                    Explore trainings →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
