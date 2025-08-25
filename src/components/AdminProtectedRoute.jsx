import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { useUser } from '../contexts/UserContext';

const AdminProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useUser();
    const location = useLocation();


    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }


    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    const isAdmin = currentUser.roles?.some(role => role.name === 'ADMIN');

    if (!isAdmin) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px'
            }}>
                <Alert
                    message="Không có quyền truy cập"
                    description="Bạn cần quyền quản trị viên để truy cập trang này."
                    type="error"
                    showIcon
                    style={{ maxWidth: '500px' }}
                />
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;
