# ModsTams - Ultra-Light Desktop Client & Mod Suite

Aplikasi desktop wrapper ultra-ringan berbasis **Rust + Tauri v2** yang dirancang untuk menghemat konsumsi RAM secara drastis, dilengkapi paket **Fitur Eksklusif ModsTams** yang aman dan stabil.

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
| **🔔 Filter Chat Belum Dibaca (Unread Only)** | `Ctrl + Shift + U` | Saring hanya obrolan yang memiliki pesan belum dibaca dalam 1-klik (dilengkapi tombol pill mengambang). |
| **🖼️ Auto-Blur Media Saja (Sensor Foto/Video)** | `Ctrl + Shift + B` | Sensor khusus foto, video, stiker & avatar (hover untuk melihat), teks pesan tetap terbaca normal. |
| **👁️ Anti-Centang Biru (Ghost Read)** | `Ctrl + Shift + G` | Bebas baca chat tanpa memicu centang biru di HP pengirim (tetap centang abu-abu dua). |
| **👻 Ghost Typing (Sembunyikan Mengetik)** | `Ctrl + Shift + T` | Mencegah status *"Sedang mengetik..."* terkirim ke lawan bicara. |
| **🚫 Anti-Delete Messages & Log History** | *Otomatis* | Pesan yang ditarik tetap muncul di bubble chat dan dicatat ke tab **Log Pesan Ditarik** di Control Center. |
| **🔓 Anti View-Once (Bypass 1x Lihat)** | *Otomatis* | Media foto/video 1x lihat bisa dibuka berkali-kali dan langsung diunduh dengan tombol Simpan Media. |
| **📲 Direct Chat (Tanpa Simpan Nomor)** | `Ctrl + M` | Membuka modal cepat untuk langsung kirim pesan ke nomor baru tanpa simpan kontak. |
| **📥 Status / Story Saver** | *Otomatis* | Tombol mengambang **"Unduh Story Ini"** muncul saat menonton status teman. |
| **🎨 Multi-Theme & Accent Colors** | `Ctrl + Shift + O` | Pilihan tema *Emerald, Cyberpunk Neon, Midnight Sapphire, Sunset Crimson, dan Ultra Dark OLED*. |
| **🔒 App Lock & PIN Security** | `Ctrl + L` | Kunci layar aplikasi dengan PIN 4-digit custom saat laptop ditinggalkan. |
| **🎙️ Voice Note Super Speed & Booster** | *Otomatis* | Kontrol percepatan audio VN hingga 3.0x dan pengeras volume hingga +200%. |
| **💥 Text Repeater & Fancy Font** | *Di Control Center* | Gandakan pesan instan (*Boom Text*) dan ubah font teks menjadi aesthetic (*Bold, Italic, Monospace, Bubble*). |
| **🔕 Anti-Call Auto-Mute** | *Di Control Center* | Otomatis menolak / meredam panggilan masuk agar tidak mengganggu aktivitas. |
| **🛡️ Full Privacy Mode (Blur Chat)** | `Ctrl + B` | Mengaburkan semua teks chat & foto di layar sampai kursor mouse diarahkan (*hover*). |

---

## ⌨️ Daftar Lengkap Shortcut Keyboard

- `Ctrl + Shift + U` : Toggle **Filter Chat Belum Dibaca** (Unread Only).
- `Ctrl + Shift + B` : Toggle **Auto-Blur Media Saja** (Sensor foto & video).
- `Ctrl + Shift + G` : Toggle **Anti-Centang Biru / Ghost Read** (Sembunyikan status baca).
- `Ctrl + Shift + T` : Toggle **Ghost Typing** (Sembunyikan status sedang mengetik).
- `Ctrl + Shift + M` : Buka **ModsTams Control Center** (Panel Pengaturan Lengkap).
- `Ctrl + Shift + O` : Toggle **Ultra Dark OLED Mode** (Hitam pekat).
- `Ctrl + M` : Buka modal **Direct Chat** (Kirim pesan tanpa simpan nomor).
- `Ctrl + B` : Toggle **Full Privacy Mode** (Blur seluruh chat & media).
- `Ctrl + L` : **Kunci Aplikasi (App Lock PIN)** seketika.
- `F5` atau `Ctrl + R` : Memuat ulang halaman.
- `Tombol X` : Menyembunyikan aplikasi ke System Tray (standby di latar belakang).

---

## 🚀 Cara Menjalankan

### 1. Buka Langsung File Executable (Stand-Alone .EXE)

Cukup **klik ganda file `ModsTams.exe`** yang sudah ada di folder ini!
File biner ini sepenuhnya mandiri (standalone), portabel, dan tidak memerlukan Node.js atau compiler lagi.

### 2. Melalui Launcher Cepat

Klik ganda file **`start-app.bat`**.

### 3. Mode Development

Jalankan file **`run-dev.bat`** atau perintah:

```bash
npm run dev
```

