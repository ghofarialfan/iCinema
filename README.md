<img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/10abc692-f828-4af4-a241-86c77a67ebf2" /># 🎬 iCinema: Modern Full-Stack Movie Management System

iCinema adalah platform manajemen katalog film berbasis web yang dirancang untuk memberikan pengalaman interaktif bagi pengguna dalam menjelajahi film, serta menyediakan alat kontrol yang kuat bagi administrator. Aplikasi ini mengintegrasikan teknologi cloud modern untuk menangani aset media secara efisien.

---

## 📸 Dokumentasi Visual

| Halaman Utama (Katalog) | Dashboard Admin (Manage Movie) |
| :---: | :---: |
| ![Main Page](<img width="1916" height="912" alt="image" src="https://github.com/user-attachments/assets/6929d050-fee0-4943-a6cf-9ac203410d67" /> | ![Admin Page](<img width="762" height="822" alt="image" src="https://github.com/user-attachments/assets/f6a17d81-c002-431e-be1c-83a6bea42498" />

| Interaksi Saat Memilih Film | Pemutar Video |
| :---: | :---: |
| ![Interaksi Saat Memilih Film](<img width="888" height="881" alt="image" src="https://github.com/user-attachments/assets/1f909072-dd9f-4b33-93d3-d5871c550bbd" /> | ![Video Player](<img width="617" height="358" alt="image" src="https://github.com/user-attachments/assets/a7199b9a-9f93-45dc-b040-5f6234239717" />


---

## ⚙️ Bagaimana Aplikasi ini Berjalan? (Deployment & Operasional)

iCinema menggunakan pipeline **CI/CD (Continuous Integration & Continuous Deployment)** otomatis untuk memastikan aplikasi selalu dalam kondisi stabil dan terbarui di server produksi.

### **Alur Deployment Otomatis**
Setiap kali pengembang melakukan `git push` ke branch `main`, GitHub Actions akan menjalankan serangkaian proses otomatis yang terbagi menjadi dua tahap utama:

#### **1. Tahap CI (Continuous Integration)**
Dikonfigurasi dalam [ci.yml](file:///d:/BARU/KULIAH/6/PSO/FP/iCinema/.github/workflows/ci.yml):
- **Build Frontend**: GitHub Runner menginstal dependensi Node.js dan menjalankan perintah `npm run build` pada folder frontend. Ini menghasilkan file statis yang dioptimalkan (HTML, CSS, JS).
- **Packaging**: File build frontend digabungkan dengan kode backend (controller, models, middleware, dll) ke dalam sebuah folder `deployment-package`.
- **Artifact Upload**: Folder tersebut diunggah sebagai **Artifact**. Ini adalah paket siap pakai yang menjamin kode yang di-deploy adalah kode yang sudah berhasil melalui tahap build.

#### **2. Tahap CD (Continuous Deployment)**
Dikonfigurasi dalam [cd.yml](file:///d:/BARU/KULIAH/6/PSO/FP/iCinema/.github/workflows/cd.yml):
- **Environment Setup**: GitHub Actions mengambil rahasia (Secrets) seperti `MONGODB_URL`, `JWT_SECRET`, dan kredensial `CLOUDINARY` untuk membuat file `.env` secara dinamis di server.
- **Deployment ke Azure**: Menggunakan **Azure WebApps Deploy**, paket artifact dikirim ke **Azure App Service**.
- **Startup**: Azure menjalankan `server.js`, menghubungkan ke database cloud, dan aplikasi iCinema langsung dapat diakses oleh pengguna melalui internet.

### **Integrasi Cloud Services**
Aplikasi ini berjalan dengan memanfaatkan ekosistem cloud yang saling terhubung:
- **Hosting**: Azure App Service (Platform-as-a-Service).
- **Database**: MongoDB Atlas (Database-as-a-Service).
- **Media Storage**: Cloudinary (Media Management-as-a-Service).
- **Automation**: GitHub Actions (Automation Server).

### **Keuntungan Alur Ini:**
- **Zero Downtime**: Proses deployment diatur sedemikian rupa agar aplikasi tetap bisa diakses selama update berlangsung.
- **Consistency**: Kode yang berjalan di komputer pengembang akan sama persis dengan yang berjalan di server Azure karena melalui proses build yang terstandarisasi.
- **Security**: Kredensial sensitif (API Keys, Database URL) tidak pernah disimpan dalam kode (hardcoded), melainkan dikelola dengan aman melalui **GitHub Secrets**.

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
