import { API_BASE_URL } from './apiConfig';


const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    console.log('🔑 ReplyService - JWT Token check:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;


    const authHeaders = getAuthHeader();


    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    };

    console.log('⚙️ ReplyService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
    });

    try {


        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 ReplyService - Response Status: ${response.status}`, {
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
            console.warn(`⚠️ ReplyService - Empty Response:`, data);
        }

        if (!response.ok) {

            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }


        return data;
    } catch (error) {

        throw error;
    }
};


export const createReply = async (commentId, content) => {


    try {
        const response = await apiCall(`/comments/${commentId}/replies`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const getReplies = async (commentId, page = 0, size = 20) => {


    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await apiCall(`/comments/${commentId}/replies?${params}`, {
            method: 'GET',
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const updateReply = async (replyId, content) => {


    try {
        const response = await apiCall(`/replies/${replyId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const deleteReply = async (replyId) => {


    try {
        await apiCall(`/replies/${replyId}`, {
            method: 'DELETE',
        });


        return { success: true };
    } catch (error) {

        throw error;
    }
};
