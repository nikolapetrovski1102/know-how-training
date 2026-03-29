import React from 'react';
import { VideoEmbed } from '../UI/VideoEmbed';

interface VideoItem {
    title: string;
    description: string;
    url: string;
    thumbnail?: string;
    Title?: string;
    Description?: string;
    Url?: string;
    Thumbnail?: string;
}

interface VideosProps {
    title?: string;
    subtitle?: string;
    items?: VideoItem[];
    columns?: number;
    alignment?: 'left' | 'center' | 'right';
}

export const Videos: React.FC<VideosProps> = ({ title, subtitle, items, columns = 3, alignment = 'left' }) => {
    if (!items || items.length === 0) return null;

    const gridCols = columns === 2 ? 'lg:grid-cols-2' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
    const textAlign = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';
    const flexAlign = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start';

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <h2 className={`text-3xl md:text-4xl font-light text-slate-900 mb-3 md:mb-4 ${textAlign}`} dangerouslySetInnerHTML={{ __html: title }} />
                )}
                {subtitle && (
                    <p className={`text-slate-600 mb-8 md:mb-12 max-w-2xl px-4 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto'} ${textAlign}`} dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
                <div className={`grid sm:grid-cols-2 ${gridCols} gap-6 md:gap-8`}>
                    {items.map((video, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-slate-900">
                                <VideoEmbed url={video.url || video.Url || ''} />
                            </div>
                            <div className={`p-4 md:p-6 ${textAlign}`}>
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: video.title || video.Title || '' }} />
                                <p className="text-sm md:text-base text-slate-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: video.description || video.Description || '' }} />
                                {(video.url || video.Url) && (
                                    <a href={video.url || video.Url} target="_blank" rel="noopener noreferrer" className={`text-red-600 hover:text-red-700 font-medium text-sm md:text-base inline-flex items-center gap-1 ${flexAlign}`}>
                                        Watch on YouTube →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
