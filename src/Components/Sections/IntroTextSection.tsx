import React from 'react';
import type { IntroTextSectionData } from '../../Types/ContentSectionTypes';

interface IntroTextSectionProps {
    data: IntroTextSectionData;
}

export const IntroTextSectionComponent: React.FC<IntroTextSectionProps> = ({ data }) => {
    const { headline, body, alignment = 'center' } = data;

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-8">
                <div className={`max-w-4xl ${alignment === 'center' ? 'mx-auto' : ''} ${alignmentClasses[alignment]}`}>
                    <h2
                        className="text-4xl md:text-5xl font-light text-slate-900 mb-6 leading-tight"
                        dangerouslySetInnerHTML={{ __html: headline }}
                    />

                    <div
                        className="text-lg text-slate-700 leading-relaxed prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                </div>
            </div>
        </section>
    );
};
