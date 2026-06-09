# 🎬 iCinema: Modern Full-Stack Movie Management System

iCinema adalah platform manajemen katalog film berbasis web yang dibangun dengan **MERN Stack** (MongoDB, Express, React, Node.js). Aplikasi ini dirancang untuk memberikan pengalaman interaktif bagi pengguna dalam menjelajahi film, serta menyediakan alat kontrol yang kuat bagi administrator untuk mengelola konten media (gambar dan video) secara efisien melalui integrasi cloud.

<img width="1916" height="912" alt="Screenshot 2026-06-09 235737" src="https://github.com/user-attachments/assets/0c10b8d2-1c1f-4baa-8056-1a57fd6e4eda" />


---

## 📸 Dokumentasi Visual

| Halaman Utama (Katalog) | Dashboard Admin (Manage Movie) |
| :---: | :---: |
| <img width="1916" height="912" alt="Screenshot 2026-06-09 235737" src="https://github.com/user-attachments/assets/d78119cf-3ff1-4562-8efa-25f9006546dc" />| <img width="762" height="822" alt="Screenshot 2026-06-09 235911" src="https://github.com/user-attachments/assets/56d169d5-7439-4458-866c-b9670da6ecd8" />|

| Interaksi Kartu | Pemutar Video |
| :---: | :---: |
| <img width="888" height="881" alt="Screenshot 2026-06-09 235956" src="https://github.com/user-attachments/assets/d6d72811-7566-4c45-9bb2-0e731781eb08" />| <img width="617" height="358" alt="Screenshot 2026-06-10 000121" src="https://github.com/user-attachments/assets/dcee4861-99e8-4e75-a040-7db9f4fae2d1" />|

---

## ⚙️ Bagaimana Aplikasi ini Berjalan? (Deployment & Operasional)

iCinema menggunakan pipeline **CI/CD (Continuous Integration & Continuous Deployment)** otomatis melalui **GitHub Actions** untuk deployment ke **Azure App Service**.

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

## ✨ Fitur Utama
<ul>
  <li> Sign In / Sign Up / Sign Out pengguna. </li>
  <li> Menerima email selamat datang saat pendaftaran menggunakan Nodemailer. </li>
  <li> Menambahkan film baru ke dalam katalog (Admin). </li>
  <li> Menghapus film dan genre (Admin). </li>
  <li> Upload Poster dan Video langsung ke Cloudinary. </li>
  <li> Filter film berdasarkan kategori genre dan rating. </li>
</ul>

---

## 📡 API Reference

### **Users**
<ul>
  <li> <b>POST</b> /api/auth/signUp </li>
  <li> <b>POST</b> /api/auth/signIn </li>
  <li> <b>PATCH</b> /api/users/:userId </li>
  <li> <b>DELETE</b> /api/users/:userId </li>
</ul>

### **Movies**
<ul>
  <li> <b>GET</b> /api/movies </li>
  <li> <b>GET</b> /api/movies/:movieId </li>
  <li> <b>POST</b> /api/movies/addMovie </li>
  <li> <b>PATCH</b> /api/movies/:movieId </li>
  <li> <b>DELETE</b> /api/movies/:movieId </li>
</ul>

### **Genres**
<ul>
  <li> <b>GET</b> /api/genres </li>
  <li> <b>POST</b> /api/genres </li>
  <li> <b>DELETE</b> /api/genres/:genreId </li>
</ul>

---

## 🚀 Persiapan Lokal & Instalasi

### **1. Prasyarat**
- Node.js terinstal.
- Akun MongoDB Atlas dan Cloudinary.

### **2. Instalasi**
Gunakan package manager [npm](https://www.npmjs.com/) untuk menginstal iCinema.

```bash
# Clone repository
git clone https://github.com/ghofarialfan/iCinema.git

# Masuk ke direktori
cd iCinema

# Instal seluruh paket dependensi
npm run setup
```

### **3. Menjalankan Proyek**
```bash
# Jalankan mode pengembangan (Backend & Frontend sekaligus)
npm run dev
```

---

## 📝 Kontributor
- **ferdinan valliandra** -
- **Faiz Roihan** -
- **Alfan Ghofari** -

---
*Proyek ini dikembangkan sebagai tugas besar untuk mata kuliah Pengembangan Sistem Orientasi Objek (PSO).*
