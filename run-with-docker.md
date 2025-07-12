## Triển khai với Docker

_Mở Git Bash_

```bash
./docker_start.sh
```

# Chạy migration & tạo dữ liệu ảo

Ghi chú: Cần chuyển đổi file migration.sh từ chế độ `CRLF` sang `LF` để tránh lỗi khi chạy trong môi trường Linux/Docker.

```bash
docker exec -it backend sh
```

```bash
sh ./migration.sh --seed
```

Frontend: http://localhost
Backend: http://localhost:8778
Swagger: http://localhost:8778/docs
phpMyAdmin: http://localhost:82

## Tài khoản DB mặc định:

- User: huy
- Password: huy
- Database: salon_booking_system
