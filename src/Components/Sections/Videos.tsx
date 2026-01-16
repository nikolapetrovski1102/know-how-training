
import React from 'react';
import { getImageUrl } from '../../utils/imageHelper';

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
}

export const Videos: React.FC<VideosProps> = ({ title, subtitle, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: title }} />
                )}
                {subtitle && (
                    <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {items.map((video, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            {(video.thumbnail || video.Thumbnail) && (
                                <a
                                    href={video.url || video.Url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative h-40 md:h-48 bg-slate-100 group"
                                >
                                    <img
                                        src={getImageUrl(video.thumbnail || video.Thumbnail)}
                                        alt={video.title || video.Title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                                            <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            )}
                            <div className="p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: video.title || video.Title || '' }} />
                                <p className="text-sm md:text-base text-slate-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: video.description || video.Description || '' }} />
                                {(video.url || video.Url) && (
                                    <a href={video.url || video.Url} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 font-medium text-sm md:text-base inline-flex items-center gap-1">
                                        Watch Video →
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
