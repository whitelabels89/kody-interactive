# Panduan Deployment ke GitHub dan Render

## Langkah 1: Setup GitHub Repository

### 1.1 Buat Repository Baru di GitHub
1. Kunjungi https://github.com
2. Klik tombol "New repository" (hijau)
3. Isi nama repository: `petualangan-kody`
4. Tambahkan deskripsi: "Platform edukasi interaktif untuk mengajarkan literasi digital kepada anak-anak"
5. Pilih "Public" (agar bisa di-deploy gratis di Render)
6. Jangan centang "Initialize with README" (karena sudah ada)
7. Klik "Create repository"

### 1.2 Upload Code ke GitHub
Di terminal/command prompt, jalankan perintah berikut:

```bash
# Inisialisasi git repository
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Petualangan Kody educational platform"

# Tambahkan remote repository (ganti 'yourusername' dengan username GitHub Anda)
git remote add origin https://github.com/yourusername/petualangan-kody.git

# Push ke GitHub
git push -u origin main
```

## Langkah 2: Deploy ke Render

### 2.1 Buat Akun Render
1. Kunjungi https://render.com
2. Klik "Get Started for Free"
3. Daftar menggunakan akun GitHub Anda

### 2.2 Deploy Web Service
1. Di dashboard Render, klik "New +"
2. Pilih "Web Service"
3. Connect repository GitHub Anda (`petualangan-kody`)
4. Isi konfigurasi:
   - **Name**: `petualangan-kody`
   - **Environment**: `Node`
   - **Region**: Pilih yang terdekat
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Pilih "Free"

### 2.3 Environment Variables (Opsional)
Jika diperlukan, tambahkan environment variables:
- `NODE_ENV`: `production`

### 2.4 Deploy
1. Klik "Create Web Service"
2. Render akan otomatis build dan deploy aplikasi
3. Proses akan memakan waktu 5-10 menit
4. Setelah selesai, Anda akan mendapat URL seperti: `https://petualangan-kody.onrender.com`

## Langkah 3: Custom Domain (Opsional)

Jika Anda memiliki domain sendiri:
1. Di Render dashboard, masuk ke service Anda
2. Klik tab "Settings"
3. Scroll ke "Custom Domains"
4. Tambahkan domain Anda
5. Update DNS records sesuai instruksi Render

## Update dan Maintenance

### Auto-Deploy
Setiap kali Anda push ke branch `main` di GitHub, Render akan otomatis deploy versi terbaru.

### Manual Deploy
Di Render dashboard, klik "Manual Deploy" jika diperlukan.

### Monitoring
- Cek logs di tab "Logs"
- Monitor metrics di tab "Metrics"

## Troubleshooting

### Build Gagal
- Cek logs untuk error messages
- Pastikan dependencies tersedia
- Verifikasi build command

### Runtime Error
- Cek environment variables
- Review aplikasi logs
- Pastikan port configuration benar

### Performance
- Upgrade ke paid plan untuk resources lebih
- Optimize bundle size
- Enable CDN jika diperlukan

## URL Hasil Deploy

Setelah berhasil deploy, aplikasi akan tersedia di:
- **Development**: http://localhost:5000
- **Production**: https://petualangan-kody.onrender.com (atau domain custom Anda)

## Fitur Render Free Tier

- 750 jam runtime per bulan
- Auto-sleep setelah 15 menit idle
- 0.5 CPU, 512MB RAM
- 500MB disk space
- Perfect untuk demo dan development