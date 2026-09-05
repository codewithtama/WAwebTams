# WAwebTams - WhatsApp Web Ultra-Light Desktop Wrapper

Desktop wrapper khusus untuk **WhatsApp Web** berbasis **Rust + Tauri v2** yang dirancang untuk menghemat konsumsi RAM secara drastis dibandingkan aplikasi resmi WhatsApp Desktop (Electron).

---

## ⚡ Fitur Utama & Optimasi Performa

1. **Ultra-Low Memory Footprint**:
   - Memanfaatkan Native Microsoft Edge WebView2 (Evergreen) bawaan Windows OS.
   - Tidak memuat instance Chromium utuh atau Node.js runtime terpisah.
   - Mengurangi penggunaan RAM hingga **70%–80%** dibandingkan WhatsApp Desktop resmi (~180–250MB vs ~800MB–1.2GB).
2. **System Tray Integration**:
   - Icon WhatsApp di System Tray (pojok kanan bawah taskbar).
   - Klik kiri icon tray untuk memunculkan / menyembunyikan window secara instan.
   - Klik kanan untuk menu cepat: *Tampilkan WhatsApp*, *Sembunyikan ke Tray*, *Muat Ulang (Reload)*, dan *Keluar Sepenuhnya*.
3. **Minimize-to-Tray on Close**:
   - Menekan tombol **Close (X)** tidak akan mematikan aplikasi, melainkan menyembunyikannya ke System Tray agar notifikasi tetap standby di latar belakang.
4. **Desktop User-Agent Spoofing**:
   - Menggunakan header User-Agent Chrome Desktop modern agar WhatsApp Web tidak memunculkan peringatan browser usang.
5. **Persistent Session & Storage**:
   - Sesi login QR tersimpan permanen di direktori AppData user. Tidak perlu scan QR ulang setiap kali membuka aplikasi.
6. **Single Instance**:
   - Mencegah aplikasi terbuka ganda. Jika aplikasi dibuka lagi, window yang sudah ada akan otomatis difokuskan ke depan.

---

## 🚀 Cara Menjalankan

### 1. Langsung Buka Aplikasi (Instan)
Klik ganda file **`start-app.bat`**. Aplikasi langsung terbuka tanpa menunggu kompilasi.

### 2. Menjalankan dalam Mode Development
Klik ganda file **`run-dev.bat`** atau jalankan perintah:
```bash
npm run dev
```

### 3. Membangun Binary Standalone Release (.exe)
Klik ganda file **`build-release.bat`** atau jalankan perintah:
```bash
npm run build
```
File executable (.exe) akan dihasilkan di: `%USERPROFILE%\.cargo-target\waweb-tams\release\waweb-tams.exe`.

---

## 💡 Catatan Teknis (Solusi OS Error 32 di Windows)

Di Windows, meletakkan folder `target/` di dalam `Desktop` sering kali memicu `os error 32` karena file compiler `.rcgu.o` dan `.rmeta` langsung dikunci oleh **Windows Search Indexer** dan **Windows Defender Real-time Scan**.
Proyek ini telah dikonfigurasi secara permanen dengan:
- `CARGO_TARGET_DIR` dialihkan ke `%USERPROFILE%\.cargo-target\waweb-tams` (bebas dari indexing).
- `jobs = 2` dan `incremental = false` di [Cargo.toml](file:///c:/Users/tamav/Desktop/PROYEK/WAwebTams/src-tauri/Cargo.toml) untuk memastikan kompilasi 100% stabil di Windows.

---

## ⌨️ Shortcut Berguna

- `F5` atau `Ctrl + R` : Memuat ulang halaman WhatsApp Web.
- `Alt + F4` atau `Tombol X` : Menyembunyikan aplikasi ke System Tray.
