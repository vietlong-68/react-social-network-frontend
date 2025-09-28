import React, { useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Row,
    Col,
    message
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const UserForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    loading = false,
    title = "Tạo người dùng mới"
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {

                const formData = {
                    ...initialValues,
                    dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,

                    roles: initialValues.roles && initialValues.roles.length > 0 ? initialValues.roles[0].name : 'USER',
                };
                form.setFieldsValue(formData);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values) => {
        try {

            const submitData = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,

                roles: values.roles ? [{ name: values.roles }] : undefined,
            };


            if (initialValues) {
                delete submitData.email;
                delete submitData.roles;
            }





            await onSubmit(submitData);
            form.resetFields();
        } catch (error) {

        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>{title}</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    gender: 'MALE',
                    roles: [{ name: 'USER' }]
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="firstName"
                            label="Họ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ' },
                                { min: 2, max: 50, message: 'Họ phải từ 2-50 ký tự' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập họ"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="lastName"
                            label="Tên"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên' },
                                { min: 2, max: 50, message: 'Tên phải từ 2-50 ký tự' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập tên"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Nhập email"
                        type="email"
                        disabled={!!initialValues}
                    />
                </Form.Item>

                {!initialValues && (
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 8, max: 20, message: 'Mật khẩu phải từ 8-20 ký tự' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="gender"
                            label="Giới tính"
                        >
                            <Select placeholder="Chọn giới tính">
                                <Option value="MALE">Nam</Option>
                                <Option value="FEMALE">Nữ</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="dateOfBirth"
                            label="Ngày sinh"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày sinh"
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current > dayjs().endOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                        { max: 15, message: 'Số điện thoại tối đa 15 ký tự' }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Nhập số điện thoại"
                    />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                        { max: 200, message: 'Địa chỉ tối đa 200 ký tự' }
                    ]}
                >
                    <TextArea
                        prefix={<HomeOutlined />}
                        placeholder="Nhập địa chỉ"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="roles"
                    label="Vai trò"
                    rules={[
                        { required: true, message: 'Vui lòng chọn vai trò' }
                    ]}
                >
                    <Select
                        placeholder="Chọn vai trò"
                        optionLabelProp="label"
                        disabled={!!initialValues}
                    >
                        <Option value="USER" label="Người dùng">Người dùng</Option>
                        <Option value="ADMIN" label="Quản trị viên">Quản trị viên</Option>
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
                            loading={loading}
                        >
                            {initialValues ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserForm;
