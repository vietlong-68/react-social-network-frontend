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

    console.log('⚙️ ReactionService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers
    });

    try {


        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 ReactionService - Response Status: ${response.status}`, {
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


export const addHeart = async (postId) => {


    try {
        const response = await apiCall(`/posts/${postId}/hearts`, {
            method: 'POST',
            headers: getAuthHeader(),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const removeHeart = async (postId) => {


    try {
        const response = await apiCall(`/posts/${postId}/hearts`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });


        return { success: true };
    } catch (error) {

        throw error;
    }
};


export const getHearts = async (postId, page = 1, limit = 20) => {


    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        const response = await apiCall(`/posts/${postId}/hearts?${params}`, {
            method: 'GET',
            headers: getAuthHeader(),
        });




        return response;
    } catch (error) {

        throw error;
    }
};
