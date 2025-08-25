import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button, Dropdown, Typography, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    BarChartOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { logout } from '../../services/authService';
import { useUser } from '../../contexts/UserContext';
import { getMediaUrl } from '../../utils/mediaUtils';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, clearCurrentUser } = useUser();
    const [collapsed, setCollapsed] = useState(false);

    const adminMenuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Tổng quan',
        },
        {
            key: '/admin/users',
            icon: <TeamOutlined />,
            label: 'Quản lý người dùng',
        },
        {
            key: '/admin/statistics',
            icon: <BarChartOutlined />,
            label: 'Thống kê',
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    const handleLogout = async () => {
        try {
            await logout();
            clearCurrentUser();
            navigate('/login');
        } catch (error) {


            clearCurrentUser();
            navigate('/login');
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path === '/admin') return ['/admin'];
        if (path.startsWith('/admin/users')) return ['/admin/users'];
        if (path.startsWith('/admin/statistics')) return ['/admin/statistics'];
        return ['/admin'];
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: '#fff',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Text strong style={{ fontSize: collapsed ? '14px' : '18px' }}>
                        {collapsed ? 'AD' : 'ADMIN PANEL'}
                    </Text>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKey()}
                    items={adminMenuItems}
                    onClick={handleMenuClick}
                    style={{ border: 'none' }}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                        <Button
                            type="primary"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            style={{
                                borderRadius: '6px',
                                fontWeight: '500'
                            }}
                        >
                            Quay lại trang chủ
                        </Button>
                    </Space>

                    <Space>
                        <Text type="secondary">
                            Xin chào, {currentUser?.firstName} {currentUser?.lastName}
                        </Text>

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Button type="text" style={{ padding: '4px' }}>
                                <Avatar
                                    src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : null}
                                    icon={<UserOutlined />}
                                    size="small"
                                />
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        borderRadius: '8px',
                        minHeight: 'calc(100vh - 112px)',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
