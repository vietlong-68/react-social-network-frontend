import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Select,
    Button,
    message,
    Space,
    Typography
} from 'antd';
import { CrownOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const RoleUpdateModal = ({
    visible,
    onCancel,
    onConfirm,
    userInfo,
    loading = false
}) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (visible && userInfo) {

            const currentRole = userInfo.roles?.[0]?.name || 'USER';
            form.setFieldsValue({
                roleType: currentRole
            });
        }
    }, [visible, userInfo, form]);

    const handleSubmit = async (values) => {
        try {
            setConfirmLoading(true);


            const roleData = {
                roleType: values.roleType,
                reason: `Cập nhật vai trò từ ${userInfo?.roles?.[0]?.name || 'USER'} thành ${values.roleType}`
            };

            await onConfirm(userInfo.id, roleData);
            form.resetFields();
            message.success('Cập nhật vai trò thành công');
        } catch (error) {

            message.error('Không thể cập nhật vai trò');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const getCurrentRoleText = () => {
        if (!userInfo?.roles || userInfo.roles.length === 0) return 'Người dùng';
        return userInfo.roles[0].name === 'ADMIN' ? 'Quản trị viên' : 'Người dùng';
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CrownOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Cập nhật vai trò người dùng
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
        >
            {userInfo && (
                <div style={{ marginBottom: '16px' }}>
                    <p>
                        <strong>Người dùng:</strong> {userInfo.firstName} {userInfo.lastName}
                    </p>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Email: {userInfo.email}
                    </p>
                    <p>
                        <strong>Vai trò hiện tại:</strong> {getCurrentRoleText()}
                    </p>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="roleType"
                    label="Vai trò mới"
                    rules={[
                        { required: true, message: 'Vui lòng chọn vai trò' }
                    ]}
                >
                    <Select
                        placeholder="Chọn vai trò mới"
                        optionLabelProp="label"
                    >
                        <Option value="USER" label="Người dùng">
                            <Space>
                                <UserOutlined />
                                Người dùng
                            </Space>
                        </Option>
                        <Option value="ADMIN" label="Quản trị viên">
                            <Space>
                                <CrownOutlined />
                                Quản trị viên
                            </Space>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={confirmLoading || loading}
                            icon={<CrownOutlined />}
                        >
                            Cập nhật vai trò
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleUpdateModal;
