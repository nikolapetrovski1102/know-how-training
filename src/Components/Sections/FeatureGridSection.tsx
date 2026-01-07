import React from 'react';
import type { FeatureGridSectionData } from '../../Types/ContentSectionTypes';

interface FeatureGridSectionProps {
    data: FeatureGridSectionData;
}

export const FeatureGridSectionComponent: React.FC<FeatureGridSectionProps> = ({ data }) => {
    const { title, subtitle, features, columns = 3 } = data;

    const gridClasses = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-2 lg:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <section className="py-24 bg-slate-50">
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

                <div className={`grid grid-cols-1 ${gridClasses[columns]} gap-8`}>
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-2 border-red-600 group hover:-translate-y-1"
                        >
                            {/* Icon */}
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3
                                className="text-xl font-semibold text-slate-900 mb-3"
                                dangerouslySetInnerHTML={{ __html: feature.title }}
                            />

                            {/* Description */}
                            <p
                                className="text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: feature.description }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
