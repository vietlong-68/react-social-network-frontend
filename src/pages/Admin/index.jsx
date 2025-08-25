import React from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    LockOutlined,
    FileTextOutlined,
    CalendarOutlined,
    HeartOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { useAdminStatistics } from '../../hooks/useAdminStatistics';

const { Title, Text } = Typography;

const AdminDashboard = () => {
    const { overview, loading, error, refreshStatistics } = useAdminStatistics();

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                action={
                    <button onClick={refreshStatistics}>
                        Thử lại
                    </button>
                }
            />
        );
    }

    const userStats = overview?.userStatistics;
    const postStats = overview?.postStatistics;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    Tổng quan hệ thống
                </Title>
                <Text type="secondary">
                    Cập nhật lần cuối: {overview?.generatedAt}
                </Text>
            </div>


            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng người dùng"
                            value={userStats?.totalUsers || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Người dùng hoạt động"
                            value={userStats?.activeUsers || 0}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Người dùng bị khóa"
                            value={userStats?.blockedUsers || 0}
                            prefix={<LockOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng bài viết"
                            value={postStats?.totalPosts || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>


            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Thống kê người dùng" style={{ height: '300px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Người dùng mới hôm nay"
                                    value={userStats?.newUsersToday || 0}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Người dùng mới tuần này"
                                    value={userStats?.newUsersThisWeek || 0}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Người dùng nam"
                                    value={userStats?.maleUsers || 0}
                                    prefix={<UserOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Người dùng nữ"
                                    value={userStats?.femaleUsers || 0}
                                    prefix={<UserOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Thống kê bài viết" style={{ height: '300px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Bài viết hôm nay"
                                    value={postStats?.postsToday || 0}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Bài viết tuần này"
                                    value={postStats?.postsThisWeek || 0}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Lượt thích trung bình"
                                    value={postStats?.averageLikesPerPost || 0}
                                    precision={1}
                                    prefix={<HeartOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Bình luận trung bình"
                                    value={postStats?.averageCommentsPerPost || 0}
                                    precision={1}
                                    prefix={<MessageOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
