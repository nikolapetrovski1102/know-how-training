
import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface CollaboratorItem {
    image: string;
    name?: string;
    width?: string;
    Image?: string;
    Name?: string;
    Width?: string;
}

interface CollaboratorsProps {
    title?: string;
    items?: CollaboratorItem[];
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
    styleId?: number;
}

export const Collaborators: React.FC<CollaboratorsProps> = ({
    title,
    items,
    columns = 5,
    alignment = 'center',
    styleId = 0
}) => {
    if (!items || items.length === 0) return null;

    const textAlign = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';
    const shouldScroll = items.length > 5;

    const getStyleClasses = (id: number) => {
        switch (id) {
            case 1: // Minimalist
                return {
                    section: "py-12 md:py-16 bg-white",
                    item: "px-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500",
                    image: "object-contain"
                };
            case 2: // Bordered
                return {
                    section: "py-12 md:py-16 bg-slate-50",
                    item: "p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all",
                    image: "object-contain"
                };
            case 3: // Dark / High Impact
                return {
                    section: "py-12 md:py-16 bg-slate-900",
                    item: "px-8 invert brightness-0 hover:brightness-100 transition-all",
                    image: "object-contain"
                };
            default: // Modern Standard
                return {
                    section: "py-12 md:py-16 bg-white",
                    item: "px-6 hover:scale-110 transition-transform duration-300",
                    image: "object-contain"
                };
        }
    };

    const classes = getStyleClasses(styleId);

    // Duplicate items for seamless scroll if needed
    const displayItems = shouldScroll ? [...items, ...items] : items;

    // Helper to get grid classes for columns 1-6
    const getGridCols = (cols: number) => {
        switch (cols) {
            case 1: return 'lg:grid-cols-1';
            case 2: return 'lg:grid-cols-2';
            case 3: return 'lg:grid-cols-3';
            case 4: return 'lg:grid-cols-4';
            case 6: return 'lg:grid-cols-6';
            default: return 'lg:grid-cols-5';
        }
    };

    return (
        <section className={classes.section}>
            <div className="container mx-auto px-4 md:px-8 overflow-hidden">
                {title && (
                    <div className={`${textAlign} mb-12`}>
                        <h2
                            className={`text-2xl md:text-3xl font-light tracking-tight ${styleId === 3 ? 'text-white' : 'text-slate-900'}`}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    </div>
                )}

                {shouldScroll ? (
                    <div className="relative flex overflow-hidden">
                        <div className="animate-scroll flex items-center">
                            {displayItems.map((item, idx) => {
                                const customWidth = item.width || item.Width;
                                return (
                                    <div key={idx} className={classes.item}>
                                        <img
                                            src={(item.image || item.Image)?.startsWith('/') ? `${API_BASE}${item.image || item.Image}` : (item.image || item.Image)}
                                            alt={item.name || item.Name || 'Collaborator'}
                                            className={classes.image}
                                            style={customWidth ? { width: customWidth, maxWidth: 'none' } : {}}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {/* Gradient Fades */}
                        <div className={`absolute inset-y-0 left-0 w-20 pointer-events-none z-10 bg-gradient-to-r ${styleId === 3 ? 'from-slate-900' : (styleId === 2 ? 'from-slate-50' : 'from-white')} to-transparent`} />
                        <div className={`absolute inset-y-0 right-0 w-20 pointer-events-none z-10 bg-gradient-to-l ${styleId === 3 ? 'from-slate-900' : (styleId === 2 ? 'from-slate-50' : 'from-white')} to-transparent`} />
                    </div>
                ) : (
                    <div className={`grid grid-cols-2 ${getGridCols(columns)} gap-8 items-center ${alignment === 'center' ? 'justify-items-center' : alignment === 'right' ? 'justify-items-end' : 'justify-items-start'}`}>
                        {items.map((item, idx) => {
                            const customWidth = item.width || item.Width;
                            return (
                                <div key={idx} className={classes.item}>
                                    <img
                                        src={(item.image || item.Image)?.startsWith('/') ? `${API_BASE}${item.image || item.Image}` : (item.image || item.Image)}
                                        alt={item.name || item.Name || 'Collaborator'}
                                        className={classes.image}
                                        style={customWidth ? { width: customWidth, maxWidth: 'none' } : {}}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
