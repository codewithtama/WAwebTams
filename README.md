# WAwebTams - WhatsApp Web Ultra-Light + MOD Suite

Desktop wrapper khusus untuk **WhatsApp Web** berbasis **Rust + Tauri v2** yang dirancang untuk menghemat konsumsi RAM secara drastis dibandingkan aplikasi resmi WhatsApp Desktop (Electron), dilengkapi paket **Fitur Eksklusif WA MOD** yang aman dari banned akun.

---

## ⚡ Fitur Utama & Optimasi Performa

1. **Ultra-Low Memory Footprint**:
   - Memanfaatkan Native Microsoft Edge WebView2 (Evergreen) bawaan Windows OS.
   - Tidak memuat instance Chromium utuh atau Node.js runtime terpisah.
   - Mengurangi penggunaan RAM hingga **70%–80%** dibandingkan WhatsApp Desktop resmi (~180–250MB vs ~800MB–1.2GB).
2. **System Tray Integration**:
   - Icon WhatsApp di System Tray (pojok kanan bawah taskbar).
   - Klik kiri icon tray untuk memunculkan / menyembunyikan window secara instan.
   - Klik kanan untuk menu cepat: akses semua fitur mod, reload, dan minimize.
3. **Minimize-to-Tray on Close**:
   - Menekan tombol **Close (X)** tidak mematikan aplikasi, melainkan menyembunyikannya ke System Tray agar notifikasi tetap standby di latar belakang.
4. **Persistent Session & Storage**:
   - Sesi login QR tersimpan permanen di direktori AppData user. Tidak perlu scan QR ulang setiap kali membuka aplikasi.
5. **Single Instance**:
   - Mencegah aplikasi terbuka ganda. Jika aplikasi dibuka lagi, window yang sudah ada akan otomatis difokuskan ke depan.

---

## 🚀 Fitur Eksklusif WA MOD Suite

Semua fitur ini bisa diakses langsung melalui **Tombol Mengambang `⚡ WA MOD` di pojok kanan atas layar**, klik kanan icon System Tray, maupun shortcut keyboard:

| Fitur MOD | Shortcut | Deskripsi |
| :--- | :--- | :--- |
| **🔓 Anti View-Once (Bypass 1x Lihat)** | *Otomatis* | Media foto/video "1x lihat" bisa dibuka berkali-kali dan muncul tombol **"Simpan Media"** untuk langsung mendownloadnya. Klik kanan juga diaktifkan. |
| **📲 Direct Chat (Tanpa Simpan Nomor)** | `Ctrl + M` | Membuka modal cepat untuk langsung memulai obrolan ke nomor mana pun (misal `08123456789`) tanpa perlu simpan kontak di HP. |
| **📥 Status / Story Saver** | *Otomatis* | Tombol mengambang **"Unduh Story Ini"** muncul saat menonton status foto/video teman untuk menyimpan ke laptop dengan 1 klik. |
| **👁️ Anti-Centang Biru (Ghost Read)** | `Ctrl + Shift + G` | Bebas buka dan baca chat tanpa memicu centang biru di HP pengirim (tetap centang abu-abu dua). |
| **👻 Ghost Typing (Sembunyikan Mengetik)** | `Ctrl + Shift + T` | Mencegah status *"Sedang mengetik..."* terkirim ke lawan bicara. Kamu bisa mengetik pesan dengan tenang tanpa ketahuan. |
| **🚫 Anti-Delete Messages (Anti-Tarik)** | *Otomatis* | Jika seseorang menarik pesan (*Delete for Everyone*), teks pesan asli tetap ditampilkan dengan tanda merah: `🚫 PESAN DITARIK PENGIRIM`. |
| **🖤 Ultra Dark OLED Mode (Hitam Pekat)** | `Ctrl + Shift + O` | Mengubah tema WhatsApp Web menjadi warna murni hitam pekat (`#000000`) untuk menghemat baterai layar laptop OLED dan nyaman di mata. |
| **🛡️ Privacy Mode (Anti-Intip / Blur)** | `Ctrl + B` | Mengaburkan semua teks chat & foto di layar sampai kursor mouse diarahkan (*hover*) ke atasnya. Aman dipakai di cafe/kantor. |
| **🔔 Notifikasi Download Berhasil** | *Otomatis* | Toast notification glassmorphic dengan nada chime halus setiap kali ada media/file yang berhasil diunduh. |

---

## ⌨️ Daftar Lengkap Shortcut Keyboard

- `Ctrl + M` : Buka modal **Direct Chat** (Kirim pesan tanpa simpan nomor).
- `Ctrl + Shift + G` : Toggle **Anti-Centang Biru / Ghost Read** (Sembunyikan status sudah dibaca).
- `Ctrl + B` : Toggle **Privacy Mode** (Anti-intip / Blur chat).
- `Ctrl + Shift + O` : Toggle **Ultra Dark OLED Mode** (Hitam pekat).
- `Ctrl + Shift + T` : Toggle **Ghost Typing** (Sembunyikan status sedang mengetik).
- `F5` atau `Ctrl + R` : Memuat ulang halaman WhatsApp Web.
- `Alt + F4` atau `Tombol X` : Menyembunyikan aplikasi ke System Tray.

---

## 🚀 Cara Menjalankan

### 1. Langsung Buka Aplikasi (Instan)

Cukup klik ganda file **`start-app.bat`**.

### 2. Mode Development

Jalankan file **`run-dev.bat`** atau perintah:

```bash
npm run dev
```

### 3. Kompilasi Binary Standalone (.exe)

Jalankan file **`build-release.bat`** atau perintah:

```bash
npm run build
```

File executable (.exe) akan dihasilkan di: `%USERPROFILE%\.cargo-target\waweb-tams\release\waweb-tams.exe`.

