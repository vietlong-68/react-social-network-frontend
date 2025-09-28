import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
    getUserStatistics,
    getPostStatistics,
    getAdminOverview
} from '../services/adminService';

export const useAdminStatistics = () => {
    const [userStats, setUserStats] = useState(null);
    const [postStats, setPostStats] = useState(null);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchUserStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const stats = await getUserStatistics();
            setUserStats(stats);
            return stats;
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải thống kê người dùng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchPostStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const stats = await getPostStatistics();
            setPostStats(stats);
            return stats;
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải thống kê bài viết');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const overviewData = await getAdminOverview();
            setOverview(overviewData);
            return overviewData;
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải thống kê tổng hợp');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchAllStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);


            const [userStatsData, postStatsData, overviewData] = await Promise.all([
                getUserStatistics(),
                getPostStatistics(),
                getAdminOverview()
            ]);

            setUserStats(userStatsData);
            setPostStats(postStatsData);
            setOverview(overviewData);

            return {
                userStats: userStatsData,
                postStats: postStatsData,
                overview: overviewData
            };
        } catch (err) {

            setError(err.message);
            message.error('Không thể tải thống kê');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const refreshStatistics = useCallback(() => {
        fetchAllStatistics();
    }, [fetchAllStatistics]);


    useEffect(() => {
        fetchAllStatistics();
    }, [fetchAllStatistics]);

    return {
        userStats,
        postStats,
        overview,
        loading,
        error,
        fetchUserStatistics,
        fetchPostStatistics,
        fetchOverview,
        fetchAllStatistics,
        refreshStatistics,
    };
};
