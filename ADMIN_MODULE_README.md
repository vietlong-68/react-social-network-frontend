# ADMIN MODULE - HƯỚNG DẪN SỬ DỤNG

## 📋 Tổng quan
Module quản trị đã được triển khai hoàn chỉnh với đầy đủ tính năng quản lý người dùng, thống kê và bảo mật.

## 🚀 Tính năng đã triển khai

### 1. **Admin Service** (`src/services/adminService.js`)
- ✅ Tất cả 12 admin APIs từ backend
- ✅ Xử lý authentication và error handling
- ✅ Logging chi tiết cho debugging

### 2. **Custom Hooks**
- ✅ `useAdminUsers` - Quản lý state users và CRUD operations
- ✅ `useAdminStatistics` - Quản lý thống kê hệ thống
- ✅ `useAdminActions` - Các actions admin (block, unblock, change role)

### 3. **Admin Components**
- ✅ `StatisticsCards` - Hiển thị thống kê với icons và colors
- ✅ `UserTable` - Bảng users với search, filter, pagination
- ✅ `UserForm` - Form tạo/sửa user với validation
- ✅ `BlockUserModal` - Modal khóa user với lý do
- ✅ `RoleUpdateModal` - Modal thay đổi role user

### 4. **Admin Layout & Pages**
- ✅ `AdminLayout` - Layout riêng cho admin với sidebar
- ✅ `AdminDashboard` - Trang tổng quan với thống kê
- ✅ `UserManagement` - Quản lý users với tabs (all/blocked)
- ✅ `Statistics` - Trang thống kê chi tiết

### 5. **Security & Routing**
- ✅ `AdminProtectedRoute` - Bảo vệ routes admin
- ✅ Role-based access control
- ✅ Admin menu chỉ hiển thị cho ADMIN users
- ✅ Redirect và error handling

## 🎯 Cách sử dụng

### 1. **Truy cập Admin Panel**
- Đăng nhập với tài khoản có role ADMIN
- Click vào menu "Quản trị" trong sidebar
- Hoặc truy cập trực tiếp `/admin`

### 2. **Quản lý người dùng**
- **Xem danh sách**: Tất cả users hoặc chỉ users bị khóa
- **Tìm kiếm**: Theo tên, email
- **Lọc**: Theo vai trò (ADMIN/USER) và trạng thái (active/blocked)
- **Tạo mới**: Click "Tạo người dùng mới"
- **Chỉnh sửa**: Click icon edit trong bảng
- **Khóa/Mở khóa**: Click icon lock/unlock
- **Thay đổi role**: Click icon crown
- **Xóa**: Click icon delete với confirmation

### 3. **Xem thống kê**
- **Dashboard**: Thống kê tổng quan
- **Statistics**: Thống kê chi tiết với charts
- **Real-time**: Click "Làm mới" để cập nhật dữ liệu

## 🔧 API Endpoints được sử dụng

### User Management
- `GET /admin/users` - Lấy tất cả users
- `GET /admin/users/{id}` - Lấy user theo ID
- `POST /admin/users` - Tạo user mới
- `PUT /admin/users/{id}` - Cập nhật user
- `DELETE /admin/users/{id}` - Xóa user
- `POST /admin/users/{id}/block` - Khóa user
- `POST /admin/users/{id}/unblock` - Mở khóa user
- `GET /admin/users/blocked` - Lấy users bị khóa
- `POST /admin/users/{id}/roles` - Thay đổi role

### Statistics
- `GET /admin/users/statistics/users` - Thống kê users
- `GET /admin/users/statistics/posts` - Thống kê posts
- `GET /admin/users/statistics/overview` - Thống kê tổng hợp

## 🎨 UI/UX Features

### Responsive Design
- ✅ Mobile-friendly với Ant Design
- ✅ Collapsible sidebar
- ✅ Responsive tables và cards

### User Experience
- ✅ Loading states cho tất cả operations
- ✅ Success/error notifications
- ✅ Confirmation modals cho destructive actions
- ✅ Search và filter functionality
- ✅ Pagination cho large datasets

### Visual Design
- ✅ Consistent color scheme
- ✅ Icons cho tất cả actions
- ✅ Status indicators (active/blocked)
- ✅ Role badges (ADMIN/USER)

## 🔒 Security Features

### Authentication
- ✅ JWT token validation
- ✅ Automatic token refresh
- ✅ Secure API calls

### Authorization
- ✅ Role-based route protection
- ✅ Admin-only access to admin features
- ✅ Proper error handling for unauthorized access

### Data Validation
- ✅ Form validation với Ant Design
- ✅ Input sanitization
- ✅ Error boundary handling

## 📁 Cấu trúc files

```
src/
├── services/
│   └── adminService.js
├── hooks/
│   ├── useAdminUsers.js
│   ├── useAdminStatistics.js
│   └── useAdminActions.js
├── components/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── StatisticsCards.jsx
│   │   ├── UserTable.jsx
│   │   ├── UserForm.jsx
│   │   ├── BlockUserModal.jsx
│   │   ├── RoleUpdateModal.jsx
│   │   └── index.js
│   └── AdminProtectedRoute.jsx
├── pages/
│   └── Admin/
│       ├── index.jsx (Dashboard)
│       ├── UserManagement.jsx
│       └── Statistics.jsx
└── routes/
    └── index.jsx (updated with admin routes)
```

## 🚀 Deployment Notes

### Environment Variables
- Đảm bảo `API_BASE_URL` được cấu hình đúng
- JWT token được lưu trong localStorage

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Responsive design

## 🐛 Troubleshooting

### Common Issues
1. **403 Forbidden**: Kiểm tra user có role ADMIN
2. **401 Unauthorized**: Token hết hạn, cần đăng nhập lại
3. **Loading không dừng**: Kiểm tra API connection
4. **Data không hiển thị**: Kiểm tra console logs

### Debug Tips
- Mở Developer Tools để xem network requests
- Check console logs cho error messages
- Verify API endpoints trong Network tab

## 📈 Performance

### Optimizations
- ✅ Lazy loading cho admin components
- ✅ Efficient state management với custom hooks
- ✅ Debounced search và filter
- ✅ Pagination để giảm load time

### Monitoring
- ✅ Error logging
- ✅ API call tracking
- ✅ User action analytics

---

## ✅ Module đã sẵn sàng sử dụng!

Tất cả tính năng admin đã được triển khai hoàn chỉnh và sẵn sàng cho production. Chỉ cần đảm bảo backend APIs hoạt động đúng và user có role ADMIN để truy cập.
