// Components/Sections/IntroCard.tsx
import React from 'react';

interface IntroCardProps {
    type?: string;
    Type?: string;
    title?: string;
    Title?: string;
    greeting?: string;
    Greeting?: string;
    name?: string;
    Name?: string;
    description?: string;
    Description?: string;
    [key: string]: any;
}

export const IntroCard: React.FC<IntroCardProps> = (props) => {
    // Normalize props - handle both lowercase and capitalized fields
    const greeting = props.greeting || props.Greeting || '';
    const description = props.description || props.Description || '';
    const name = props.name || props.Name || '';
    const title = props.title || props.Title || '';

    return (
        <div className="absolute bottom-8 right-8 lg:right-16 z-20 max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-100 animate-fade-in-up animation-delay-600">
                {/* Greeting */}
                {greeting && (
                    <h3
                        className="text-2xl md:text-3xl font-light text-slate-900 mb-4"
                        dangerouslySetInnerHTML={{ __html: greeting }}
                    />
                )}

                {/* Name */}
                {name && (
                    <p
                        className="text-lg font-semibold text-slate-900 mb-2"
                        dangerouslySetInnerHTML={{ __html: name }}
                    />
                )}

                {/* Title/Role */}
                {title && (
                    <p
                        className="text-sm text-slate-600 mb-4 italic"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}

                {/* Description */}
                {description && (
                    <p
                        className="text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}

                {/* Decorative element */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-600 rounded-full opacity-20 blur-xl"></div>
            </div>
        </div>
    );
};
