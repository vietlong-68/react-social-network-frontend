import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Tag,
    Avatar,
    Popconfirm,
    message,
    Input,
    Select,
    Row,
    Col,
    Typography,
    Tooltip
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    LockOutlined,
    UnlockOutlined,
    CrownOutlined,
    UserOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const UserTable = ({
    users,
    loading,
    onEdit,
    onDelete,
    onBlock,
    onUnblock,
    onChangeRole,
    onRefresh,
    showBlockButton = true
}) => {
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');


    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchText ||
            user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchText.toLowerCase());

        const matchesRole = roleFilter === 'all' ||
            user.roles?.some(role => role.name === roleFilter);


        const matchesStatus = true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.profilePictureUrl}
                        icon={<UserOutlined />}
                        size="large"
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {record.firstName} {record.lastName}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 100,
            render: (gender) => {
                if (!gender) return '-';
                const genderMap = {
                    'MALE': { text: 'Nam', color: 'blue' },
                    'FEMALE': { text: 'Nữ', color: 'pink' },
                    'OTHER': { text: 'Khác', color: 'default' }
                };
                const genderInfo = genderMap[gender] || { text: gender, color: 'default' };
                return <Tag color={genderInfo.color}>{genderInfo.text}</Tag>;
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            width: 120,
            render: (roles) => {
                if (!roles || roles.length === 0) return '-';
                return roles.map(role => (
                    <Tag
                        key={role.id}
                        color={role.name === 'ADMIN' ? 'red' : 'blue'}
                        icon={role.name === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
                    >
                        {role.name === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                    </Tag>
                ));
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isBlocked',
            key: 'status',
            width: 150,
            align: 'center',
            render: (isBlocked, record) => {



                if (isBlocked) {
                    return (
                        <div>
                            <Tag
                                color="red"
                                icon={<LockOutlined />}
                            >
                                Bị khóa
                            </Tag>
                            {record.blockReason && (
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                    Lý do: {record.blockReason}
                                </div>
                            )}
                            {record.blockedAt && (
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {format(new Date(record.blockedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                </div>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <Tag
                            color="green"
                            icon={<UserOutlined />}
                        >
                            Hoạt động
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => (
                <Text type="secondary">
                    {date ? format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }) : '-'}
                </Text>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>

                    {showBlockButton ? (

                        <Tooltip title="Khóa tài khoản">
                            <Button
                                type="default"
                                size="small"
                                icon={<LockOutlined />}
                                onClick={() => onBlock(record.id)}
                            />
                        </Tooltip>
                    ) : (

                        <Tooltip title="Mở khóa">
                            <Button
                                type="default"
                                size="small"
                                icon={<UnlockOutlined />}
                                onClick={() => onUnblock(record.id)}
                            />
                        </Tooltip>
                    )}

                    <Tooltip title="Thay đổi vai trò">
                        <Button
                            type="default"
                            size="small"
                            icon={<CrownOutlined />}
                            onClick={() => onChangeRole(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        description="Hành động này không thể hoàn tác."
                        onConfirm={() => onDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} sm={8} md={6}>
                    <Search
                        placeholder="Tìm kiếm người dùng..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <Select
                        placeholder="Lọc theo vai trò"
                        value={roleFilter}
                        onChange={setRoleFilter}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="all">Tất cả vai trò</Option>
                        <Option value="ADMIN">Quản trị viên</Option>
                        <Option value="USER">Người dùng</Option>
                    </Select>
                </Col>

                <Col xs={24} sm={24} md={6}>
                    <Button
                        type="primary"
                        onClick={onRefresh}
                        style={{ width: '100%' }}
                    >
                        Làm mới
                    </Button>
                </Col>
            </Row>


            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} người dùng`,
                }}
                scroll={{ x: 800 }}
            />
        </div>
    );
};

export default UserTable;
