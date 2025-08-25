import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
    getAllUsers,
    getAdminUserById,
    createUser,
    updateUser,
    deleteUser,
    getBlockedUsers
} from '../services/adminService';

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchBlockedUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const blockedData = await getBlockedUsers();
            setBlockedUsers(blockedData);
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải danh sách người dùng bị khóa');
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchUserById = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getAdminUserById(userId);
            return userData;
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải thông tin người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const addUser = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const newUser = await createUser(userData);
            setUsers(prev => [newUser, ...prev]);
            message.success('Tạo người dùng thành công');
            return newUser;
        } catch (err) {

            setError(err.message);
            message.error('Không thể tạo người dùng mới');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const updateUserById = useCallback(async (userId, userData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await updateUser(userId, userData);
            setUsers(prev => prev.map(user =>
                user.id === userId ? updatedUser : user
            ));
            message.success('Cập nhật người dùng thành công');
            return updatedUser;
        } catch (err) {

            setError(err.message);
            message.error('Không thể cập nhật người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const removeUser = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            await deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
            message.success('Xóa người dùng thành công');
        } catch (err) {

            setError(err.message);
            message.error('Không thể xóa người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const refreshUsers = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);


    const refreshBlockedUsers = useCallback(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);


    const refreshAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);


            const [usersData, blockedData] = await Promise.all([
                getAllUsers(),
                getBlockedUsers()
            ]);

            setUsers(usersData);
            setBlockedUsers(blockedData);

            console.log('All users refreshed:', {
                users: usersData.length,
                blockedUsers: blockedData.length
            });
        } catch (err) {

            setError(err.message);
            message.error('Không thể làm mới danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError(null);


                const [usersData, blockedData] = await Promise.all([
                    getAllUsers(),
                    getBlockedUsers()
                ]);

                setUsers(usersData);
                setBlockedUsers(blockedData);

                console.log('Initial data loaded:', {
                    users: usersData.length,
                    blockedUsers: blockedData.length
                });
            } catch (err) {

                setError(err.message);
                message.error('Không thể tải dữ liệu người dùng');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    return {
        users,
        blockedUsers,
        loading,
        error,
        fetchUsers,
        fetchBlockedUsers,
        fetchUserById,
        addUser,
        updateUserById,
        removeUser,
        refreshUsers,
        refreshBlockedUsers,
        refreshAllUsers,
    };
};
