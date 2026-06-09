# iCinema - Modern Movie Management System

iCinema adalah aplikasi web manajemen film berbasis MERN Stack yang memungkinkan pengguna untuk menjelajahi katalog film dan administrator untuk mengelola konten dengan fitur unggahan media terintegrasi ke Cloudinary.

## 🚀 Fitur Utama

- **Katalog Film Interaktif**: Tampilan kartu film dengan fitur *flipping* untuk melihat deskripsi dan memutar video.
- **Manajemen Konten (Admin)**: 
  - CRUD (Create, Read, Update, Delete) Film dan Genre.
  - Unggah Poster (Gambar) dan File Film (Video) langsung ke Cloudinary.
- **Sistem Autentikasi**: Login dan Register menggunakan JWT (JSON Web Token) dengan Role-Based Access Control (Admin & User).
- **Pencarian & Filter**: Filter film berdasarkan genre dan rating, serta fitur pencarian judul.
- **Responsive Design**: Dioptimalkan untuk berbagai ukuran layar (Desktop & Mobile).
- **Otomatisasi CI/CD**: Terintegrasi dengan GitHub Actions untuk pengujian dan penyebaran otomatis ke Azure.

## 🛠️ Teknologi yang Digunakan

### **Frontend**
- **React.js**: Library UI utama.
- **Redux & Redux-Thunk**: State management global.
- **Joi**: Validasi skema di sisi klien.
- **Bootstrap & CSS3**: Styling dan tata letak.

### **Backend**
- **Node.js & Express**: Lingkungan server dan framework web.
- **MongoDB & Mongoose**: Database NoSQL dan pemodelan data.
- **Multer & Cloudinary Storage**: Manajemen unggahan file media.
- **Bcrypt.js**: Hashing password untuk keamanan.

### **DevOps**
- **GitHub Actions**: Alur kerja CI/CD.
- **Azure App Service**: Hosting aplikasi.

## 📦 Struktur Proyek

```text
iCinema/
├── controller/          # Logika API Backend
├── models/              # Skema Database Mongoose
├── middleware/          # Autentikasi & Proteksi Rute
├── utils/               # Utilitas (Cloudinary, MongoDB Config)
├── frontend/            # Aplikasi React (Frontend)
│   ├── src/
│   │   ├── actions/     # Redux Actions
│   │   ├── components/  # Komponen UI Reusable
│   │   └── pages/       # Halaman Utama (Movies, AddMovie, dll)
└── .github/workflows/   # Konfigurasi CI/CD
```

## ⚙️ Persiapan Lokal

### 1. Prasyarat
- Node.js installed
- MongoDB account (Atlas)
- Cloudinary account

### 2. Konfigurasi Environment
Buat file `.env` di direktori root dan isi variabel berikut:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Instalasi
```bash
# Instal dependensi backend
npm install

# Instal dependensi frontend
cd frontend
npm install
```

### 4. Menjalankan Aplikasi
```bash
# Jalankan backend (di root)
npm run dev

# Jalankan frontend (di folder frontend)
npm start
```

## 🚢 Deployment

Proyek ini dikonfigurasi untuk deployment otomatis ke Azure melalui GitHub Actions. Pastikan untuk mengatur **GitHub Secrets** berikut di repositori Anda:
- `MONGODB_URL`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `AZURE_WEBAPP_PUBLISH_PROFILE`

## 🤝 Kontribusi
Kontribusi selalu terbuka! Silakan lakukan *fork* pada repositori ini dan buat *pull request* dengan deskripsi perubahan Anda.

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
