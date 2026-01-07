import React from 'react';
import { Link } from 'react-router-dom';
import type { CallToActionSectionData } from '../../Types/ContentSectionTypes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface CallToActionSectionProps {
    data: CallToActionSectionData;
}

export const CallToActionSectionComponent: React.FC<CallToActionSectionProps> = ({ data }) => {
    const { title, subtitle, ctaLabel, ctaHref, background } = data;

    // Build background style
    const backgroundStyle: React.CSSProperties = {};
    let hasBackground = false;

    if (background) {
        hasBackground = true;
        if (background.type === 'image' && background.imageUrl) {
            const imageUrl = background.imageUrl.startsWith('/')
                ? `${API_BASE}${background.imageUrl}`
                : background.imageUrl;
            backgroundStyle.backgroundImage = `url('${imageUrl}')`;
            backgroundStyle.backgroundSize = 'cover';
            backgroundStyle.backgroundPosition = 'center';
        } else if (background.type === 'gradient' && background.gradientFrom && background.gradientTo) {
            backgroundStyle.backgroundImage = `linear-gradient(135deg, ${background.gradientFrom}, ${background.gradientTo})`;
        } else if (background.type === 'color' && background.color) {
            backgroundStyle.backgroundColor = background.color;
        }
    }

    const overlayOpacity = background?.overlayOpacity ?? 0.3;
    const overlayColor = background?.overlayColor ?? '#000000';

    return (
        <section
            className={`relative py-24 ${hasBackground ? '' : 'bg-slate-900'}`}
            style={backgroundStyle}
        >
            {/* Overlay */}
            {hasBackground && background?.type === 'image' && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundColor: overlayColor,
                        opacity: overlayOpacity
                    }}
                />
            )}

            <div className="container mx-auto px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    {subtitle && (
                        <p
                            className="text-lg text-white/90 mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: subtitle }}
                        />
                    )}

                    <Link
                        to={ctaHref}
                        className="inline-block bg-red-600 text-white px-10 py-4 rounded-lg font-semibold text-lg tracking-wide hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        <span dangerouslySetInnerHTML={{ __html: ctaLabel }} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
