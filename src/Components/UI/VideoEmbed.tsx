import React from 'react';

interface VideoEmbedProps {
    url: string;
    className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, className = '' }) => {
    const extractVideoId = (url: string): { type: 'youtube' | 'vimeo' | 'direct', id: string } | null => {
        if (!url) return null;

        // YouTube patterns
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) return { type: 'youtube', id: youtubeMatch[1] };

        // Vimeo pattern
        const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[3] };

        // Direct video URL
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return { type: 'direct', id: url };
        }

        return null;
    };

    const videoData = extractVideoId(url);

    if (!videoData) {
        return (
            <div className={`aspect-video bg-slate-100 rounded-lg flex items-center justify-center ${className}`}>
                <p className="text-slate-500 text-sm">Invalid video URL</p>
            </div>
        );
    }

    if (videoData.type === 'youtube') {
        return (
            <iframe
                className={`w-full h-full rounded-lg ${className}`}
                src={`https://www.youtube.com/embed/${videoData.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
            />
        );
    }

    if (videoData.type === 'vimeo') {
        return (
            <iframe
                className={`w-full h-full rounded-lg ${className}`}
                src={`https://player.vimeo.com/video/${videoData.id}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vimeo video player"
            />
        );
    }

    return (
        <video
            className={`w-full h-full rounded-lg ${className}`}
            controls
            src={videoData.id}
        >
            Your browser does not support the video tag.
        </video>
    );
};
