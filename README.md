# Kalkulin 2.0 — All-in-one Calculator PWA

Versi upgrade dari kalkulator DP, harga jual, diskon, dan kurs. Paket ini berisi aplikasi statis **tanpa framework, build step, database, atau biaya API wajib**.

## Fitur

- **31 kalkulator / 7 kategori:** Umum, Keuangan, Bisnis, Konversi, Waktu, Kesehatan, dan Percetakan.
- Mobile-first dengan bottom navigation, desktop sidebar, animasi halus, dark mode, pencarian langsung.
- Favorit, kalkulator terakhir digunakan, dan riwayat perhitungan disimpan di **localStorage perangkat ini**.
- Hasil dihitung langsung selama input berubah. Tombol salin, bagikan, dan simpan tersedia.
- PWA dengan `manifest.webmanifest`, `sw.js`, dan ikon siap install. Kalkulator offline setelah file shell pernah dimuat dan service worker aktif.
- Kurs dari Currency API, *memerlukan koneksi untuk angka terbaru*. Data kurs terakhir disimpan lokal dengan tanggal sumber, bukan dijadikan seolah-olah live.
- Tidak ada iklan, akun, pelacakan, atau backend dalam kode ini.

## Struktur paket

```text
Kalkulin/
├── index.html             # Halaman utama & PWA metadata
├── styles.css             # Design system, responsive, dark mode
├── app.js                 # Navigasi, state, UI, storage, FX, install
├── calculators.mjs        # Seluruh rumus murni dan registry kalkulator
├── manifest.webmanifest   # Metadata instalasi aplikasi
├── sw.js                  # Cache offline dan update versi
├── favicon.svg
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable-512.png
└── tests.mjs              # Pengujian logika (opsional)
```

## Cara pasang pada website lama

1. **Backup** website lama beserta asetnya.
2. Upload **seluruh isi folder `Kalkulin`**, jangan hanya `index.html`, ke folder web di cPanel / hosting / GitHub Pages / Vercel.
3. Pastikan URL dapat diakses lewat **HTTPS** (contoh `https://kalkulin.domainmu.com/`). Untuk pengembangan lokal, `localhost` bisa dipakai.
4. Kunjungi URL tersebut, cek dashboard dan beberapa kalkulator.
5. Android: buka di Chrome/Edge, tekan **Install App** atau menu browser → *Instal aplikasi / Tambahkan ke layar utama*.
6. iOS: buka di **Safari**, tekan **Share/Bagikan** → *Add to Home Screen / Tambahkan ke Layar Utama*.

> **Penting:** Membuka `index.html` langsung dari File Manager (`file://`) bukan cara untuk menguji instalasi PWA. Browser membutuhkan HTTPS atau localhost untuk service worker dan prompt instalasi. Tombol Install App menampilkan panduan jika prompt browser belum tersedia.

### Vercel (deployment paling sederhana)

- Impor repositori yang berisi seluruh folder ini sebagai **root** proyek, atau taruh isinya di root repositori.
- Gunakan preset **Other**, tanpa build command maupun output folder khusus.
- Deploy; Vercel memberikan alamat HTTPS otomatis.

### cPanel / shared hosting

- Ekstrak ZIP, lalu upload **isi folder** Kalkulin ke `public_html` atau subfolder tertentu.
- Pastikan `index.html`, `sw.js`, dan `manifest.webmanifest` berada pada directory yang sama dan `icons/` ikut terupload.
- Jika format `.webmanifest` tidak dikenali, atur MIME type `application/manifest+json` atau `application/json`.

## Menambah kalkulator baru

- Buka `calculators.mjs`, tambahkan satu objek konfigurasi baru ke array `CALCULATORS` menggunakan pola `simple({id,title,category,icon,summary,fields,compute})`.
- UI kartu, form input, hasil, pencarian, favorit, dan riwayat akan mengikutinya otomatis.
- Tambahkan pengujian rumus ke `tests.mjs`.
- **Naikkan `APP_VERSION` di `sw.js` setiap release** agar service worker membuang aset versi lama.

## Pengujian

Jika Node.js tersedia, jalankan:

```sh
node tests.mjs
```

Test mencakup seluruh 31 kalkulator, DP, diskon, markup vs margin, PPN simulasi, cicilan, N-up, konversi suhu, kalkulator ilmiah, dan kasus error.

## Batasan / catatan keamanan

- **Offline:** rumus dan tampilan bisa offline setelah shell aplikasi ter-cache. Nilai tukar terbaru memerlukan internet; data tersimpan diberi label sesuai tanggal sumbernya.
- **Riwayat:** tersimpan lokal di browser/perangkat. Data bisa hilang jika cache/data situs dibersihkan. Tidak ada sinkronisasi lintas perangkat.
- **Pajak:** persentase diisi manual; pajak sebenarnya bergantung pada ketentuan dan jenis transaksi yang berlaku.
- **Finansial/kesehatan:** rumus adalah simulasi atau estimasi dan bukan pengganti pertimbangan profesional.
- **Percetakan:** N-up adalah grid matematika, bukan nesting otomatis; belum memasukkan gripper, bleed, cutting mark, dan layout campuran.
- **Kurs:** endpoint pihak ketiga bisa berubah/kadang tidak tersedia; sistem menampilkan error atau cache berlabel, bukan angka buatan.

© Kalkulin 2.0
