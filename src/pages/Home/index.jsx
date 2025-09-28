import React, { useEffect, useState } from "react";
import { PostCard } from "../../components/common";
import { CreatePostForm } from "./components";
import { EditPostModal } from "../../components/posts";
import { usePosts } from "../../hooks/usePosts";
import { useUser } from "../../contexts/UserContext";
import { Button, Spin, Empty, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const Home = () => {

  const { posts, loading, error, hasMore, fetchPosts, addPost, updatePostById, deletePostById, refreshPosts, loadMorePosts } = usePosts();
  const { currentUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);


  useEffect(() => {
    if (currentUser) {
      fetchPosts(1);
    }
  }, [currentUser, fetchPosts]);

  const handleCreatePost = async (postData) => {
    try {
      await addPost(postData);
      message.success("Đăng bài viết thành công!");

      refreshPosts();
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng bài viết!");

    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePostById(postId);
      message.success("Xóa bài viết thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bài viết!");

    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (postData) => {
    if (!editingPost) return;

    try {
      setEditLoading(true);
      await updatePostById(editingPost.id, postData);
      message.success("Chỉnh sửa bài viết thành công!");
      setEditModalVisible(false);
      setEditingPost(null);
      refreshPosts();
    } catch (error) {
      message.error("Có lỗi xảy ra khi chỉnh sửa bài viết!");

    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingPost(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshPosts();
      message.success("Làm mới thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi làm mới!");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMorePosts();
    }
  };


  if (loading && posts.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }


  if (error && posts.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        gap: '16px'
      }}>
        <div style={{ color: '#ff4d4f', fontSize: '16px' }}>
          Có lỗi xảy ra: {error}
        </div>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "80%", width: "100%", margin: "0 auto" }}>

      <CreatePostForm
        onSubmit={handleCreatePost}
        onSuccess={refreshPosts}
      />


      <div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Làm mới
          </Button>
        </div>


        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onRefresh={refreshPosts}
              />
            ))}


            {hasMore && (
              <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <Button
                  onClick={handleLoadMore}
                  loading={loading}
                  size="large"
                >
                  {loading ? 'Đang tải...' : 'Tải thêm bài viết'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty
            description="Chưa có bài viết nào"
            style={{ margin: '40px 0' }}
          />
        )}
      </div>


      <EditPostModal
        visible={editModalVisible}
        post={editingPost}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
    </div>
  );
};

export default Home;
