
import React from 'react';

interface FaqItem {
    question: string;
    answer: string;
    Question?: string;
    Answer?: string;
}

interface FaqProps {
    title?: string;
    subtitle?: string;
    items?: FaqItem[];
}

export const Faq: React.FC<FaqProps> = ({ title, subtitle, items }) => {
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
                <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
                    {items.map((item, idx) => (
                        <details key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden group">
                            <summary className="px-4 md:px-6 py-3 md:py-4 cursor-pointer hover:bg-slate-50 font-medium text-slate-900 flex items-center justify-between text-sm md:text-base">
                                <span className="flex-1 pr-4" dangerouslySetInnerHTML={{ __html: item.question || item.Question || '' }} />
                                <span className="text-red-600 text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                            </summary>
                            <div className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-600 border-t border-slate-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer || item.Answer || '' }} />
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
