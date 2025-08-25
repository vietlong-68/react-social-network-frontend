import { API_BASE_URL } from './apiConfig';


const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;


    const authHeaders = getAuthHeader();


    const config = {
        headers: {
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    };

    console.log('⚙️ HashtagService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers
    });

    try {


        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 HashtagService - Response Status: ${response.status}`, {
            url,
            statusText: response.statusText,
            responseText: responseText.substring(0, 200) + '...'
        });

        let data;
        if (responseText && responseText.trim()) {
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Response không phải JSON hợp lệ');
            }
        } else {
            data = { success: false, message: 'Response rỗng' };
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }


        return data;
    } catch (error) {

        throw error;
    }
};


export const getTopHashtags = async () => {


    try {
        const response = await apiCall('/posts/hashtags/top', {
            method: 'GET',
        });




        return response.data || response;
    } catch (error) {

        throw error;
    }
};
