<img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/432fed33-80b8-4f21-871b-96f7077b0fc3" /><img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/10abc692-f828-4af4-a241-86c77a67ebf2" /># 🎬 iCinema: Modern Full-Stack Movie Management System

iCinema adalah platform manajemen katalog film berbasis web yang dirancang untuk memberikan pengalaman interaktif bagi pengguna dalam menjelajahi film, serta menyediakan alat kontrol yang kuat bagi administrator. Aplikasi ini mengintegrasikan teknologi cloud modern untuk menangani aset media secara efisien.

---

## 📸 Dokumentasi Visual

| Halaman Utama (Katalog) | Dashboard Admin (Manage Movie) |
| :---: | :---: |
| ![Main Page](<img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/6929d050-fee0-4943-a6cf-9ac203410d67" /> | ![Admin Page](<img width="762" height="822" alt="image" src="https://github.com/user-attachments/assets/f6a17d81-c002-431e-be1c-83a6bea42498" />

| Interaksi Saat Memilih Film | Pemutar Video |
| :---: | :---: |
| ![Interaksi Saat Memilih Film](<img width="888" height="881" alt="image" src="https://github.com/user-attachments/assets/1f909072-dd9f-4b33-93d3-d5871c550bbd" | ![Video Player](<img width="617" height="358" alt="image" src="https://github.com/user-attachments/assets/a7199b9a-9f93-45dc-b040-5f6234239717" />


---

## 🧐 Apa itu iCinema? (Konsep Aplikasi)
iCinema bukan sekadar daftar film statis. Ini adalah ekosistem di mana:
- **Pengguna** dapat merasakan antarmuka yang dinamis dengan kartu film yang bisa berputar (flip) untuk melihat detail tanpa berpindah halaman.
- **Administrator** memiliki kendali penuh atas konten, mulai dari penambahan film, kategori (genre), hingga pengelolaan file video film secara langsung.

---

## ⚙️ Bagaimana Aplikasi ini Berjalan? (Mekanisme Teknis)

Aplikasi ini beroperasi dengan mengandalkan komunikasi antara tiga entitas utama:

### **1. Alur Data & API**
- Saat Admin menambahkan film, data teks (judul, deskripsi) dan data biner (poster, video) dikirim secara bersamaan menggunakan **Multipart Form Data**.
- **Backend (Express)** menerima file tersebut melalui middleware **Multer** dan secara otomatis meneruskannya ke **Cloudinary Storage**.
- Cloudinary memberikan respons berupa URL HTTPS permanen yang kemudian disimpan ke **MongoDB**.

### **2. State Management (Redux)**
- Frontend tidak langsung meminta data ke database. Ia berbicara kepada **Redux Store**. 
- Setiap perubahan data (tambah/hapus) akan memicu *action* yang memperbarui state global, sehingga UI berubah secara instan tanpa perlu memuat ulang seluruh halaman (Single Page Application).

### **3. Keamanan & Autentikasi**
- Setiap permintaan sensitif dilindungi oleh **JWT (JSON Web Token)**. 
- Sistem membedakan akses antara pengguna biasa (hanya melihat) dan Admin (bisa mengelola) melalui middleware **Role-Based Access Control (RBAC)** di sisi server.

---

## 🛠️ Bagaimana Aplikasi ini Dibuat? (Proses Pengembangan)

iCinema dikembangkan dengan metodologi pengembangan web modern:

### **Arsitektur Perangkat Lunak**
- **MERN Stack**: Dipilih karena efisiensi JavaScript di kedua sisi (Frontend & Backend).
- **Modular Design**: Kode dibagi menjadi komponen-komponen kecil yang dapat digunakan kembali (*reusable components*), memudahkan pemeliharaan jangka panjang.

### **Integrasi Pihak Ketiga**
- **Cloudinary API**: Digunakan untuk mengatasi masalah penyimpanan server lokal. Dengan Cloudinary, beban server berkurang karena aset gambar dan video di-host secara eksternal dengan optimasi otomatis.
- **GitHub Actions (CI/CD)**: Kami membangun alur kerja otomatis:
    - **Linting & Build**: Memastikan kode bersih sebelum di-deploy.
    - **Auto-Deploy**: Setiap perubahan pada branch `main` akan otomatis di-deploy ke **Azure App Service**.

### **Teknologi Utama:**
- **Frontend**: React.js, Redux, Redux-Thunk, Joi (Validation), Bootstrap.
- **Backend**: Node.js, Express, Mongoose, Multer, Bcrypt, JWT.
- **Database**: MongoDB Atlas.

---

## 🚀 Memulai (Setup Lokal)

1. **Clone & Install**:
   ```bash
   git clone https://github.com/ghofarialfan/iCinema.git
   npm install
   cd frontend && npm install
