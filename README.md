# 🤖 L2 Support Chat AI

Aplikasi chat berbasis **AI** untuk membantu tim **L2 Technical Support** menjawab pertanyaan pengguna secara otomatis. Dibangun dengan **Next.js 14+** (App Router), **TypeScript**, **Tailwind CSS**, dan **Google Gemini AI** dengan dukungan **context caching** serta **enkripsi knowledge base** untuk keamanan data.
Author : NJR
Supported By L1 Multipurpose Team

---

## ✨ Fitur Utama

- **💬 Chat Interaktif** – Antarmuka chat yang responsif dengan dark mode, animasi fade-in, dan streaming respons real-time.
- **🧠 Knowledge Base Internal** – AI hanya menjawab berdasarkan knowledge base yang disediakan (format Markdown).
- **⚡ Context Caching** – Knowledge base dikirim sekali ke Gemini dan di-cache, menghemat token hingga 90% pada percakapan berikutnya.
- **🔐 Enkripsi Knowledge Base** – File knowledge base dienkripsi (AES-256-CBC) sebelum di-commit ke repository publik.
- **📱 Responsif** – Tampilan optimal di desktop maupun mobile.
- **⏱️ Thinking Time** – Menampilkan waktu yang dibutuhkan AI untuk berpikir.
- **📜 Riwayat Percakapan** – AI mengingat konteks percakapan sebelumnya (multi-turn chat).
- **🛡️ Keamanan** – Mendukung proteksi akses via Vercel Deployment Protection atau HTTP Basic Auth.

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|-----------|------------|
| **Next.js 14+** | Framework React dengan App Router |
| **TypeScript** | Pengetikan statis untuk kualitas kode |
| **Tailwind CSS** | Utility-first CSS framework |
| **Google Gemini AI** | Model bahasa untuk menjawab pertanyaan (Gemini 2.5 Flash) |
| **Context Caching** | Fitur Gemini untuk menghemat token input |
| **SSE (Server-Sent Events)** | Streaming respons AI secara real-time |
| **AES-256-CBC** | Enkripsi knowledge base |
| **Vercel** | Platform deployment (opsional) |

---

## 📋 Prasyarat

- **Node.js** versi 18 atau lebih baru
- **NPM** atau **Yarn**
- **Google AI Studio API Key** (dapat di [Google AI Studio](https://aistudio.google.com/))
- **Git** (untuk version control)

---

## 🚀 Instalasi & Setup Lokal

1. Clone Repository

```bash
git clone https://github.com/username-anda/l2-support-chat.git
cd l2-support-chat

2. Install Dependencies
npm install

3. buat file .env kemudian isi :
GOOGLE_API_KEY=......  # Gemini API key Anda
ENCRYPTION_KEY=......     # 64 karakter hex (32 byte) untuk enkripsi knowledge base

4. jalankan perintah ini pada terminal untuk mendapatkan ENCRYPTION_KEY

5. siapkan knowledge base berupa file .md yang disimpan dalam folder knowldege-base, ex :
    # FAQ 
    ## DASHBOARD 
    ### pembuatan akun baru 
    1. Masuk ke WEB
    2. pilih cabang yang akan di tambahkan user
    3. masuk menu Maintenance -> User
    4. tambahkan user pada menu tersebut

6. run command dibawah untuk membuat file knowledge terenkripsi
npm run encrypt

7. jalankan aplikasi
npm run dev
