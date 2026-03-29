
import React from 'react';

interface StatItem {
    value: string;
    label: string;
    Value?: string;
    Label?: string;
}

interface StatsProps {
    title?: string;
    items?: StatItem[];
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
    styleId?: number;
}

export const Stats: React.FC<StatsProps> = ({ title, items, columns = 4, alignment = 'center', styleId = 0 }) => {
    if (!items || items.length === 0) return null;

    const gridCols = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : columns === 4 ? 'grid-cols-4' : 'grid-cols-4';
    const textAlign = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

    const getStyleClasses = (id: number) => {
        switch (id) {
            case 1: // Minimalist
                return {
                    section: "py-16 md:py-24 bg-white",
                    card: "p-4 md:p-6 transition-all hover:scale-105",
                    value: "mb-2 text-3xl md:text-4xl lg:text-5xl font-light text-slate-900",
                    label: "text-xs md:text-sm uppercase tracking-widest text-red-600 font-medium"
                };
            case 2: // Bordered
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    card: "p-4 md:p-6 bg-white border border-slate-200 hover:border-red-600 transition-all rounded-xl shadow-sm",
                    value: "mb-2 text-3xl md:text-4xl lg:text-5xl font-bold text-red-600",
                    label: "text-xs md:text-sm uppercase tracking-wider text-slate-500"
                };
            case 3: // Bold Accent
                return {
                    section: "py-16 md:py-24 bg-red-600",
                    card: "p-4 md:p-6 bg-red-700/30 backdrop-blur-sm border border-white/10 rounded-2xl transition-all hover:bg-red-700/50",
                    value: "mb-2 text-3xl md:text-4xl lg:text-5xl font-black text-white",
                    label: "text-xs md:text-sm uppercase tracking-widest text-red-100 font-bold"
                };
            default: // Modern Card (Existing)
                return {
                    section: "py-16 md:py-24 bg-slate-50",
                    card: "p-4 md:p-6 bg-white border-t-2 border-red-600 rounded shadow-sm hover:shadow-md transition-shadow",
                    value: "mb-2 text-3xl md:text-4xl lg:text-5xl font-bold text-red-600",
                    label: "text-xs md:text-sm uppercase tracking-wider text-slate-600"
                };
        }
    };

    const classes = getStyleClasses(styleId);

    return (
        <section className={classes.section}>
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <div className={`${textAlign} mb-12 md:mb-16`}>
                        <h2
                            className={`text-3xl md:text-4xl lg:text-5xl font-light tracking-tight ${styleId === 3 ? 'text-white' : 'text-slate-900'}`}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    </div>
                )}
                <div className={`grid grid-cols-2 md:${gridCols} gap-4 md:gap-6 lg:gap-8`}>
                    {items.map((stat, idx) => (
                        <div key={idx} className={`${textAlign} ${classes.card}`}>
                            <div
                                className={classes.value}
                                dangerouslySetInnerHTML={{ __html: stat.value || stat.Value || '' }}
                            />
                            <div
                                className={classes.label}
                                dangerouslySetInnerHTML={{ __html: stat.label || stat.Label || '' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
