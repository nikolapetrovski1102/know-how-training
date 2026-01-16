
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
}

export const Stats: React.FC<StatsProps> = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <div className="text-center mb-12 md:mb-16">
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {items.map((stat, idx) => (
                        <div key={idx} className="text-center p-4 md:p-6 bg-white border-t-2 border-red-600 rounded shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="mb-2 text-3xl md:text-4xl lg:text-5xl font-bold text-red-600"
                                dangerouslySetInnerHTML={{ __html: stat.value || stat.Value || '' }}
                            />
                            <div
                                className="text-xs md:text-sm uppercase tracking-wider text-slate-600"
                                dangerouslySetInnerHTML={{ __html: stat.label || stat.Label || '' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
