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
            'Content-Type': 'application/json',
            ...authHeaders,
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


export const getAllUsers = async () => {
    try {
        const response = await apiCall('/admin/users', {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getAdminUserById = async (userId) => {
    try {
        const response = await apiCall(`/admin/users/${userId}`, {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const createUser = async (userData) => {
    try {


        const response = await apiCall('/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {


        const response = await apiCall(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {


        const response = await apiCall(`/admin/users/${userId}`, {
            method: 'DELETE',
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};

export const blockUser = async (userId, reason) => {
    try {


        const response = await apiCall(`/admin/users/${userId}/block`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};

export const unblockUser = async (userId) => {
    try {


        const response = await apiCall(`/admin/users/${userId}/unblock`, {
            method: 'POST',
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getBlockedUsers = async () => {
    try {
        const response = await apiCall('/admin/users/blocked', {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const updateUserRole = async (userId, roleData) => {
    try {


        const response = await apiCall(`/admin/users/${userId}/roles`, {
            method: 'POST',
            body: JSON.stringify(roleData),
        });


        return response.data;
    } catch (error) {

        throw error;
    }
};


export const getUserStatistics = async () => {
    try {
        const response = await apiCall('/admin/users/statistics/users', {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getPostStatistics = async () => {
    try {
        const response = await apiCall('/admin/users/statistics/posts', {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getAdminOverview = async () => {
    try {
        const response = await apiCall('/admin/users/statistics/overview', {
            method: 'GET',
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};
