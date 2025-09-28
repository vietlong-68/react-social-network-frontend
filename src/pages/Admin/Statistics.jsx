import React from 'react';
import { Card, Typography, Button, Space, Row, Col, Spin, Alert } from 'antd';
import { ReloadOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAdminStatistics } from '../../hooks/useAdminStatistics';
import { StatisticsCards } from '../../components/admin';

const { Title } = Typography;

const Statistics = () => {
    const { userStats, postStats, loading, error, refreshStatistics } = useAdminStatistics();

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
                    <Button onClick={refreshStatistics}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <BarChartOutlined style={{ marginRight: '8px' }} />
                        Thống kê chi tiết
                    </Title>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={refreshStatistics}
                        loading={loading}
                    >
                        Làm mới dữ liệu
                    </Button>
                </div>

                <StatisticsCards
                    userStats={userStats}
                    postStats={postStats}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default Statistics;
