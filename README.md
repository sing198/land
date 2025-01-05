# ระบบบริหารจัดการข้อมูลที่ดินและราษฎร ส.ป.ก. (ALRO Land & Citizen Management System v2.0)

ระบบเว็บแอปพลิเคชันเวอร์ชันใหม่ที่ได้รับการออกแบบและพัฒนาขึ้นใหม่ทั้งหมด (Complete Rewrite & Architecture Modernization) ตามมาตรฐานระดับ Enterprise เพื่อการบริหารจัดการข้อมูลแปลงที่ดิน ส.ป.ก. 4-01, ทะเบียนราษฎรผู้ได้รับสิทธิ์, ระบบทายาท, แผนที่เชิงพื้นที่ (GIS) และการวิเคราะห์ข้อมูลสถิติ (Real-time Analytics Dashboard)

---

## 🌟 จุดเด่นและฟีเจอร์หลักในระบบ (Key Features)

1. **สถาปัตยกรรมปลอดภัยระดับสูง (Enterprise Security)**
   - Parameterized Queries 100% ป้องกัน SQL Injection
   - ป้องกันช่องโหว่ความปลอดภัยด้วย **Helmet**, **Rate Limiting (DDoS prevention)**, และ **CORS Configuration**
   - ระบบยืนยันตัวตนด้วย **JWT (JSON Web Token)** พร้อมการเข้ารหัสรหัสผ่านด้วย **Bcrypt**

2. **ระบบจัดการสิทธิ์ผู้ใช้งาน (Role-Based Access Control - RBAC)**
   - `Role 0 (User)`: ประชาชนทั่วไป (สืบค้นข้อมูลแปลงที่ดิน, ดูแผนที่ GIS ภาพรวม)
   - `Role 1 (Legal Officer)`: เจ้าหน้าที่ฝ่ายกฎหมาย (ดูรายละเอียดข้อมูลแปลงที่ดิน, ราษฎร, และทายาท)
   - `Role 2 (Land Reform Officer)`: เจ้าหน้าที่ปฏิรูปที่ดิน (เพิ่ม/แก้ไขแปลงที่ดิน, ราษฎร, ผูกสิทธิ์ทายาท, แนบเอกสาร)
   - `Role 3 (Admin)`: ผู้ดูแลระบบสูงสุด (จัดการข้อมูลทั้งหมด ลบข้อมูล จัดการผู้ใช้)

3. **แผนที่ภูมิสารสนเทศเชิงโต้ตอบ (Interactive GIS Leaflet)**
   - แสดงแปลงที่ดินแบบ Polygon ตามพิกัดจริง พร้อมสีจำแนกตามประเภทการใช้ประโยชน์ที่ดิน
   - สลับโหมดแผนที่ระหว่าง **แผนที่ถนน (OpenStreetMap)** และ **ภาพถ่ายดาวเทียม (ESRI Satellite)**
   - เครื่องมือ **Map Coordinate Picker** สำหรับคลิกเลือกพิกัดลงในฟอร์มบันทึกแปลงที่ดิน

4. **แดชบอร์ดสรุปสถิติแบบ Real-Time (Analytics Dashboard)**
   - คำนวณยอดรวมแปลงที่ดิน, เนื้อที่รวม (ไร่), จำนวนราษฎร และจำนวนทายาท จากฐานข้อมูลจริง
   - **Doughnut Chart**: สัดส่วนประเภทการใช้ประโยชน์ที่ดิน (ยางพารา, สวนผลไม้, ปศุสัตว์, ฯลฯ)
   - **Bar Chart**: การกระจายตัวของแปลงที่ดินในแต่ละซอย (ซอย 0 - 13)

5. **ระบบสืบค้นข้อมูลประชาชนและคุ้มครองข้อมูลส่วนบุคคล (PDPA Masking)**
   - ประชาชนสามารถค้นหาข้อมูลแปลงที่ดินได้สะดวกรวดเร็ว
   - มีระบบ Masking ข้อมูลส่วนบุคคล (เลขบัตรประชาชน `1-1000-xxxx0-01-1`, เบอร์โทรศัพท์ `080-xxx-0001`)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
land/
├── backend/                  # RESTful API (Node.js Express + MariaDB)
│   ├── database/             # DDL & Mock-up Seed Data (schema.sql, seed.sql)
│   ├── src/
│   │   ├── config/           # ตั้งค่า Database Pool & Environment (.env)
│   │   ├── constants/        # กำหนดระดับสิทธิ์ Roles
│   │   ├── controllers/      # ตัวควบคุม HTTP Requests & Responses
│   │   ├── middlewares/      # Auth, Role Guards, Validation, Upload, Errors
│   │   ├── repositories/     # Parameterized SQL Queries Layer
│   │   ├── routes/           # RESTful API Endpoints (/api/v1/...)
│   │   ├── services/         # Business Logic Layer & Transactions
│   │   ├── utils/            # API Response Formatters & Privacy Masking
│   │   └── validations/      # Joi Schemas
│   ├── uploads/              # ไดเรกทอรีจัดเก็บเอกสารและภาพถ่าย
│   └── server.js             # Entry Point Server
│
├── frontend/                 # Client Web Application (Vue 3 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/              # รวม Axios API Services
│   │   ├── assets/           # Global CSS & Tailwind Directives
│   │   ├── components/       # Common UI, แดชบอร์ด, แผนที่ GIS
│   │   ├── router/           # Vue Router พร้อม Navigation Guards
│   │   ├── stores/           # Pinia Stores (authStore, commonStore)
│   │   ├── views/            # หน้าจอหลัก (Map, Dashboard, Lands, Citizens, Heirs, Search, Login)
│   │   ├── App.vue           # Root Layout
│   │   └── main.js           # Client Entry Point
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docker-compose.yml        # Docker Deployment Configuration
├── README.md                 # คู่มือการใช้งานระบบ
└── .gitignore
```

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. นำเข้าฐานข้อมูล (Database Setup)
นำเข้าไฟล์ DDL และข้อมูลจำลองเข้าสู่ฐานข้อมูล MariaDB/MySQL (`alro_land`):
```bash
backend/database/schema.sql
backend/database/seed.sql
```

### 2. รันระบบ Backend
```bash
cd backend
npm install
npm run dev     # เซิร์ฟเวอร์จะรันที่ http://localhost:3000
```

> **บัญชีผู้ใช้สำหรับทดสอบ (Mock Accounts):**
> - **ผู้ดูแลระบบ (Admin):** Username: `admin` | Password: `Admin@123456`
> - **เจ้าหน้าที่ ส.ป.ก. (Land Officer):** Username: `officer_land` | Password: `Admin@123456`
> - **นิติกร (Legal Officer):** Username: `officer_legal` | Password: `Admin@123456`

### 3. รันระบบ Frontend
```bash
cd frontend
npm install
npm run dev     # เว็บแอปพลิเคชันจะรันที่ http://localhost:5173
```

---

## 🐳 การรันด้วย Docker Compose (คำสั่งเดียว)

```bash
docker compose up -d --build
```
ระบบจะรัน Database, Backend, และ Frontend พร้อมเข้าใช้งานผ่านพอร์ต 80 ทันที
