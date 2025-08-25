import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Select, DatePicker, Button, message, Avatar, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import { useUser } from '../../contexts/UserContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import { updateProfile, changePassword } from '../../services/userService';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const SettingsModal = ({ visible, onCancel }) => {
    const { currentUser, updateCurrentUser } = useUser();
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();


    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);


    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(null);


    useEffect(() => {
        if (visible && currentUser) {
            profileForm.setFieldsValue({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                gender: currentUser.gender || undefined,
                dateOfBirth: currentUser.dateOfBirth ? dayjs(currentUser.dateOfBirth) : undefined,
                phone: currentUser.phone || '',
                address: currentUser.address || ''
            });


            passwordForm.resetFields();


            setProfileError(null);
            setPasswordError(null);
        }
    }, [visible, currentUser, profileForm, passwordForm]);


    const handleUpdateProfile = async (values) => {
        try {
            setProfileLoading(true);
            setProfileError(null);







            const profileData = {
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                dateOfBirth: values.dateOfBirth ?
                    (typeof values.dateOfBirth === 'string' ? values.dateOfBirth : values.dateOfBirth.format('YYYY-MM-DD'))
                    : undefined,
                phone: values.phone,
                address: values.address
            };



            const response = await updateProfile(profileData);
            message.success('Cập nhật thông tin cá nhân thành công!');


            if (response) {
                updateCurrentUser(response);
            }


            setTimeout(() => {
                onCancel();
            }, 500);

        } catch (err) {

            setProfileError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin cá nhân.');
            message.error(err.message || 'Có lỗi xảy ra khi cập nhật thông tin cá nhân.');
        } finally {
            setProfileLoading(false);
        }
    };


    const handleChangePassword = async (values) => {
        try {
            setPasswordLoading(true);
            setPasswordError(null);




            const passwordData = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmPassword
            };



            const response = await changePassword(passwordData);



            passwordForm.resetFields();

            message.success('Đổi mật khẩu thành công!');


            setTimeout(() => {
                onCancel();
            }, 500);

        } catch (error) {

            setPasswordError(error.message);
            message.error(`Có lỗi xảy ra: ${error.message}`);
        } finally {
            setPasswordLoading(false);
        }
    };


    const profileValidationRules = {
        firstName: [
            { required: false, message: 'Vui lòng nhập tên' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Tên không được quá 50 ký tự' },
            { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Tên chỉ được chứa chữ cái và khoảng trắng' }
        ],
        lastName: [
            { required: false, message: 'Vui lòng nhập họ' },
            { min: 2, message: 'Họ phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Họ không được quá 50 ký tự' },
            { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Họ chỉ được chứa chữ cái và khoảng trắng' }
        ],
        phone: [
            { required: false, message: 'Vui lòng nhập số điện thoại' },
            { max: 15, message: 'Số điện thoại không được quá 15 ký tự' }

        ],
        address: [
            { required: false, message: 'Vui lòng nhập địa chỉ' },
            { max: 200, message: 'Địa chỉ không được quá 200 ký tự' }
        ]
    };

    const passwordValidationRules = {
        currentPassword: [
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
        ],
        newPassword: [
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            { max: 20, message: 'Mật khẩu không được quá 20 ký tự' }
        ],
        confirmPassword: [
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
            }),
        ]
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined />
                    <span>Cài đặt tài khoản</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <Avatar
                        size={64}
                        src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : undefined}
                        icon={!currentUser?.profilePictureUrl ? <UserOutlined /> : undefined}
                    />
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {currentUser?.firstName} {currentUser?.lastName}
                        </div>
                        <div style={{ color: '#666' }}>{currentUser?.email}</div>
                    </div>
                </div>
            </div>

            <Tabs defaultActiveKey="profile" size="large">
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            Thông tin cá nhân
                        </span>
                    }
                    key="profile"
                >
                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                        autoComplete="off"
                    >
                        {profileError && (
                            <Alert
                                message="Lỗi cập nhật thông tin"
                                description={profileError}
                                type="error"
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Form.Item name="firstName" label="Tên" rules={profileValidationRules.firstName}>
                                <Input placeholder="Nhập tên" />
                            </Form.Item>

                            <Form.Item name="lastName" label="Họ" rules={profileValidationRules.lastName}>
                                <Input placeholder="Nhập họ" />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Form.Item name="gender" label="Giới tính">
                                <Select placeholder="Chọn giới tính" allowClear>
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="dateOfBirth" label="Ngày sinh">
                                <DatePicker
                                    placeholder="Chọn ngày sinh"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current > dayjs()}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item name="phone" label="Số điện thoại" rules={profileValidationRules.phone}>
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item name="address" label="Địa chỉ" rules={profileValidationRules.address}>
                            <TextArea rows={3} placeholder="Nhập địa chỉ" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={profileLoading}
                                icon={<SaveOutlined />}
                                style={{ width: '100%' }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <LockOutlined />
                            Đổi mật khẩu
                        </span>
                    }
                    key="password"
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        autoComplete="off"
                    >
                        {passwordError && (
                            <Alert
                                message="Lỗi đổi mật khẩu"
                                description={passwordError}
                                type="error"
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                        )}

                        <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={passwordValidationRules.currentPassword}>
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>

                        <Form.Item name="newPassword" label="Mật khẩu mới" rules={passwordValidationRules.newPassword}>
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                        <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={passwordValidationRules.confirmPassword}>
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={passwordLoading}
                                icon={<KeyOutlined />}
                                style={{ width: '100%' }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default SettingsModal;
