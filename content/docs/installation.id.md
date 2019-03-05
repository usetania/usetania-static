---
title: "Instalasi"
date: 2019-02-04T19:34:29+08:00
draft: false
type: "docs"
layout: "docs"
---

Perangkat lunak ini dibuat dengan menggunakan bahasa pemrograman [Go](https://golang.org). Artinya Anda akan mendapat binari yang bisa dijalankan langsung di mesin Anda. Anda **tidak butuh** perangkat lunak tambahan seperti MAMP, XAMPP, atau WAMP untuk menjalankan **Tania**, tapi Anda mungkin akan membutuhkan basis data MySQL jika Anda tidak ingin menggunakan SQLite *(basis data bawaan.)* 

Cara termudah untuk melakukan instalasi Tania adalah dengan menggunakan binari yang telah kami sediakan untuk Windows (x64) dan Linux (x64). Anda dapat mengunduhnya dari [halaman rilis GitHub](https://github.com/Tanibox/tania-core/releases/tag/1.5.1). Setelah proses unduh selesai, Anda dapat mengekstraksi dengan *unzip*, dan menjalankan Tania dari Windows Command Prompt/Powershell dengan menggunakan `.\tania-core.exe` atau dari terminal Linux dengan menggunakan `./tania-core`.

Jika OS Anda bukan Windows (x64) atau Linux (x64), maka Anda harus mengkompilasi Tania sendiri. Silakan ikuti instruksi di bawah ini.

### Persyaratan
- [Go](https://golang.org) 1.11.x 
- [NodeJS](https://nodejs.org/en/) 8 or 10

### Instruksi cara mengkompilasi

Kami asumsikan lingkungan Go Anda berada di `~/go`.

1. Pastikan Anda telah memasang `golang/dep` 
    - https://golang.github.io/dep/docs/installation.html
    - https://gist.github.com/subfuzion/12342599e26f5094e4e2d08e9d4ad50d
2. Kloning repositori dengan menggunakan `go get github.com/Tanibox/tania-core`
3. Pilih versi yang stabil dengan menggunakan `cd ~/go/src/github.com/Tanibox/tania-core && git checkout tags/1.5.1 -b v1.5.1`
4. Dari *root* proyek, panggil `dep ensure` untuk melakukan instalasi dependensi Go
    - Jika Anda menemukan masalah dengan `dep ensure`, Anda dapat menggunakan `go get` saja.
5. Buat sebuah file `conf.json` dengan menggunakan isi dari `conf.json.example` dan modifikasi dengan menggunakan nilai Anda sendiri.
6. Jalankan `npm install` untuk memasang seluruh dependensi Vue.js.
7. Untuk membangun Vue.js, jalankan `npm run dev` untuk lingkungan pengembangan atau `npm run prod` untuk lingkungan produksi.
8. Atur SQLite:
    - Sunting `SqlitePath` di `conf.json` menggunakan lokasi berkas Anda (contoh: /Users/user/Programs/sqlite/tania.db)
    - Buat sebuah berkas kosong dengan menggunakan nama yang sama dengan isi `SqlitePath` di `conf.json`.
9. Kompilasi kode sumber dengan menggunakan `go build`. Itu akan menghasilkan `tania-core.exe` (pada Windows) atau `tania-core` (pada Linux dan macOS.)
10. Jalankan program dari terminal dengan menggunakan `./tania-core`, atau dari Windows Command Prompt menggunakan `.\tania-core.exe`. 
11. Nama pengguna dan kata sandi bawaan adalah `tania / tania`.

### Mesin Basis Data

Tania menggunakan SQLite sebagai basis data bawaan. Anda boleh menggunakan MySQL dengan mengganti `sqlite` dengan `mysql` pada kolom `tania_persistence_engine` di `conf.json`.

```
{
  "tania_persistence_engine": "sqlite",
  "demo_mode": true,
  "upload_path_area": "uploads/areas",
  "upload_path_crop": "uploads/crops",
  "sqlite_path": "db/sqlite/tania.db",
  "mysql_host": "127.0.0.1",
  "mysql_port": "3306",
  "mysql_dbname": "tania",
  "mysql_user": "root",
  "mysql_password": "root",
  "redirect_uri": "http://localhost:8080/",
  "client_id": "f0ece679-3f53-463e-b624-73e83049d6ac"
}
```

### Jalankan Tes
- Gunakan `go test ./...` untuk menjalankan semua tes pada Go.
- Gunakan `npm run cypress:run` untuk menjalankan tes menyeluruh.