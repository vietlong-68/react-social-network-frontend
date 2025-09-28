import React from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    LockOutlined,
    CalendarOutlined,
    ManOutlined,
    WomanOutlined,
    FileTextOutlined,
    HeartOutlined,
    MessageOutlined,
    EyeOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const StatisticsCards = ({ userStats, postStats, loading }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
                Thống kê tổng quan
            </Title>


            <Title level={3} style={{ marginBottom: '16px' }}>
                Thống kê người dùng
            </Title>
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
                            title="Người dùng mới hôm nay"
                            value={userStats?.newUsersToday || 0}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Người dùng nam"
                            value={userStats?.maleUsers || 0}
                            prefix={<ManOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Người dùng nữ"
                            value={userStats?.femaleUsers || 0}
                            prefix={<WomanOutlined />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Có ảnh đại diện"
                            value={userStats?.usersWithProfilePicture || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Có số điện thoại"
                            value={userStats?.usersWithPhone || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>


            <Title level={3} style={{ marginBottom: '16px' }}>
                Thống kê bài viết
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng bài viết"
                            value={postStats?.totalPosts || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết hôm nay"
                            value={postStats?.postsToday || 0}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết công khai"
                            value={postStats?.publicPosts || 0}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết riêng tư"
                            value={postStats?.privatePosts || 0}
                            prefix={<LockOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết có hình ảnh"
                            value={postStats?.postsWithImages || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết có video"
                            value={postStats?.postsWithVideos || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bài viết có hashtag"
                            value={postStats?.postsWithHashtags || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Lượt thích trung bình"
                            value={postStats?.averageLikesPerPost || 0}
                            precision={1}
                            prefix={<HeartOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Bình luận trung bình"
                            value={postStats?.averageCommentsPerPost || 0}
                            precision={1}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsCards;
