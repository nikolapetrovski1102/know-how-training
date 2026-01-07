import React from 'react';
import type { TestimonialSectionData } from '../../Types/ContentSectionTypes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface TestimonialSectionProps {
    data: TestimonialSectionData;
}

export const TestimonialSectionComponent: React.FC<TestimonialSectionProps> = ({ data }) => {
    const { title, subtitle, items } = data;

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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-600 hover:shadow-md transition-all"
                        >
                            {/* Quote */}
                            <div className="mb-6">
                                <svg
                                    className="w-8 h-8 text-red-600 mb-4 opacity-50"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                </svg>

                                <p
                                    className="text-slate-700 leading-relaxed italic"
                                    dangerouslySetInnerHTML={{ __html: testimonial.quote }}
                                />
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                {testimonial.avatarUrl && (
                                    <img
                                        src={testimonial.avatarUrl.startsWith('/') ? `${API_BASE}${testimonial.avatarUrl}` : testimonial.avatarUrl}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}

                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {testimonial.role} {testimonial.company && `• ${testimonial.company}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
