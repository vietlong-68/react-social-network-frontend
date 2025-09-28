import React, { useState } from "react";
import { Layout, Menu, Input, Avatar, Badge, Button, Dropdown, Spin, Alert } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  TeamOutlined,
  CompassOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  LogoutOutlined,
  ReloadOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { logout } from "../../services/authService";
import { useUser } from "../../contexts/UserContext";
import { getMediaUrl } from "../../utils/mediaUtils";
import SearchDropdown from "../common/SearchDropdown";
import { useHashtags, useFriends } from "../../hooks";
import { SettingsModal } from "../settings";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, clearCurrentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);


  const { hashtags, loading: hashtagsLoading, error: hashtagsError, refreshHashtags } = useHashtags();


  const { friends, loading: friendsLoading, error: friendsError, refreshFriends } = useFriends(10);


  const isAdmin = currentUser?.roles?.some(role => role.name === 'ADMIN');

  const leftMenuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "/friends",
      icon: <TeamOutlined />,
      label: "Bạn bè",
    },

    ...(isAdmin ? [{
      key: "/admin",
      icon: <CrownOutlined />,
      label: "Quản trị",
    }] : []),
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearCurrentUser();
      navigate("/login");
    } catch (error) {

      clearCurrentUser();

      navigate("/login");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Trang cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => setSettingsModalVisible(true),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Header
        style={{
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "#1890ff" }}>SocialApp</h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <Search
            placeholder="Tìm kiếm người dùng..."
            style={{ width: 500 }}
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchVisible(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchTerm.length > 0) setSearchVisible(true);
            }}
            onBlur={() => {

              setTimeout(() => setSearchVisible(false), 200);
            }}
          />
          <SearchDropdown
            visible={searchVisible}
            searchTerm={searchTerm}
            onUserSelect={(user) => {
              setSearchTerm("");
              setSearchVisible(false);
            }}
            onClose={() => setSearchVisible(false)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "48px" }}>
            <Badge count={3}>
              <MessageOutlined
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => navigate("/messages")}
              />
            </Badge>
            <Badge count={5}>
              <BellOutlined
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={handleNotificationClick}
              />
            </Badge>
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <span style={{ fontWeight: "500", color: "#333" }}>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Người dùng"}
              </span>
              <Avatar
                size="large"
                src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : undefined}
                icon={!currentUser?.profilePictureUrl ? <UserOutlined /> : null}
              />

            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>

        <Sider
          width={250}
          style={{
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={leftMenuItems}
            onClick={handleMenuClick}
            style={{ border: "none", paddingTop: "16px" }}
          />
        </Sider>


        <Content
          style={{
            margin: "24px",
            padding: "0 24px",
            minHeight: 280,
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>


        <Sider
          width={300}
          style={{
            background: "#fff",
            borderLeft: "1px solid #f0f0f0",
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "24px" }}>
            <h3>Bạn bè của tôi</h3>
            <div style={{ marginBottom: "24px" }}>
              {friendsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin size="small" />
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    Đang tải danh sách bạn bè...
                  </div>
                </div>
              ) : friendsError ? (
                <div style={{ marginBottom: '16px' }}>
                  <Alert
                    message="Không thể tải danh sách bạn bè"
                    description={friendsError}
                    type="error"
                    showIcon
                    size="small"
                    action={
                      <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={refreshFriends}
                        type="link"
                      >
                        Thử lại
                      </Button>
                    }
                  />
                </div>
              ) : friends && friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/profile/${friend.id}`)}
                  >
                    <Avatar
                      size="small"
                      src={friend.profilePictureUrl ? getMediaUrl(friend.profilePictureUrl) : undefined}
                      icon={!friend.profilePictureUrl ? <UserOutlined /> : undefined}
                    />
                    <span style={{ fontSize: '13px' }}>
                      {friend.firstName} {friend.lastName}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
                  <div style={{ fontSize: '12px' }}>Chưa có bạn bè nào</div>
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={refreshFriends}
                    type="link"
                    style={{ marginTop: '4px' }}
                  >
                    Làm mới
                  </Button>
                </div>
              )}
            </div>


          </div>
        </Sider>
      </Layout>
      <SettingsModal
        visible={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
      />
    </Layout>
  );
};

export default MainLayout;
