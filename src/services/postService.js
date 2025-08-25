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

    console.log('⚙️ PostService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
    });



    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {


        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 PostService - Response Status: ${response.status}`, {
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


export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append('content', postData.content);

    if (postData.privacy) {
        formData.append('privacy', postData.privacy);
    }

    if (postData.hashtags && postData.hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(postData.hashtags));
    }

    if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file, index) => {
            formData.append('files', file);
        });
    }

    const response = await apiCall('/posts', {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
    });

    return response.data;
};


export const getPosts = async (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiCall(`/posts/feed?${params}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};


export const getPostById = async (postId) => {
    const response = await apiCall(`/posts/${postId}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};


export const getUserPosts = async (userId, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiCall(`/posts/users/${userId}/posts?${params}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};


export const updatePost = async (postId, postData) => {
    const formData = new FormData();

    if (postData.content) {
        formData.append('content', postData.content);
    }

    if (postData.privacy) {
        formData.append('privacy', postData.privacy);
    }

    if (postData.hashtags && postData.hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(postData.hashtags));
    }

    if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file, index) => {
            formData.append('files', file);
        });
    }

    const response = await apiCall(`/posts/${postId}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: formData,
    });

    return response.data;
};


export const deletePost = async (postId) => {


    try {
        const response = await apiCall(`/posts/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });


        return { success: true };
    } catch (error) {

        throw error;
    }
};
