# 🎬 iCinema: Modern Full-Stack Movie Management System

iCinema adalah platform manajemen katalog film berbasis web yang dirancang untuk memberikan pengalaman interaktif bagi pengguna dalam menjelajahi film, serta menyediakan alat kontrol yang kuat bagi administrator. Aplikasi ini mengintegrasikan teknologi cloud modern untuk menangani aset media secara efisien.

---

## 📸 Dokumentasi Visual

| Halaman Utama (Katalog) | Dashboard Admin (Manage Movie) |
| :---: | :---: |
| ![Main Page](documentation/main-page.png) | ![Admin Page](documentation/admin-page.png) |

| Interaksi Kartu (Flip) | Pemutar Video |
| :---: | :---: |
| ![Flip Card](documentation/flip-card.png) | ![Video Player](documentation/video-player.png) |

---

## ⚙️ Bagaimana Aplikasi ini Berjalan? (Deployment & Operasional)

iCinema menggunakan pipeline **CI/CD (Continuous Integration & Continuous Deployment)** otomatis untuk memastikan aplikasi selalu dalam kondisi stabil dan terbarui di server produksi.

### **Alur Deployment Otomatis**
Setiap kali ada perubahan kode pada branch `main`, GitHub Actions akan menjalankan proses berikut:

#### **1. Tahap CI (Continuous Integration)**
- **Build Frontend**: GitHub Runner membangun aplikasi React menjadi file statis yang dioptimalkan.
- **Packaging**: Menggabungkan hasil build frontend dengan seluruh logika backend (controller, models, middleware).
- **Artifact Upload**: Paket siap pakai disimpan sebagai artifact untuk menjamin konsistensi antara tahap build dan deploy.

#### **2. Tahap CD (Continuous Deployment)**
- **Environment Setup**: Membuat file `.env` secara dinamis menggunakan rahasia (Secrets) dari GitHub.
- **Deployment ke Azure**: Mengirimkan paket aplikasi ke **Azure App Service** menggunakan mekanisme *Zero Downtime*.
- **Startup**: Aplikasi langsung aktif di cloud dan terhubung ke **MongoDB Atlas** serta **Cloudinary**.

---

## 🛠️ Bagaimana Aplikasi ini Dibuat? (Arsitektur Teknis)

Aplikasi ini dibangun dengan standar industri menggunakan **MERN Stack** dan arsitektur yang modular.

### **Backend (Node.js & Express)**
- **API Berbasis REST**: Mengelola data menggunakan metode HTTP yang bersih (GET, POST, PATCH, DELETE).
- **Keamanan (JWT & Bcrypt)**: Melindungi akun pengguna dengan enkripsi password dan token autentikasi yang aman.
- **Role-Based Access Control (RBAC)**: Membatasi fitur manajemen hanya untuk akun dengan peran Admin.
- **Cloudinary Integration**: Mengelola penyimpanan file poster dan video secara eksternal melalui API Cloudinary untuk efisiensi beban server.

### **Frontend (React & Redux)**
- **State Management**: Menggunakan Redux untuk menjaga sinkronisasi data di seluruh halaman tanpa perlu memuat ulang browser.
- **Interaktivitas**: Fitur kartu film yang bisa berputar (flip) dan pemutar video terintegrasi memberikan pengalaman menonton trailer yang mulus.
- **Validasi (Joi)**: Memastikan setiap data yang dimasukkan (seperti rating atau file media) sesuai dengan format yang diharapkan sebelum dikirim ke server.

---

## 🚀 Memulai (Setup Lokal)

1. **Clone & Install**:
   ```bash
   git clone https://github.com/ghofarialfan/iCinema.git
   npm install
   cd frontend && npm install
   ```

2. **Konfigurasi Environment**:
   Isi file `.env` dengan kredensial MongoDB dan Cloudinary Anda.

3. **Jalankan**:
   ```bash
   npm run dev # Menjalankan Backend & Frontend secara bersamaan
   ```

---

## 📝 Kontributor
- **Ghofari Alfan** - *Full Stack Developer & DevOps*

---
*Proyek ini dikembangkan sebagai tugas besar untuk mata kuliah Pengembangan Sistem Orientasi Objek (PSO).*
