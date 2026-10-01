# CryptoDash

Dashboard cryptocurrency modern yang menampilkan data pasar crypto secara real-time.  
Dibangun menggunakan **React + Vite** dan memanfaatkan **CoinGecko API**.

Project ini cocok untuk portfolio karena menampilkan kemampuan:

- Mengambil & mengolah data dari API publik
- State management
- Routing
- Chart interaktif
- Penyimpanan data di browser (localStorage)
- UI responsive + dark/light mode

---

## Deskripsi Project

CryptoDash adalah aplikasi web untuk memantau pasar cryptocurrency.  
Pengguna dapat melihat daftar coin, statistik global pasar, coin yang sedang trending, detail harga beserta grafik, menyimpan watchlist, dan melacak portfolio pribadi.

Data yang ditampilkan **bukan data palsu**, melainkan data asli dari CoinGecko (harga, market cap, volume, dan perubahan 24 jam).

---

## Fitur Utama

### 1. Market Overview

- Daftar top cryptocurrency
- Harga real-time
- Perubahan harga 24 jam (hijau/merah)
- Market cap
- Pencarian coin
- Sorting (Market Cap / Price / 24h Change)
- Filter: All / Top Gainers / Top Losers
- Pagination

### 2. Global Market Stats

- Total Market Cap
- 24h Trading Volume
- BTC Dominance
- Jumlah Active Coins

### 3. Trending Coins

Menampilkan coin yang sedang ramai dibicarakan / dicari di CoinGecko.

### 4. Coin Detail

- Informasi lengkap coin
- Harga saat ini
- Chart harga interaktif (24H, 7D, 30D, 90D)
- Market Cap, Volume, Circulating Supply, All-Time High
- Tombol tambah/hapus Watchlist

### 5. Watchlist

- Menyimpan coin favorit
- Data tersimpan di localStorage (tidak hilang saat refresh)

### 6. Portfolio Tracker

- Menambahkan aset crypto yang dimiliki
- Menghitung total nilai portfolio secara otomatis
- Menggunakan harga real-time

### 7. Lainnya

- Currency switcher (USD / IDR)
- Dark Mode & Light Mode
- Tampilan responsive (desktop & mobile)

---

## Tech Stack

| Teknologi                  | Kegunaan                                            |
| -------------------------- | --------------------------------------------------- |
| React                      | Library UI                                          |
| Vite                       | Build tool                                          |
| React Router               | Navigasi antar halaman                              |
| Chart.js + react-chartjs-2 | Grafik harga                                        |
| CoinGecko API              | Sumber data pasar crypto                            |
| Context API                | Manajemen currency                                  |
| localStorage               | Menyimpan watchlist, portfolio, dan preferensi tema |

---

## Struktur Folder

```
crypto-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Loading.jsx
│   │   └── Skeleton.jsx
│   ├── context/
│   │   └── CurrencyContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CoinDetail.jsx
│   │   ├── Watchlist.jsx
│   │   └── Portfolio.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

---

## Cara Menjalankan

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan development server:

```bash
npm run dev
```

## Cara Build untuk Production

```bash
npm run build
npm run preview
```

## Cara Menggunakan Portfolio

Pada halaman Portfolio, masukkan Coin ID (bukan symbol).

Contoh Coin ID yang benar:

- bitcoin
- ethereum
- solana
- binancecoin
- dogecoin

## Catatan Penting

- API CoinGecko versi gratis memiliki rate limit.
  Jika muncul error "Failed to fetch", tunggu beberapa saat lalu klik tombol Refresh / Coba Lagi.
- Rate konversi IDR bersifat estimasi (bisa disesuaikan nanti dengan API kurs real).

## Pengembangan Selanjutnya (Ide)

- Compare 2–3 coin dalam satu chart
- Price alert
- Export portfolio ke CSV
- Integrasi kurs IDR real-time
- Skeleton loading yang lebih detail
