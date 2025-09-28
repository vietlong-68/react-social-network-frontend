import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, message, Tooltip, Dropdown, Modal } from 'antd';
import {
    UserAddOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    TeamOutlined,
    UserDeleteOutlined,
    DownOutlined
} from '@ant-design/icons';
import {
    sendFriendRequest,
    getFriendshipStatus,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend
} from '../../services/friendshipService';

const FriendshipActions = ({
    targetUserId,
    isOwnProfile,
    currentUserId,
    onFriendshipChange
}) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [acceptingRequest, setAcceptingRequest] = useState(false);
    const [decliningRequest, setDecliningRequest] = useState(false);
    const [cancelingRequest, setCancelingRequest] = useState(false);
    const [removingFriend, setRemovingFriend] = useState(false);


    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmFriendshipId, setConfirmFriendshipId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    const normalizeStatus = (status) => {
        if (!status) return null;

        const normalized = status.toString().toLowerCase();

        if (normalized === 'not_friends' || normalized === 'none') {
            return 'NONE';
        }

        if (normalized.includes('pending_sent') || normalized.includes('sent')) {
            return 'PENDING_SENT';
        }

        if (normalized.includes('pending_received') || normalized.includes('received')) {
            return 'PENDING_RECEIVED';
        }

        if (normalized === 'friends' || normalized === 'accepted') {
            return 'FRIENDS';
        }

        return normalized.toUpperCase();
    };


    const showConfirmModal = (action, friendshipId, message) => {
        setConfirmAction(action);
        setConfirmFriendshipId(friendshipId);
        setConfirmMessage(message);
        setConfirmModalVisible(true);

    };


    const handleConfirm = async () => {
        if (!confirmAction || !confirmFriendshipId) return;

        setConfirmLoading(true);


        try {
            switch (confirmAction) {
                case 'decline':
                    await handleDeclineRequest(confirmFriendshipId);
                    break;
                case 'remove':
                    await handleRemoveFriend(confirmFriendshipId);
                    break;
                default:

                    break;
            }
        } catch (error) {

        } finally {
            setConfirmLoading(false);
            setConfirmModalVisible(false);
            setConfirmAction(null);
            setConfirmFriendshipId(null);
            setConfirmMessage('');
        }
    };


    useEffect(() => {
        const checkFriendshipStatus = async () => {
            if (!isOwnProfile && targetUserId && currentUserId) {
                setLoading(true);
                try {
                    const status = await getFriendshipStatus(targetUserId);

                    if (status && status.data) {
                        const apiData = status.data;





                        const mergedStatus = {
                            status: apiData.status,
                            id: apiData.friendshipId,
                            friendshipId: apiData.friendshipId,
                            senderId: currentUserId,
                            receiverId: targetUserId
                        };



                        setFriendshipStatus(mergedStatus);
                    } else {

                        setFriendshipStatus(status);
                    }
                } catch (error) {

                    message.error('Không thể kiểm tra trạng thái kết bạn');
                } finally {
                    setLoading(false);
                }
            }
        };

        checkFriendshipStatus();
    }, [isOwnProfile, targetUserId, currentUserId]);


    const handleSendFriendRequest = async () => {
        if (!targetUserId) return;

        try {
            setSendingRequest(true);
            const response = await sendFriendRequest(targetUserId);
            message.success('Đã gửi lời mời kết bạn!');





            const friendshipId = response?.id;

            if (!friendshipId) {

                message.error('Không thể lấy ID lời mời kết bạn');
                return;
            }



            const pendingStatus = {
                status: 'PENDING_SENT',
                id: friendshipId,
                friendshipId: friendshipId,
                senderId: currentUserId,
                receiverId: targetUserId,
                createdAt: response?.createdAt || new Date().toISOString(),
                originalStatus: response?.status
            };


            setFriendshipStatus(pendingStatus);


            if (onFriendshipChange) {
                onFriendshipChange(pendingStatus);
            }

        } catch (error) {

            message.error(error.message || 'Gửi lời mời kết bạn thất bại!');
        } finally {
            setSendingRequest(false);
        }
    };


    const handleAcceptRequest = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setAcceptingRequest(true);
            await acceptFriendRequest(friendshipId);
            message.success('Đã chấp nhận lời mời kết bạn!');




            const friendsStatus = {
                status: 'FRIENDS',
                id: friendshipId,
                friendshipId: friendshipId,
                senderId: currentUserId,
                receiverId: targetUserId
            };


            setFriendshipStatus(friendsStatus);


            if (onFriendshipChange) {
                onFriendshipChange(friendsStatus);
            }

        } catch (error) {

            message.error(error.message || 'Chấp nhận lời mời thất bại!');
        } finally {
            setAcceptingRequest(false);
        }
    };


    const handleDeclineRequest = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setDecliningRequest(true);
            await declineFriendRequest(friendshipId);
            message.success('Đã từ chối lời mời kết bạn!');




            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };


            setFriendshipStatus(noneStatus);


            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {

            message.error(error.message || 'Từ chối lời mời thất bại!');
        } finally {
            setDecliningRequest(false);
        }
    };


    const handleCancelRequest = async (friendshipId) => {




        const actualFriendshipId = friendshipId || friendshipStatus?.id || friendshipStatus?.friendshipId;

        if (!actualFriendshipId) {


            message.error('Không có ID lời mời để hủy');
            return;
        }

        try {
            setCancelingRequest(true);


            const response = await cancelFriendRequest(actualFriendshipId);


            message.success('Đã hủy lời mời kết bạn!');


            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };


            setFriendshipStatus(noneStatus);


            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {


            message.error(error.message || 'Hủy lời mời thất bại!');
        } finally {
            setCancelingRequest(false);
        }
    };


    const handleRemoveFriend = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setRemovingFriend(true);
            await removeFriend(friendshipId);
            message.success('Đã hủy kết bạn!');




            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };


            setFriendshipStatus(noneStatus);


            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {

            message.error(error.message || 'Hủy kết bạn thất bại!');
        } finally {
            setRemovingFriend(false);
        }
    };


    if (isOwnProfile) {
        return null;
    }


    if (loading) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spin size="small" />
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    Đang kiểm tra...
                </div>
            </div>
        );
    }


    if (friendshipStatus) {
        const rawStatus = friendshipStatus.status;
        const status = normalizeStatus(rawStatus);

        console.log('🔍 Render FriendshipActions:', {
            friendshipStatus,
            rawStatus,
            normalizedStatus: status,
            targetUserId,
            currentUserId
        });






        if (status === 'PENDING_SENT') {




            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;

            return (
                <>
                    <Tooltip title="Hủy lời mời" placement="top">
                        <Button
                            type="default"
                            icon={<ClockCircleOutlined />}
                            style={{ width: '100%' }}
                            size="large"
                            onClick={() => {




                                handleCancelRequest(actualId);
                            }}
                            loading={cancelingRequest}
                        >
                            Đã gửi
                        </Button>
                    </Tooltip>


                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }


        if (status === 'PENDING_RECEIVED') {





            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;


            return (
                <>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            style={{ width: '100%' }}
                            onClick={() => {


                                handleAcceptRequest(actualId);
                            }}
                            loading={acceptingRequest}
                        >
                            Chấp nhận
                        </Button>
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            size="small"
                            style={{ width: '100%' }}
                            onClick={() => {


                                showConfirmModal('decline', actualId, 'Bạn có chắc chắn muốn từ chối lời mời kết bạn này?');
                            }}
                            loading={decliningRequest}
                        >
                            Từ chối
                        </Button>
                    </Space>


                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }


        if (status === 'FRIENDS') {





            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;


            const friendMenuItems = [
                {
                    key: 'remove',
                    label: 'Hủy kết bạn',
                    icon: <UserDeleteOutlined />,
                    danger: true,
                    onClick: () => {


                        showConfirmModal('remove', actualId, 'Bạn có chắc chắn muốn hủy kết bạn với người này?');
                    }
                }
            ];

            return (
                <>
                    <Dropdown
                        menu={{ items: friendMenuItems }}
                        placement="bottomRight"
                        trigger={['hover']}
                    >
                        <Button
                            type="default"
                            icon={<TeamOutlined />}
                            style={{ width: '100%' }}
                            size="large"
                            loading={removingFriend}
                        >
                            Bạn bè <DownOutlined />
                        </Button>
                    </Dropdown>


                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }


        if (status === 'NONE') {

            return (
                <>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        loading={sendingRequest}
                        onClick={handleSendFriendRequest}
                        style={{ width: '100%' }}
                        size="large"
                    >
                        Kết bạn
                    </Button>


                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }


    }



    return (
        <>
            <Button
                type="primary"
                icon={<UserAddOutlined />}
                loading={sendingRequest}
                onClick={handleSendFriendRequest}
                style={{ width: '100%' }}
                size="large"
            >
                Kết bạn
            </Button>


            <ConfirmModal
                visible={confirmModalVisible}
                onOk={handleConfirm}
                onCancel={() => {
                    setConfirmModalVisible(false);
                    setConfirmAction(null);
                    setConfirmFriendshipId(null);
                    setConfirmMessage('');
                }}
                loading={confirmLoading}
                message={confirmMessage}
                action={confirmAction}
            />
        </>
    );
};


const ConfirmModal = ({
    visible,
    onOk,
    onCancel,
    loading,
    message,
    action
}) => (
    <Modal
        title="Xác nhận hành động"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{
            danger: action === 'remove' || action === 'decline'
        }}
    >
        <p>{message}</p>
    </Modal>
);

export default FriendshipActions;
