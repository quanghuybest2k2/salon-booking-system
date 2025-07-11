# Cài đặt

Tạo `.env` từ `.env.example` cho cả frontend và backend

Mở với Git Bash

```bash
./install_package_local.sh
```

# Hệ Thống Đặt Lịch Salon

## Mô tả dự án

Hệ thống đặt lịch salon là một giải pháp toàn diện cho phép khách hàng đặt lịch hẹn với các salon làm đẹp (cắt tóc, làm móng, chăm sóc da, v.v.) một cách dễ dàng và hiệu quả. Hệ thống hỗ trợ quản lý lịch hẹn, kiểm tra thời gian trống của nhân viên hoặc salon, gửi thông báo, và cung cấp các công cụ quản lý cho chủ salon.

---

# 🧩 Tính Năng Chính

## 1. 👤 Đăng Ký & Đăng Nhập Người Dùng

### Loại tài khoản hỗ trợ

- **Khách hàng**
- **Nhân viên salon**
- **Quản lý salon**

### Phương thức đăng nhập

- Email & mật khẩu
- OAuth (Google, Facebook)

### Phân quyền người dùng

- **Khách hàng**

  - Đặt và hủy lịch hẹn
  - Xem lịch sử các lần đặt hẹn

- **Nhân viên salon**

  - Xem lịch làm việc của mình
  - Quản lý thời gian có thể phục vụ khách

- **Quản lý salon**
  - Quản lý toàn bộ lịch hẹn
  - Quản lý nhân viên và danh sách dịch vụ

---

## 2. 📆 Quản Lý Lịch Hẹn (CRUD)

### Tạo lịch hẹn

- Chọn dịch vụ, nhân viên thực hiện và thời gian

### Xem lịch hẹn

- Lọc theo ngày, giờ, nhân viên hoặc khách hàng

### Cập nhật lịch hẹn

- Thay đổi thời gian, dịch vụ hoặc người phục vụ

### Hủy lịch hẹn

- Gửi thông báo cho cả nhân viên và khách hàng

---

## 3. 🕐 Kiểm Tra Lịch Trống

- Tự động kiểm tra thời gian rảnh của nhân viên dựa trên bảng `ProviderAvailability`
- Ngăn chặn trùng lịch hoặc xung đột thời gian theo thời gian thực

---

## 4. ✂️ Quản Lý Dịch Vụ

### Chủ salon có thể

- Thêm mới dịch vụ (ví dụ: cắt tóc, làm móng)
- Cập nhật hoặc xóa dịch vụ

### Mỗi dịch vụ bao gồm

- Tên dịch vụ
- Mô tả
- Thời lượng (phút)
- Giá cả

---

## 5. 🔔 Gửi Thông Báo

- **Khi đặt lịch thành công**: Gửi xác nhận qua email hoặc thông báo đẩy
- **Nhắc lịch hẹn (trước 24h)**: Gửi nhắc nhở qua email hoặc SMS
- **Khi thay đổi/hủy hẹn**: Gửi thông báo đến cả khách hàng và nhân viên

---

## Công nghệ

- **Backend**: NestJS (Node.js framework)
- **Database**: MYSQL
- **Xác thực**: JWT hoặc OAuth2
- **Email Service**: Nodemailer hoặc SendGrid
- **Thông báo đẩy** _(tuỳ chọn)_: Firebase Cloud Messaging (FCM)
- **Cron Job**: `@nestjs/schedule`
- **Frontend**: React

---

## Kỹ năng học được

- Xử lý logic thời gian (xung đột lịch, thời gian trống, múi giờ)
- Tích hợp email/thông báo đẩy tự động
- Tự động hóa bằng Cron Job
- Phân quyền bằng Custom Decorator trong NestJS
- Thiết kế database tối ưu

---

## Cấu trúc cơ sở dữ liệu

### Bảng `User`

- **Thông tin**: id, username, email, password, full_name, phone_number, role, refreshToken, refreshTokenExpiry, created_at, updated_at
- **Quan hệ**:
  - 1 User → N ServiceProvider
  - 1 User → N Appointment
  - 1 User → N Notification

### Bảng `ServiceProvider`

- **Thông tin**: id, user_id, business_name, address, description
- **Quan hệ**:
  - 1 ServiceProvider → N Service
  - 1 ServiceProvider → N Appointment
  - 1 ServiceProvider → N ProviderAvailability

### Bảng `Service`

- **Thông tin**: id, provider_id, name, description, duration_minutes, price
- **Quan hệ**:
  - 1 Service → N Appointment

### Bảng `ProviderAvailability`

- **Thông tin**: id, provider_id, day_of_week, start_time, end_time

### Bảng `Appointment`

- **Thông tin**: id, customer_id, service_id, provider_id, start_time, end_time, status, notes, created_at, updated_at
- **Quan hệ**:
  - 1 Appointment → N Notification

### Bảng `Notification`

- **Thông tin**: id, appointment_id, user_id, type, sent_at, status, message

---

## Đề xuất mở rộng

### 1. Thanh toán trực tuyến

- Tích hợp VNPay hoặc MoMo
- Hỗ trợ hoàn tiền khi hủy lịch hẹn

### 2. Đồng bộ lịch

- Tích hợp Google Calendar
- Cho phép người dùng xem lịch hẹn trên ứng dụng lịch cá nhân

### 3. Chương trình khách hàng thân thiết

- Thêm bảng `LoyaltyProgram` để theo dõi điểm thưởng
- Cung cấp ưu đãi/giảm giá cho khách hàng thường xuyên

### 4. Phân tích dữ liệu

- Xây dựng Dashboard quản lý
- Theo dõi lịch hẹn, doanh thu, hiệu suất nhân viên

---

## Kiến trúc hệ thống

```plaintext
Client (Browser / Mobile App)
  ↓↑ (REST API)
Backend (NestJS)
  ↓↑ (Database Queries)
Database (MYSQL)
  ↓↑ (Email / Push Notification)
Notification Service (Nodemailer / SendGrid)
  ↓↑ (Cron Job)
Scheduler (@nestjs/schedule)
```
