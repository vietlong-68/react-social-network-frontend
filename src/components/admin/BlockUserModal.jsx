import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    message,
    Space
} from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const BlockUserModal = ({
    visible,
    onCancel,
    onConfirm,
    userInfo,
    loading = false
}) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setConfirmLoading(true);
            await onConfirm(userInfo.id, values.reason);
            form.resetFields();
            message.success('Khóa người dùng thành công');
        } catch (error) {

            message.error('Không thể khóa người dùng');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LockOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                    Khóa người dùng
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
                        <strong>Bạn có chắc chắn muốn khóa người dùng:</strong>
                    </p>
                    <p style={{ margin: '8px 0', fontSize: '16px' }}>
                        {userInfo.firstName} {userInfo.lastName}
                    </p>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Email: {userInfo.email}
                    </p>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="reason"
                    label="Lý do khóa"
                    rules={[
                        { required: true, message: 'Vui lòng nhập lý do khóa' },
                        { max: 500, message: 'Lý do tối đa 500 ký tự' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập lý do khóa người dùng này..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            danger
                            htmlType="submit"
                            loading={confirmLoading || loading}
                            icon={<LockOutlined />}
                        >
                            Khóa người dùng
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BlockUserModal;
