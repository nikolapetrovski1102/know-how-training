
import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface CoachItem {
    name: string;
    title: string;
    bio: string;
    image?: string;
    expertise?: string;
    Name?: string;
    Title?: string;
    Bio?: string;
    Image?: string;
    Expertise?: string;
}

interface CoachesProps {
    title?: string;
    subtitle?: string;
    items?: CoachItem[];
}

export const Coaches: React.FC<CoachesProps> = ({ title, subtitle, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: title }} />
                )}
                {subtitle && (
                    <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {items.map((coach, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {(coach.image || coach.Image) && (
                                <div className="h-48 md:h-64 overflow-hidden bg-slate-100">
                                    <img
                                        src={(coach.image || coach.Image)?.startsWith('/') ? `${API_BASE}${coach.image || coach.Image}` : (coach.image || coach.Image)}
                                        alt={coach.name || coach.Name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-1" dangerouslySetInnerHTML={{ __html: coach.name || coach.Name || '' }} />
                                <p className="text-red-600 font-medium text-sm mb-3" dangerouslySetInnerHTML={{ __html: coach.title || coach.Title || '' }} />
                                <p className="text-sm md:text-base text-slate-600 mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: coach.bio || coach.Bio || '' }} />
                                {(coach.expertise || coach.Expertise) && (
                                    <p className="text-xs text-slate-500 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: coach.expertise || coach.Expertise || '' }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
