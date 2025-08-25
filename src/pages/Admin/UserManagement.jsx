import React, { useState } from 'react';
import {
    Card,
    Button,
    Space,
    Modal,
    message,
    Typography,
    Row,
    Col,
    Tabs
} from 'antd';
import {
    PlusOutlined,
    TeamOutlined,
    LockOutlined
} from '@ant-design/icons';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useAdminActions } from '../../hooks/useAdminActions';
import { UserTable, UserForm, BlockUserModal, RoleUpdateModal } from '../../components/admin';

const { Title } = Typography;
const { TabPane } = Tabs;

const UserManagement = () => {
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [blockModalVisible, setBlockModalVisible] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    const {
        users,
        blockedUsers,
        loading,
        addUser,
        updateUserById,
        removeUser,
        refreshUsers,
        refreshBlockedUsers,
        refreshAllUsers
    } = useAdminUsers();

    const {
        blockUserById,
        unblockUserById,
        changeUserRole
    } = useAdminActions();

    const handleCreateUser = async (userData) => {
        try {
            await addUser(userData);
            setCreateModalVisible(false);
        } catch (error) {

        }
    };

    const handleEditUser = async (userData) => {
        try {
            await updateUserById(selectedUser.id, userData);
            setEditModalVisible(false);
            setSelectedUser(null);
        } catch (error) {

        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await removeUser(userId);
        } catch (error) {

        }
    };

    const handleBlockUser = async (userId, reason) => {
        try {
            await blockUserById(userId, reason);
            setBlockModalVisible(false);
            setSelectedUser(null);
            refreshAllUsers();
        } catch (error) {

        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await unblockUserById(userId);
            refreshAllUsers();
        } catch (error) {

        }
    };

    const handleChangeRole = async (userId, roleData) => {
        try {
            await changeUserRole(userId, roleData);
            setRoleModalVisible(false);
            setSelectedUser(null);
            refreshAllUsers();
        } catch (error) {

        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    const openBlockModal = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        setBlockModalVisible(true);
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setRoleModalVisible(true);
    };

    const handleRefresh = () => {
        refreshAllUsers();
    };


    const activeUsers = users.filter(user => !user.isBlocked);






    const tabItems = [
        {
            key: 'active',
            label: (
                <span>
                    <TeamOutlined />
                    Người dùng đang hoạt động ({activeUsers.length})
                </span>
            ),
            children: (
                <UserTable
                    users={activeUsers}
                    loading={loading}
                    onEdit={openEditModal}
                    onDelete={handleDeleteUser}
                    onBlock={openBlockModal}
                    onUnblock={handleUnblockUser}
                    onChangeRole={openRoleModal}
                    onRefresh={handleRefresh}
                    showBlockButton={true}
                />
            )
        },
        {
            key: 'blocked',
            label: (
                <span>
                    <LockOutlined />
                    Người dùng bị khóa ({blockedUsers.length})
                </span>
            ),
            children: (
                <UserTable
                    users={blockedUsers}
                    loading={loading}
                    onEdit={openEditModal}
                    onDelete={handleDeleteUser}
                    onBlock={openBlockModal}
                    onUnblock={handleUnblockUser}
                    onChangeRole={openRoleModal}
                    onRefresh={handleRefresh}
                    showBlockButton={false}
                />
            )
        }
    ];

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Quản lý người dùng
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateModalVisible(true)}
                    >
                        Tạo người dùng mới
                    </Button>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Card>


            <Modal
                title="Tạo người dùng mới"
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <UserForm
                    visible={createModalVisible}
                    onCancel={() => setCreateModalVisible(false)}
                    onSubmit={handleCreateUser}
                    loading={loading}
                />
            </Modal>


            <Modal
                title="Chỉnh sửa người dùng"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedUser(null);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <UserForm
                    visible={editModalVisible}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setSelectedUser(null);
                    }}
                    onSubmit={handleEditUser}
                    initialValues={selectedUser}
                    loading={loading}
                    title="Chỉnh sửa người dùng"
                />
            </Modal>


            <BlockUserModal
                visible={blockModalVisible}
                onCancel={() => {
                    setBlockModalVisible(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleBlockUser}
                userInfo={selectedUser}
                loading={loading}
            />


            <RoleUpdateModal
                visible={roleModalVisible}
                onCancel={() => {
                    setRoleModalVisible(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleChangeRole}
                userInfo={selectedUser}
                loading={loading}
            />
        </div>
    );
};

export default UserManagement;
