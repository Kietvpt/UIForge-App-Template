# 🌟 UIForge App Template (Client Starter Kit & Staging Demo)

UIForge App Template là mã nguồn mẫu hoàn chỉnh (Starter Kit) sử dụng thư viện `@uiforge/core` (npm) và `UIForge.Core` (NuGet), sẵn sàng dùng làm:
1. **Môi trường Demo / Staging** cho người dùng trải nghiệm thực tế trên Web.
2. **Khung khởi đầu dự án (Boilerplate)** cho các khách hàng xây dựng ứng dụng ERP / Logistics.

---

## 🛠️ Hướng Dẫn Triển Khai Chi Tiết Từng Bước (Ubuntu 24.04 VPS)

### BƯỚC 1: Đẩy Package Lên GitHub Packages (Private Registry)

Nếu bạn muốn quản trị phiên bản tập trung qua GitHub Packages:
1. **Trong Source Chính (`UIForge-Core`)**:
   Tạo Git Tag mới và đẩy lên GitHub:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   GitHub Actions workflow (`.github/workflows/publish-packages.yml`) sẽ tự động đóng gói và xuất bản:
   - NuGet Package: `https://nuget.pkg.github.com/<OWNER>/index.json`
   - npm Package: `@<OWNER>/uiforge-core` trên `https://npm.pkg.github.com`

2. **Cấu hình đọc Package trong Source Này**:
   - Backend: Cập nhật file `backend/nuget.config` với GitHub PAT token của bạn.
   - Frontend: Tạo file `frontend/.npmrc`:
     ```ini
     @<OWNER>:registry=https://npm.pkg.github.com
     //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
     ```
   *(Lưu ý: Mặc định Source 2 này đã chứa sẵn bản build nội bộ trong thư mục `packages/` nên bạn có thể build và deploy chạy thử ngay lập tức mà không cần đợi publish).*

---

### BƯỚC 2: Cài Đặt Docker & Docker Compose Trên VPS Ubuntu 24.04

Đăng nhập vào VPS qua SSH và chạy các lệnh sau:
```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt các gói phụ trợ
sudo apt install -y ca-certificates curl gnupg lsb-release git

# 3. Thêm GPG key chính thức của Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 4. Thêm repository Docker vào Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Cài đặt Docker Engine & Docker Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. Kiểm tra cài đặt thành công
sudo docker --version
sudo docker compose version
```

---

### BƯỚC 3: Cấu Hình Môi Trường & Chạy Ứng Dụng Với Docker Compose

1. **Clone mã nguồn về máy chủ**:
   ```bash
   git clone <REPO_URL> /opt/uiforge-app
   cd /opt/uiforge-app
   ```

2. **Tạo file cấu hình môi trường `.env`**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Điền tên miền của bạn (đã trỏ bản ghi A về IP VPS)*:
   ```ini
   FRONTEND_DOMAIN=demo.uiforge.dev
   API_DOMAIN=api.uiforge.dev
   ACME_EMAIL=admin@yourdomain.com
   ```

3. **Khởi chạy ứng dụng**:

   - **Cách 1: Khởi chạy với PostgreSQL (Mặc định - Khuyên dùng cho Demo, chỉ tốn ~150MB RAM)**:
     ```bash
     sudo docker compose up -d --build
     ```

   - **Cách 2: Khởi chạy với Microsoft SQL Server 2022 (Nếu yêu cầu SQL Server)**:
     1. Trong `.env`, đổi `DB_PROVIDER=SqlServer`.
     2. Khởi chạy với profile `sqlserver`:
        ```bash
        sudo docker compose --profile sqlserver up -d --build
        ```

4. **Kiểm tra trạng thái**:
   ```bash
   sudo docker compose ps
   sudo docker compose logs -f caddy
   ```
   Caddy Server sẽ tự động cấp phát chứng chỉ SSL Let's Encrypt / ZeroSSL miễn phí. Bạn có thể mở trình duyệt truy cập ngay `https://demo.uiforge.dev`!

---

## 📂 Cấu Trúc Dự Án

```
UIForge-App-Template/
├── backend/                  # .NET 8 Web API Project (App.API)
│   ├── App.API/              # Host API tham chiếu UIForge.Core
│   └── nuget.config          # Cấu hình nguồn nạp NuGet
├── frontend/                 # React 18 + Vite Web App
│   ├── src/logic/            # Chứa các file Business Logic (*.bl.ts)
│   └── src/App.tsx           # Khởi tạo UIForgeApp và kết nối API
├── packages/                 # Chứa bản build cục bộ UIForge.Core (NuGet + tgz)
├── docker-compose.yml        # Quản lý toàn bộ dịch vụ (DB, BE, FE, SSL)
├── Dockerfile.backend        # Image backend .NET 8 Alpine
├── Dockerfile.frontend       # Image frontend Vite + Nginx
├── Caddyfile                 # Cấu hình reverse proxy & tự động SSL
└── .env.example              # Mẫu biến môi trường
```
