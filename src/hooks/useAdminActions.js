import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
    blockUser,
    unblockUser,
    updateUserRole
} from '../services/adminService';

export const useAdminActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const blockUserById = useCallback(async (userId, reason) => {
        try {
            setLoading(true);
            setError(null);
            const blockedUser = await blockUser(userId, reason);
            message.success('Khóa người dùng thành công');
            return blockedUser;
        } catch (err) {

            setError(err.message);
            message.error('Không thể khóa người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const unblockUserById = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const unblockedUser = await unblockUser(userId);
            message.success('Mở khóa người dùng thành công');
            return unblockedUser;
        } catch (err) {

            setError(err.message);
            message.error('Không thể mở khóa người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const changeUserRole = useCallback(async (userId, roleData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await updateUserRole(userId, roleData);
            message.success('Cập nhật quyền người dùng thành công');
            return updatedUser;
        } catch (err) {

            setError(err.message);
            message.error('Không thể cập nhật quyền người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const bulkBlockUsers = useCallback(async (userIds, reason) => {
        try {
            setLoading(true);
            setError(null);

            const results = await Promise.allSettled(
                userIds.map(userId => blockUser(userId, reason))
            );

            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;

            if (successful > 0) {
                message.success(`Khóa thành công ${successful} người dùng`);
            }
            if (failed > 0) {
                message.error(`Không thể khóa ${failed} người dùng`);
            }

            return results;
        } catch (err) {

            setError(err.message);
            message.error('Không thể khóa hàng loạt người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkUnblockUsers = useCallback(async (userIds) => {
        try {
            setLoading(true);
            setError(null);

            const results = await Promise.allSettled(
                userIds.map(userId => unblockUser(userId))
            );

            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;

            if (successful > 0) {
                message.success(`Mở khóa thành công ${successful} người dùng`);
            }
            if (failed > 0) {
                message.error(`Không thể mở khóa ${failed} người dùng`);
            }

            return results;
        } catch (err) {

            setError(err.message);
            message.error('Không thể mở khóa hàng loạt người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        blockUserById,
        unblockUserById,
        changeUserRole,
        bulkBlockUsers,
        bulkUnblockUsers,
    };
};
