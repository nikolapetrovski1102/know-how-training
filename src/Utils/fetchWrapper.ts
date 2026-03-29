
/**
 * Custom fetch wrapper to include ngrok-skip-browser-warning header
 * This helps bypass the ngrok interstitial page in development.
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        'ngrok-skip-browser-warning': 'true',
    };

    return fetch(url, {
        ...options,
        headers,
    });
};
