import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Avatar, Button, Space, Typography, Spin, Empty, message, Input } from "antd";
import {
    LikeOutlined,
    DislikeOutlined,
    MessageOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useUser } from "../../contexts/UserContext";
import { useComments } from "../../hooks/useComments";
import { createReply, getReplies, updateReply, deleteReply } from "../../services/replyService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getMediaUrl } from "../../utils/mediaUtils";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const CommentList = ({
    postId,
    comments = [],
    loading = false,
    error = null,
    hasMore = false,
    fetchComments,
    addComment,
    updateCommentById,
    deleteCommentById,
    loadMoreComments,
    onRefresh
}) => {
    const { currentUser } = useUser();
    const navigate = useNavigate();















    const handleNameClick = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);


    const [replies, setReplies] = useState({});
    const [repliesLoading, setRepliesLoading] = useState({});


    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyText, setEditReplyText] = useState("");
    const [replyEditLoading, setReplyEditLoading] = useState(false);
    const [replyDeleteLoading, setReplyDeleteLoading] = useState({});


    useEffect(() => {
        if (postId) {




            if (fetchComments) {
                fetchComments(0);
            }
        }
    }, [postId, fetchComments]);


    useEffect(() => {


    }, [comments]);


    const fetchReplies = async (commentId) => {
        if (replies[commentId]) return;

        try {
            setRepliesLoading(prev => ({ ...prev, [commentId]: true }));


            const response = await getReplies(commentId);


            setReplies(prev => ({
                ...prev,
                [commentId]: response.content || []
            }));
        } catch (error) {

        } finally {
            setRepliesLoading(prev => ({ ...prev, [commentId]: false }));
        }
    };


    const toggleReplies = (commentId) => {
        if (replies[commentId]) {

            setReplies(prev => {
                const newReplies = { ...prev };
                delete newReplies[commentId];
                return newReplies;
            });
        } else {

            fetchReplies(commentId);
        }
    };

    const handleAddComment = async (content) => {
        try {
            await addComment(content);
            message.success("Bình luận thành công!");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi bình luận!");
        }
    };

    const handleEditComment = async (commentId, content) => {
        try {
            await updateCommentById(commentId, content);
            message.success("Chỉnh sửa bình luận thành công!");
            setEditingCommentId(null);
            setEditText("");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi chỉnh sửa bình luận!");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentById(commentId);
            message.success("Xóa bình luận thành công!");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa bình luận!");
        }
    };

    const startEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditText("");
    };

    const startReply = (commentId) => {
        setReplyingToId(commentId);
        setReplyText("");
    };

    const cancelReply = () => {
        setReplyingToId(null);
        setReplyText("");
    };

    const submitReply = async (commentId, content) => {
        if (!content || !content.trim()) {
            message.warning("Vui lòng nhập nội dung trả lời!");
            return;
        }

        try {
            setReplyLoading(true);



            const newReply = await createReply(commentId, content);


            message.success("Trả lời bình luận thành công!");
            setReplyingToId(null);
            setReplyText("");


            const replyData = newReply.data || newReply;
            const completeReply = {
                id: replyData.id || `temp-${Date.now()}`,
                content: content,
                user: {
                    id: replyData.user?.id || replyData.userId || currentUser?.id,
                    firstName: replyData.user?.firstName || replyData.userFirstName || currentUser?.firstName,
                    lastName: replyData.user?.lastName || replyData.userLastName || currentUser?.lastName,
                    profilePictureUrl: replyData.user?.profilePictureUrl || replyData.userProfilePicture || currentUser?.profilePictureUrl
                },
                commentId: commentId,
                createdAt: replyData.createdAt || new Date().toISOString(),
                updatedAt: replyData.updatedAt || new Date().toISOString()
            };

            setReplies(prev => ({
                ...prev,
                [commentId]: [completeReply, ...(prev[commentId] || [])]
            }));


            if (onRefresh) onRefresh();
        } catch (error) {

            message.error(`Có lỗi xảy ra khi trả lời bình luận: ${error.message}`);
        } finally {
            setReplyLoading(false);
        }
    };


    const startEditReply = (reply) => {
        setEditingReplyId(reply.id);
        setEditReplyText(reply.content);
    };

    const cancelEditReply = () => {
        setEditingReplyId(null);
        setEditReplyText("");
    };

    const handleEditReply = async (replyId, content) => {
        if (!content || !content.trim()) {
            message.warning("Vui lòng nhập nội dung trả lời!");
            return;
        }

        try {
            setReplyEditLoading(true);



            const updatedReply = await updateReply(replyId, content);


            message.success("Chỉnh sửa trả lời thành công!");
            setEditingReplyId(null);
            setEditReplyText("");


            setReplies(prev => {
                const newReplies = { ...prev };
                Object.keys(newReplies).forEach(commentId => {
                    newReplies[commentId] = newReplies[commentId].map(reply =>
                        reply.id === replyId
                            ? { ...reply, content: content, updatedAt: new Date().toISOString() }
                            : reply
                    );
                });
                return newReplies;
            });

            if (onRefresh) onRefresh();
        } catch (error) {

            message.error(`Có lỗi xảy ra khi chỉnh sửa trả lời: ${error.message}`);
        } finally {
            setReplyEditLoading(false);
        }
    };

    const handleDeleteReply = async (replyId, commentId) => {
        try {
            setReplyDeleteLoading(prev => ({ ...prev, [replyId]: true }));



            await deleteReply(replyId);


            message.success("Xóa trả lời thành công!");


            setReplies(prev => {
                const newReplies = { ...prev };
                if (newReplies[commentId]) {
                    newReplies[commentId] = newReplies[commentId].filter(reply => reply.id !== replyId);
                }
                return newReplies;
            });

            if (onRefresh) onRefresh();
        } catch (error) {

            message.error(`Có lỗi xảy ra khi xóa trả lời: ${error.message}`);
        } finally {
            setReplyDeleteLoading(prev => ({ ...prev, [replyId]: false }));
        }
    };

    const formatTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi
            });
        } catch (error) {
            return 'Vừa xong';
        }
    };

    const renderComment = (comment) => {
        const isOwnComment = currentUser?.id === comment.user?.id;
        const isEditing = editingCommentId === comment.id;
        const isReplying = replyingToId === comment.id;

        return (
            <List.Item key={comment.id}>
                <List.Item.Meta
                    avatar={
                        <Avatar size={32} src={comment.user?.profilePictureUrl ? getMediaUrl(comment.user.profilePictureUrl) : null}>
                            {comment.user?.firstName?.[0] || "U"}
                        </Avatar>
                    }
                    title={
                        <Space>
                            <Text
                                strong
                                style={{
                                    cursor: 'pointer',
                                    color: '#1890ff',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                                onClick={() => handleNameClick(comment.user?.id)}
                            >
                                {comment.user?.firstName} {comment.user?.lastName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {formatTime(comment.createdAt)}
                            </Text>
                        </Space>
                    }
                    description={
                        <div>
                            {isEditing ? (
                                <div style={{ marginTop: 8 }}>
                                    <TextArea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        style={{ marginBottom: 8 }}
                                    />
                                    <Space>
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => handleEditComment(comment.id, editText)}
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={cancelEdit}
                                        >
                                            Hủy
                                        </Button>
                                    </Space>
                                </div>
                            ) : (
                                <Paragraph style={{ margin: 0 }}>
                                    {comment.content}
                                </Paragraph>
                            )}


                            {!isEditing && (
                                <div style={{ marginTop: 8 }}>
                                    <Space size="small">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<LikeOutlined />}
                                        >
                                            0
                                        </Button>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<MessageOutlined />}
                                            onClick={() => startReply(comment.id)}
                                        >
                                            Trả lời
                                        </Button>
                                        {isOwnComment && (
                                            <>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => startEdit(comment)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </>
                                        )}
                                    </Space>


                                    <div style={{ marginTop: 8 }}>
                                        <Button
                                            type="text"
                                            size="small"
                                            onClick={() => toggleReplies(comment.id)}
                                            loading={repliesLoading[comment.id]}
                                        >
                                            {replies[comment.id] ? 'Ẩn trả lời' : 'Xem trả lời'}
                                            {replies[comment.id] && replies[comment.id].length > 0 && (
                                                <span style={{ marginLeft: 4, color: '#1890ff' }}>
                                                    ({replies[comment.id].length})
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}


                            {isReplying && (
                                <div style={{ marginTop: 12, marginLeft: 20 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <Avatar size={24} src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : null}>
                                            {currentUser?.firstName?.[0] || "U"}
                                        </Avatar>
                                        <div style={{ flex: 1 }}>
                                            <TextArea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Viết trả lời..."
                                                autoSize={{ minRows: 1, maxRows: 3 }}
                                                style={{ marginBottom: 8 }}
                                            />
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => submitReply(comment.id, replyText)}
                                                    disabled={!replyText.trim() || replyLoading}
                                                    loading={replyLoading}
                                                >
                                                    Trả lời
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={cancelReply}
                                                >
                                                    Hủy
                                                </Button>
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {replies[comment.id] && replies[comment.id].length > 0 && (
                                <div style={{ marginTop: 12, marginLeft: 20 }}>
                                    <div style={{
                                        borderLeft: '2px solid #f0f0f0',
                                        paddingLeft: 16,
                                        background: '#fafafa',
                                        borderRadius: '0 8px 8px 0',
                                        padding: '12px 16px'
                                    }}>
                                        <div style={{ marginBottom: 8, color: '#666', fontSize: '12px' }}>
                                            Trả lời ({replies[comment.id].length})
                                        </div>
                                        {replies[comment.id].map((reply) => (
                                            <div key={reply.id} style={{
                                                marginBottom: 12,
                                                padding: '8px 12px',
                                                background: 'white',
                                                borderRadius: 8,
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                    <Avatar size={20} src={reply.user?.profilePictureUrl ? getMediaUrl(reply.user.profilePictureUrl) : null}>
                                                        {reply.user?.firstName?.[0] || "U"}
                                                    </Avatar>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: '13px',
                                                                    cursor: 'pointer',
                                                                    color: '#1890ff',
                                                                    '&:hover': {
                                                                        textDecoration: 'underline'
                                                                    }
                                                                }}
                                                                onClick={() => handleNameClick(reply.user?.id)}
                                                            >
                                                                {reply.user?.firstName} {reply.user?.lastName}
                                                            </Text>
                                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                                {formatTime(reply.createdAt)}
                                                            </Text>
                                                        </div>


                                                        {editingReplyId === reply.id ? (
                                                            <div style={{ marginTop: 8 }}>
                                                                <TextArea
                                                                    value={editReplyText}
                                                                    onChange={(e) => setEditReplyText(e.target.value)}
                                                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                                                    style={{ marginBottom: 8 }}
                                                                />
                                                                <Space size="small">
                                                                    <Button
                                                                        size="small"
                                                                        type="primary"
                                                                        onClick={() => handleEditReply(reply.id, editReplyText)}
                                                                        loading={replyEditLoading}
                                                                    >
                                                                        Lưu
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={cancelEditReply}
                                                                    >
                                                                        Hủy
                                                                    </Button>
                                                                </Space>
                                                            </div>
                                                        ) : (

                                                            <Text style={{ fontSize: '13px' }}>
                                                                {reply.content}
                                                            </Text>
                                                        )}


                                                        {!editingReplyId && currentUser?.id === reply.user?.id && (
                                                            <div style={{ marginTop: 8 }}>
                                                                <Space size="small">
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        icon={<EditOutlined />}
                                                                        onClick={() => startEditReply(reply)}
                                                                    >
                                                                        Sửa
                                                                    </Button>
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        icon={<DeleteOutlined />}
                                                                        danger
                                                                        loading={replyDeleteLoading[reply.id]}
                                                                        onClick={() => handleDeleteReply(reply.id, comment.id)}
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </Space>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />
            </List.Item>
        );
    };

    if (loading && comments.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spin size="large" tip="Đang tải bình luận..." />
            </div>
        );
    }

    if (error && comments.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ color: "#ff4d4f", marginBottom: "16px" }}>
                    Có lỗi xảy ra: {error}
                </div>
                <Button
                    type="primary"
                    onClick={() => fetchComments(0)}
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <Empty
                description="Chưa có bình luận nào"
                style={{ margin: "20px 0" }}
            />
        );
    }

    return (
        <div>
            <List
                dataSource={comments}
                renderItem={renderComment}
                itemLayout="horizontal"
                style={{ marginTop: 16 }}
            />


            {hasMore && (
                <div style={{ textAlign: "center", margin: "16px 0" }}>
                    <Button
                        onClick={loadMoreComments}
                        loading={loading}
                        size="small"
                    >
                        {loading ? "Đang tải..." : "Tải thêm bình luận"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentList;
