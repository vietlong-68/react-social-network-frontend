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


export const register = async (userData) => {

    const apiData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
    };


    if (userData.gender) {
        apiData.gender = userData.gender;
    }

    if (userData.dateOfBirth) {
        apiData.dateOfBirth = userData.dateOfBirth.format('YYYY-MM-DD');
    }

    if (userData.phoneNumber) {
        apiData.phone = userData.phoneNumber;
    }

    if (userData.address) {
        apiData.address = userData.address;
    }

    const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(apiData),
    });


    return response.data;
};


export const getCurrentUser = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');

    return await apiCall('/users/me', {
        method: 'GET',
        headers: getAuthHeader(),
    });
};


export const updateProfile = async (profileData) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');







    const requestData = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth ?
            (typeof profileData.dateOfBirth === 'string' ? profileData.dateOfBirth : profileData.dateOfBirth.format('YYYY-MM-DD'))
            : undefined
    };



    try {
        const response = await apiCall('/users/profile', {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
        });




        return response.data;
    } catch (error) {

        throw error;
    }
};


export const changePassword = async (passwordData) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');




    try {
        const response = await apiCall('/users/change-password', {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData),
        });




        return response.data;
    } catch (error) {

        throw error;
    }
};


export const searchUsers = async (searchTerm, page = 0, size = 20) => {
    try {

        if (searchTerm && searchTerm.trim()) {
            const searchParams = new URLSearchParams();
            searchParams.append('searchTerm', searchTerm.trim());
            searchParams.append('page', page);
            searchParams.append('size', size);

            try {

                const searchResponse = await apiCall(`/users/search?${searchParams}`, {
                    headers: getAuthHeader()
                });
                return searchResponse.data;
            } catch (searchError) {

                const fallbackParams = new URLSearchParams();
                fallbackParams.append('page', page);
                fallbackParams.append('size', size);

                const fallbackResponse = await apiCall(`/users?${fallbackParams}`, {
                    headers: getAuthHeader()
                });


                if (fallbackResponse.data && fallbackResponse.data.content) {
                    const filteredUsers = fallbackResponse.data.content.filter(user => {
                        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                        const searchLower = searchTerm.toLowerCase();
                        return fullName.includes(searchLower) ||
                            user.email.toLowerCase().includes(searchLower);
                    });

                    return {
                        ...fallbackResponse.data,
                        content: filteredUsers
                    };
                }

                return fallbackResponse.data;
            }
        }


        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await apiCall(`/users?${params}`);
        return response.data;
    } catch (error) {

        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: size
        };
    }
};


export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiCall('/users/profile-picture', {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
        },
        body: formData,
    });


    return response.data;
};


export const getUserById = async (userId) => {
    try {
        const response = await apiCall(`/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
