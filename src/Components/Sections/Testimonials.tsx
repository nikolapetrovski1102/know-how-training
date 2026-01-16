
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
}

export const Testimonials: React.FC<TestimonialsProps> = ({ title, items, logos }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-8">
                {title && (
                    <h2 className="text-3xl font-light text-slate-900 text-center mb-12" dangerouslySetInnerHTML={{ __html: title }} />
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {items.map((item, idx) => {
                        const imgSrc = item.image || item.Image;
                        return (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                <div className="flex gap-4 items-start">
                                    {imgSrc && (
                                        <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-slate-100">
                                            <img
                                                src={imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc}
                                                alt={item.author || item.Author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-slate-700 italic mb-3 text-sm" dangerouslySetInnerHTML={{ __html: item.quote || item.Quote || '' }} />
                                        <div className="font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: item.author || item.Author || '' }} />
                                        <div className="text-sm text-slate-500">
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
                    <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                        {logos.map((logo, idx) => (
                            <div key={idx} className="h-12">
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
