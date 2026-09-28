# Material-Control — STORE PC (Frontend)

หน้า **STORE ( MAX-MIN )** สำหรับระบบควบคุมวัสดุ (Material Control) สร้างด้วย
**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4** และออกแบบให้
ต่อกับ backend **ASP.NET** ได้

## เริ่มใช้งาน

```bash
npm install
npm run dev        # เปิด http://localhost:3000
```

คำสั่งอื่น:

```bash
npm run build      # สร้าง production build
npm start          # รัน production
npm run lint       # ตรวจ ESLint
```

## เชื่อมต่อ ASP.NET backend

1. คัดลอก `env.example` เป็น `.env.local`
2. ตั้งค่า URL ของ backend:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
   ```

ถ้าเว้นว่างไว้ ระบบจะใช้ข้อมูลตัวอย่างในเครื่อง (`src/lib/data.ts`) เพื่อให้พัฒนา UI
ได้โดยไม่ต้องมี backend

Endpoint ที่ฝั่ง ASP.NET ควรมี (ดู `src/lib/api.ts`):

| Method | Path              | หน้าที่                    |
| ------ | ----------------- | -------------------------- |
| GET    | `/api/store`      | ดึงรายการทั้งหมด (pull)     |
| POST   | `/api/store`      | เพิ่มรายการใหม่             |
| PUT    | `/api/store/{id}` | อัปเดตรายการ (push)         |

## โครงสร้างโปรเจกต์

```
src/
├─ app/
│  ├─ layout.tsx        # root layout + ฟอนต์ (Inter + Noto Sans Thai)
│  ├─ page.tsx          # ประกอบ Sidebar + Topbar + StoreView
│  └─ globals.css       # Tailwind v4 + theme tokens
├─ components/
│  ├─ Sidebar.tsx       # เมนูซ้าย
│  ├─ Topbar.tsx        # แถบบน (ผู้ใช้ / logout)
│  ├─ StoreView.tsx     # ตาราง MAX-MIN + ค้นหา + ตัวกรอง
│  └─ icons.tsx         # ไอคอน SVG inline
└─ lib/
   ├─ types.ts          # type + logic คำนวณสถานะสต็อก
   ├─ data.ts           # ข้อมูลตัวอย่าง
   └─ api.ts            # เรียก API ASP.NET (มี fallback)
```

## Git — pull / push

```bash
git pull origin main       # ดึงงานล่าสุด
git add .
git commit -m "ข้อความ"
git push origin main       # ส่งขึ้น GitHub
```

Repo: https://github.com/pongpakornn/Material-Control
