const API_BASE_URL = (() => {
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
        return import.meta.env.VITE_API_BASE_URL_DEV;
    } else {
        return import.meta.env.VITE_API_BASE_URL_PROD;
    }
})();

const MEDIA_BASE_URL = (() => {
    if (import.meta.env.VITE_FILE_UPLOAD_PROVIDER === 'local') {
        return import.meta.env.VITE_MEDIA_BASE_URL_LOCAL;
    } else {
        return '';
    }
})();

export { API_BASE_URL, MEDIA_BASE_URL };