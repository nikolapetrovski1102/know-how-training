
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
    alignment?: 'left' | 'center' | 'right';
    styleId?: number;
}

export const Faq: React.FC<FaqProps> = ({ title, subtitle, items, alignment = 'center', styleId = 0 }) => {
    if (!items || items.length === 0) return null;

    const textAlign = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';
    const containerAlign = alignment === 'left' ? '' : alignment === 'right' ? 'ml-auto' : 'mx-auto';

    const getStyleClasses = (id: number) => {
        switch (id) {
            case 1: // Minimalist
                return {
                    section: "py-16 md:py-24 bg-white",
                    item: "py-4 border-b border-slate-100 group",
                    summary: "cursor-pointer list-none font-semibold text-slate-900 flex justify-between items-center hover:text-red-600 transition-colors",
                    icon: "text-red-600 font-light group-open:rotate-45 transition-transform text-2xl",
                    content: "py-4 text-slate-600 leading-relaxed"
                };
            case 2: // Outlined / Modern Red
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    item: "mb-4 bg-white border-2 border-slate-100 rounded-xl overflow-hidden group hover:border-red-600/30 transition-all shadow-sm",
                    summary: "px-6 py-5 cursor-pointer list-none font-bold text-slate-900 flex justify-between items-center bg-white group-open:bg-red-50/50",
                    icon: "w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-open:bg-red-600 group-open:text-white transition-all text-xl",
                    content: "px-6 py-5 text-slate-600 border-t border-red-50"
                };
            case 3: // Bold Red
                return {
                    section: "py-16 md:py-24 bg-slate-900",
                    item: "mb-3 bg-slate-800 rounded-lg overflow-hidden group border border-slate-700 hover:border-red-500 transition-all",
                    summary: "px-6 py-4 cursor-pointer list-none font-medium text-white flex justify-between items-center",
                    icon: "text-red-500 group-open:text-white transition-colors text-2xl",
                    content: "px-6 py-4 text-slate-300 bg-slate-800/50 border-t border-slate-700"
                };
            default: // Standard Card (Existing)
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    item: "bg-white rounded-lg border border-slate-200 overflow-hidden group mb-3",
                    summary: "px-4 md:px-6 py-3 md:py-4 cursor-pointer hover:bg-slate-50 font-medium text-slate-900 flex items-center justify-between text-sm md:text-base",
                    icon: "text-red-600 text-xl flex-shrink-0 group-open:rotate-45 transition-transform",
                    content: "px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-600 border-t border-slate-100 leading-relaxed"
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
                    <p className={`${styleId === 3 ? 'text-slate-400' : 'text-slate-600'} mb-8 md:mb-12 max-w-2xl px-4 ${containerAlign} ${textAlign}`} dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
                <div className={`max-w-3xl ${containerAlign}`}>
                    {items.map((item, idx) => (
                        <details key={idx} className={classes.item}>
                            <summary className={classes.summary}>
                                <span className="flex-1 pr-4" dangerouslySetInnerHTML={{ __html: item.question || item.Question || '' }} />
                                <span className={classes.icon}>+</span>
                            </summary>
                            <div className={classes.content} dangerouslySetInnerHTML={{ __html: item.answer || item.Answer || '' }} />
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
