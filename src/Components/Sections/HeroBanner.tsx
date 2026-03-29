import React from 'react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
    Title: string;
    Subtitle?: string;
    ImageUrl?: string;
    CtaText?: string;
    CtaUrl?: string;
    alignment?: 'left' | 'center' | 'right';
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

export const HeroBanner: React.FC<HeroBannerProps> = ({
    Title,
    Subtitle,
    ImageUrl,
    CtaText,
    CtaUrl,
    alignment = 'left'
}) => {
    const fullImageUrl = ImageUrl
        ? (ImageUrl.startsWith('http') ? ImageUrl : `${API_BASE}${ImageUrl}`)
        : '';
    console.log("Image url:" + ImageUrl)

    return (
        <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax-like effect */}
            <div
                className="absolute inset-0 z-0 scale-105"
                style={{
                    backgroundImage: fullImageUrl ? `url(${fullImageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className={`container mx-auto px-8 relative z-10 flex ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-4xl space-y-6 ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>
                    <div className="w-16 h-1 bg-red-600 mb-8 animate-fade-in"></div>

                    <h1
                        className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up"
                        style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                        dangerouslySetInnerHTML={{ __html: Title }}
                    />

                    {Subtitle && (
                        <p
                            className="text-lg md:text-xl text-slate-100/90 leading-relaxed max-w-2xl animate-fade-in-up"
                            style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
                            dangerouslySetInnerHTML={{ __html: Subtitle }}
                        />
                    )}

                    {CtaText && (
                        <div
                            className="pt-4 animate-fade-in-up"
                            style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
                        >
                            <Link
                                to={CtaUrl || '#'}
                                className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base tracking-wide hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                <span dangerouslySetInnerHTML={{ __html: CtaText }} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none"></div>
        </div>
    );
};
