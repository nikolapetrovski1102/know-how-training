
import React from 'react';

interface ResourceItem {
    title: string;
    description: string;
    fileUrl: string;
    fileType?: string;
    Title?: string;
    Description?: string;
    FileUrl?: string;
    FileType?: string;
}

interface ResourcesProps {
    title?: string;
    subtitle?: string;
    items?: ResourceItem[];
}

export const Resources: React.FC<ResourcesProps> = ({ title, subtitle, items }) => {
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {items.map((resource, idx) => (
                        <a
                            key={idx}
                            href={resource.fileUrl || resource.FileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-600 hover:shadow-md transition-all"
                        >
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm">
                                {(resource.fileType || resource.FileType || 'PDF').substring(0, 3)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 mb-1 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: resource.title || resource.Title || '' }} />
                                <p className="text-xs md:text-sm text-slate-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: resource.description || resource.Description || '' }} />
                            </div>
                            <svg className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
