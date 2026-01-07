import React from 'react';
import { Link } from 'react-router-dom';
import type { HeroSectionData } from '../../Types/ContentSectionTypes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface HeroSectionProps {
    data: HeroSectionData;
}

export const HeroSectionComponent: React.FC<HeroSectionProps> = ({ data }) => {
    const { title, subtitle, background, primaryCta, secondaryCta } = data;

    // Build background style
    const backgroundStyle: React.CSSProperties = {};

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

    const overlayOpacity = background.overlayOpacity ?? 0.4;
    const overlayColor = background.overlayColor ?? '#000000';

    return (
        <section
            className="relative min-h-screen flex items-center overflow-hidden"
            style={backgroundStyle}
        >
            {/* Overlay for text readability */}
            {background.type === 'image' && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundColor: overlayColor,
                        opacity: overlayOpacity
                    }}
                />
            )}

            {/* Animated Background Circles */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-slate-400 rounded-full opacity-20 blur-3xl animate-float" />
            <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-300 rounded-full opacity-30 blur-3xl animate-float-reverse" />
            <div className="absolute top-40 right-32 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-2xl animate-pulse-slow" />

            <div className="container mx-auto px-8 py-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Red accent line */}
                    <div className="w-16 h-1 bg-red-600 mb-6 mx-auto animate-fade-in" />

                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-fade-in-up animation-delay-200"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <p
                        className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400"
                        dangerouslySetInnerHTML={{ __html: subtitle }}
                    />

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
                        {primaryCta && (
                            <Link
                                to={primaryCta.href}
                                className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base tracking-wide hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <span dangerouslySetInnerHTML={{ __html: primaryCta.label }} />
                            </Link>
                        )}

                        {secondaryCta && (
                            <Link
                                to={secondaryCta.href}
                                className="inline-block bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-lg font-semibold text-base tracking-wide hover:bg-white/20 transition-all"
                            >
                                <span dangerouslySetInnerHTML={{ __html: secondaryCta.label }} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
