
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
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
    styleId?: number;
}

export const Coaches: React.FC<CoachesProps> = ({ title, subtitle, items, columns = 3, alignment = 'left', styleId = 0 }) => {
    if (!items || items.length === 0) return null;

    const gridCols = columns === 2 ? 'lg:grid-cols-2' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
    const textAlign = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';

    const getStyleClasses = (id: number) => {
        switch (id) {
            case 1: // Minimalist / Rounded Image
                return {
                    section: "py-16 md:py-24 bg-white",
                    card: "group",
                    imageContainer: "aspect-square rounded-full overflow-hidden mb-6 mx-auto w-48 h-48 border-4 border-slate-50 group-hover:border-red-600 transition-all duration-500",
                    body: "text-center",
                    name: "text-xl font-bold text-slate-900 mb-1",
                    titleText: "text-red-600 font-medium text-sm mb-2",
                    bio: "text-sm text-slate-500 line-clamp-2"
                };
            case 2: // Elevated / Card Red Border
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    card: "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100",
                    imageContainer: "h-64 overflow-hidden relative",
                    body: "p-6",
                    name: "text-xl font-bold text-slate-900 mb-1",
                    titleText: "inline-block px-3 py-1 bg-red-600 text-white rounded-full text-[10px] uppercase font-bold mb-3",
                    bio: "text-slate-600 text-sm line-clamp-3"
                };
            case 3: // Bold Dark
                return {
                    section: "py-16 md:py-24 bg-slate-900",
                    card: "bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-red-500 transition-all",
                    imageContainer: "h-56 filter grayscale group-hover:grayscale-0 transition-all duration-500",
                    body: "p-6",
                    name: "text-xl font-bold text-white mb-1",
                    titleText: "text-red-500 font-bold text-sm mb-3",
                    bio: "text-slate-400 text-sm line-clamp-3"
                };
            default: // Standard (Existing)
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    card: "bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                    imageContainer: "h-48 md:h-64 overflow-hidden bg-slate-100",
                    body: "p-4 md:p-6",
                    name: "text-lg md:text-xl font-semibold text-slate-900 mb-1",
                    titleText: "text-red-600 font-medium text-sm mb-3",
                    bio: "text-sm md:text-base text-slate-600 mb-3 line-clamp-3"
                };
        }
    };

    const classes = getStyleClasses(styleId);

    return (
        <section className={classes.section}>
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <h2 className={`text-3xl md:text-4xl font-light mb-3 md:mb-4 ${textAlign} ${styleId === 3 ? 'text-white' : 'text-slate-900'}`} dangerouslySetInnerHTML={{ __html: title }} />
                )}
                {subtitle && (
                    <p className={`${styleId === 3 ? 'text-slate-400' : 'text-slate-600'} mb-8 md:mb-12 max-w-2xl px-4 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto'} ${textAlign}`} dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
                <div className={`grid sm:grid-cols-2 ${gridCols} gap-6 md:gap-8`}>
                    {items.map((coach, idx) => (
                        <div key={idx} className={classes.card}>
                            {(coach.image || coach.Image) && (
                                <div className={classes.imageContainer}>
                                    <img
                                        src={(coach.image || coach.Image)?.startsWith('/') ? `${API_BASE}${coach.image || coach.Image}` : (coach.image || coach.Image)}
                                        alt={coach.name || coach.Name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className={`${classes.body} ${styleId === 0 ? textAlign : ''}`}>
                                <h3 className={classes.name} dangerouslySetInnerHTML={{ __html: coach.name || coach.Name || '' }} />
                                <p className={classes.titleText} dangerouslySetInnerHTML={{ __html: coach.title || coach.Title || '' }} />
                                <p className={classes.bio} dangerouslySetInnerHTML={{ __html: coach.bio || coach.Bio || '' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
