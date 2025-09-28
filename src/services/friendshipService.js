import { API_BASE_URL } from './apiConfig';


const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);


        const responseText = await response.text();

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


export const sendFriendRequest = async (receiverId) => {
    try {


        const response = await apiCall('/friendships', {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiverId })
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const getFriendshipStatus = async (userId) => {
    try {


        const response = await apiCall(`/friendships/status?userId=${userId}`, {
            headers: getAuthHeader()
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const acceptFriendRequest = async (friendshipId) => {
    try {


        const response = await apiCall(`/friendships/${friendshipId}/accept`, {
            method: 'PATCH',
            headers: getAuthHeader()
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const declineFriendRequest = async (friendshipId) => {
    try {


        const response = await apiCall(`/friendships/${friendshipId}/decline`, {
            method: 'PATCH',
            headers: getAuthHeader()
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const cancelFriendRequest = async (friendshipId) => {
    try {


        const response = await apiCall(`/friendships/${friendshipId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const removeFriend = async (friendshipId) => {
    try {


        const response = await apiCall(`/friendships/${friendshipId}/remove`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const getFriendsList = async (page = 1, limit = 10) => {
    try {


        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        const response = await apiCall(`/friendships?${params}`, {
            method: 'GET',
            headers: getAuthHeader()
        });


        return response.data || response;
    } catch (error) {

        throw error;
    }
};


export const getFriendRequests = async (page = 1, size = 20) => {
    try {


        const response = await apiCall(`/friendships/received?page=${page}&limit=${size}`, {
            headers: getAuthHeader()
        });






        if (response.data && response.data.content) {
            const mappedRequests = response.data.content.map(friendship => ({
                ...friendship.sender,
                friendshipId: friendship.id,
                status: friendship.status,
                createdAt: friendship.createdAt
            }));



            return {
                ...response.data,
                content: mappedRequests
            };
        }

        return response.data;
    } catch (error) {

        throw error;
    }
};
