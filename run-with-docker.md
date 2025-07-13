## Triển khai với Docker

### Chạy với môi trường local

_Mở Git Bash 1_

```bash
./docker_start.sh --local
```

```bash
docker exec -it backend bash
```

```bash
yarn install
```

```bash
bash ./migration.sh --seed
```

```bash
yarn start:dev
```

_Mở Git Bash 2_

```bash
docker exec -it frontend bash
```

```bash
yarn install
```

```bash
yarn start
```

# Chạy migration & tạo dữ liệu ảo

Ghi chú: Cần chuyển đổi file migration.sh từ chế độ `CRLF` sang `LF` để tránh lỗi khi chạy trong môi trường Linux/Docker.

```bash
docker exec -it backend sh
```

```bash
sh ./migration.sh --seed
```

Frontend: http://localhost:3000
Backend: http://localhost:8080/api
Swagger: http://localhost:8080/docs
phpMyAdmin: http://localhost:82

## Tài khoản DB mặc định:

- User: huy
- Password: huy
- Database: salon_booking_system

### Chạy với môi trường development

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
