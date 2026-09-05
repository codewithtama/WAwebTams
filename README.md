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

### 1. Menjalankan dalam Mode Development
Klik ganda file **`run-dev.bat`** atau jalankan perintah:
```bash
npm run dev
```

### 2. Membangun Binary Standalone (.exe)
Klik ganda file **`build-release.bat`** atau jalankan perintah:
```bash
npm run build
```
File executable mandiri (.exe) dan installer (.msi / setup.exe) akan otomatis dihasilkan di folder:
`src-tauri/target/release/WAwebTams.exe` atau `src-tauri/target/release/bundle/nsis/`

---

## ⌨️ Shortcut Berguna

- `F5` atau `Ctrl + R` : Memuat ulang halaman WhatsApp Web.
- `Alt + F4` atau `Tombol X` : Menyembunyikan aplikasi ke System Tray.

---

## 📂 Struktur Proyek

```
WAwebTams/
├── package.json              # Script NPM & Tauri CLI
├── run-dev.bat               # Launcher cepat mode development
├── build-release.bat         # Script kompilasi release standalone
├── ui/
│   └── index.html            # Fallback splash screen
└── src-tauri/
    ├── Cargo.toml            # Konfigurasi dependensi Rust
    ├── tauri.conf.json       # Konfigurasi window, tray, dan permissions
    ├── capabilities/
    │   └── default.json      # Konfigurasi capability Tauri v2
    ├── icons/                # Asset icon aplikasi & System Tray
    └── src/
        ├── main.rs           # Entry point Windows binary
        └── lib.rs            # Lifecycle window, System Tray, & Single Instance
```
