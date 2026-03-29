
import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface TestimonialItem {
    quote: string;
    author: string;
    role: string;
    company?: string;
    image?: string;
    Quote?: string;
    Author?: string;
    Role?: string;
    Company?: string;
    Image?: string;
}

interface TestimonialsProps {
    title?: string;
    items?: TestimonialItem[];
    logos?: Array<{ image: string; name: string }>;
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
    styleId?: number;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ title, items, logos, columns = 2, alignment = 'center', styleId = 0 }) => {
    if (!items || items.length === 0) return null;

    const gridCols = columns === 3 ? 'lg:grid-cols-3' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2';
    const textAlign = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

    const getStyleClasses = (id: number) => {
        switch (id) {
            case 1: // Elegant / Borderless
                return {
                    section: "py-24 bg-white",
                    card: "p-6 transition-all hover:-translate-y-1",
                    quoteText: "text-slate-600 italic mb-6 text-lg font-light leading-relaxed relative",
                    quoteIcon: "absolute -top-4 -left-2 text-6xl text-red-600/10 font-serif pointer-events-none",
                    authorName: "font-semibold text-slate-900 text-base",
                    roleText: "text-sm text-red-600 font-medium"
                };
            case 2: // Modern Red / Left Border
                return {
                    section: "py-24 bg-slate-50",
                    card: "bg-white p-8 rounded-2xl shadow-sm border-l-4 border-red-600 hover:shadow-md transition-all",
                    quoteText: "text-slate-700 mb-6 text-base leading-relaxed",
                    quoteIcon: "",
                    authorName: "font-bold text-slate-900",
                    roleText: "text-sm text-slate-500"
                };
            case 3: // Dark Accent
                return {
                    section: "py-24 bg-slate-900",
                    card: "bg-slate-800/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm hover:border-red-500/50 transition-all",
                    quoteText: "text-slate-200 mb-6 text-base italic",
                    quoteIcon: "",
                    authorName: "font-semibold text-white",
                    roleText: "text-sm text-red-400"
                };
            default: // Standard Card (Existing)
                return {
                    section: "py-24 bg-slate-50",
                    card: "bg-white p-6 rounded-lg shadow-sm border border-slate-100",
                    quoteText: "text-slate-700 italic mb-3 text-sm",
                    quoteIcon: "",
                    authorName: "font-semibold text-slate-900",
                    roleText: "text-sm text-slate-500"
                };
        }
    };

    const classes = getStyleClasses(styleId);

    return (
        <section className={classes.section}>
            <div className="container mx-auto px-8">
                {title && (
                    <h2 className={`text-3xl font-light mb-12 ${textAlign} ${styleId === 3 ? 'text-white' : 'text-slate-900'}`} dangerouslySetInnerHTML={{ __html: title }} />
                )}

                <div className={`grid md:grid-cols-2 ${gridCols} gap-8 mb-12`}>
                    {items.map((item, idx) => {
                        const imgSrc = item.image || item.Image;
                        return (
                            <div key={idx} className={classes.card}>
                                <div className="flex gap-5 items-start">
                                    {imgSrc && (
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                                            <img
                                                src={imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc}
                                                alt={item.author || item.Author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="relative flex-1">
                                        {classes.quoteIcon && <span className={classes.quoteIcon}>“</span>}
                                        <div className={classes.quoteText} dangerouslySetInnerHTML={{ __html: item.quote || item.Quote || '' }} />
                                        <div className={classes.authorName} dangerouslySetInnerHTML={{ __html: item.author || item.Author || '' }} />
                                        <div className={classes.roleText}>
                                            <span dangerouslySetInnerHTML={{ __html: item.role || item.Role || '' }} />
                                            {(item.company || item.Company) && (
                                                <> • <span dangerouslySetInnerHTML={{ __html: item.company || item.Company || '' }} /></>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {logos && logos.length > 0 && (
                    <div className={`flex flex-wrap justify-center items-center gap-8 transition-all ${styleId === 3 ? 'opacity-40 hover:opacity-100 grayscale brightness-200' : 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}>
                        {logos.map((logo, idx) => (
                            <div key={idx} className="h-10 md:h-12">
                                <img
                                    src={logo.image}
                                    alt={logo.name}
                                    className="h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
