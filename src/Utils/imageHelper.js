export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (CDN), use as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it starts with /, it's a local upload, prepend API base URL
    if (imagePath.startsWith('/')) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        return `${apiBaseUrl}${imagePath}`;
    }

    // Fallback: return as-is
    return imagePath;
};
