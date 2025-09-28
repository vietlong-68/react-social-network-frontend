import { setToken, removeToken } from '../utils/tokenUtils';
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


export const login = async (email, password) => {
    const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });


    if (response.success && response.data && response.data.token) {
        setToken(response.data.token);


        try {
            const userData = await getCurrentUser();
            return { ...response.data, user: userData };
        } catch (error) {


            return response.data;
        }
    }

    throw new Error('Đăng nhập thất bại');
};


export const logout = async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        try {
            await apiCall('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });
        } catch (error) {

        }
    }

    removeToken();
};


export const checkToken = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    try {
        const response = await apiCall('/auth/introspect', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });

        return response.success && response.data && response.data.valid;
    } catch (error) {
        removeToken();
        return false;
    }
};


export const getCurrentUser = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');

    const response = await apiCall('/users/me', {
        method: 'GET',
        headers: getAuthHeader(),
    });


    return response.data;
};
