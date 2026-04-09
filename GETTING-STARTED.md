# Getting Started - Panduan Cepat RSPS ERD

Panduan step-by-step untuk membuat ERD module baru (misal Farmasi, Radiologi, Lab).

## 🚀 Quick Start: Tambah Module Baru (5 Menit)

### Scenario: Kita ingin tambah module "Farmasi" dengan 3 table: obat, penjualan, resep

#### Step 1: Buat 3 File Table JSON di `data/tables/`

**File 1: `data/tables/obat.json`**
```json
{
  "table": {
    "color": "#0099cc",
    "light": "#e6f3ff",
    "note": "Master data obat/farmasi",
    "cols": [
      { "n": "id_obat", "t": "int(11)", "pk": true, "note": "ID unik obat" },
      { "n": "nama_obat", "t": "varchar(100)", "note": "Nama obat" },
      { "n": "stok", "t": "int(11)", "note": "Jumlah stok" },
      { "n": "harga", "t": "decimal(10,2)", "note": "Harga per unit" }
    ]
  },
  "position": { "x": 20, "y": 20 },
  "relations": [
    ["penjualan", "id_obat", "obat", "id_obat", "n1"],
    ["resep", "id_obat", "obat", "id_obat", "n1"]
  ]
}
```

**File 2: `data/tables/penjualan.json`**
```json
{
  "table": {
    "color": "#009966",
    "light": "#e6fff2",
    "note": "Riwayat penjualan obat",
    "cols": [
      { "n": "id_jual", "t": "int(11)", "pk": true, "note": "ID penjualan" },
      { "n": "id_obat", "t": "int(11)", "fk": "obat", "note": "Referensi ke table obat" },
      { "n": "qty", "t": "int(11)", "note": "Quantity terjual" },
      { "n": "tgl_jual", "t": "date", "note": "Tanggal penjualan" }
    ]
  },
  "position": { "x": 280, "y": 20 },
  "relations": []
}
```

**File 3: `data/tables/resep.json`**
```json
{
  "table": {
    "color": "#9900cc",
    "light": "#f3e6ff",
    "note": "Resep/Prescriptions dari dokter",
    "cols": [
      { "n": "id_resep", "t": "int(11)", "pk": true, "note": "ID resep" },
      { "n": "id_obat", "t": "int(11)", "fk": "obat", "note": "Obat yang diresepkan" },
      { "n": "dosis", "t": "varchar(50)", "note": "Dosis pemberian" },
      { "n": "tgl_resep", "t": "date", "note": "Tanggal resep dibuat" }
    ]
  },
  "position": { "x": 20, "y": 180 },
  "relations": []
}
```

#### Step 2: Update Manifest untuk Farmasi

Edit `data/tables/farmasi-manifest.json`:
```json
{
  "tables": [
    "obat",
    "penjualan",
    "resep"
  ]
}
```

#### Step 3: Udah Selesai! ✨

Buka `farmasi.html` - ERD akan otomatis load ketiga table dengan relasi-nya!

---

## 📚 Penjelasan Struktur

### Individual Table JSON Format

Setiap file table (`nama_table.json`) memiliki 3 bagian utama:

```json
{
  "table": {
    "color": "#0099cc",              // Warna header card
    "light": "#e6f3ff",              // Warna background card
    "note": "Dokumentasi",           // (OPTIONAL) Catatan untuk table
    "cols": [
      {
        "n": "field_name",           // Nama field/kolom
        "t": "varchar(100)",         // Type data (SQL syntax)
        "pk": true,                  // (OPTIONAL) Primary key
        "fk": "tabel_referensi",     // (OPTIONAL) Foreign key reference
        "note": "Dokumentasi"        // (OPTIONAL) Catatan untuk kolom
      }
    ]
  },
  "position": {
    "x": 20,                         // X position di canvas (pixel)
    "y": 20                          // Y position di canvas (pixel)
  },
  "relations": [
    ["dari_table", "kolom1", "ke_table", "kolom2", "tipe_relasi"]
    // tipe_relasi: "n1" = many-to-one, "11" = one-to-one
  ]
}
```

### Manifest File Format

File manifest untuk setiap module (`[module]-manifest.json`):
```json
{
  "tables": [
    "obat",           // Nama file tanpa .json
    "penjualan",      // Urutan tidak penting, TABLES di-load dalam parallel
    "resep"
  ]
}
```

### Warna Rekomendasi untuk Berbagai Module

**Pendaftaran** → Biru (#185fa5, #e6f1fb)  
**Farmasi** → Hijau (#009966, #e6fff2)  
**Radiologi** → Ungu/Purple (#9900cc, #f3e6ff)  
**Lab** → Merah/Coral (#cc3300, #ffe6e0)  
**Reference** → Abu-abu (#666666, #f0f0f0)  

---

## 🎯 Best Practices

### 1. Naming Convention
```
✅ BAIK:
- nama_table.json (lowercase dengan underscore)
- tabel_perawatan.json
  
❌ BURUK:
- NamaTable.json (camelCase)
- tabel perawatan.json (space)
- TABEL_PERAWATAN.JSON (uppercase)
```

### 2. Struktur Kolom
```
✅ BAIK:
{
  "n": "id_pasien",
  "t": "int(11)",
  "pk": true,
  "note": "Primary key untuk identifikasi pasien"
}

❌ BURUK:
{
  "n": "id",           // Terlalu generic
  "t": "int",          // Size not specified
  "note": "ID pasien"  // Tidak informatif
}
```

### 3. Relasi Antar Table
```
✅ BAIK:
["penjualan", "id_obat", "obat", "id_obat", "n1"]
// Dari penjualan.id_obat ke obat.id_obat (many-to-one)

❌ BURUK:
["penjualan", "obat_id", "obat", "id", "n1"]
// Field names tidak konsisten dengan table definition
```

### 4. Dokumentasi
```
✅ BAIK:
{
  "n": "status_pembayaran",
  "t": "enum('lunas','cicilan','belum_bayar')",
  "note": "Status pembayaran: lunas (dibayar penuh), cicilan (pembayaran bertahap), belum_bayar (belum ada pembayaran)"
}

❌ BURUK:
{
  "n": "status",
  "t": "varchar(20)",
  "note": "status"
}
```

---

## 🔄 Workflow Menambah Table ke Module yang Sudah Ada

Contoh: Module Farmasi sudah ada dengan table "obat" & "penjualan", kita ingin tambah "resep".

### Step 1: Buat `data/tables/resep.json`
(Lihat contoh di atas)

### Step 2: Update `data/tables/farmasi-manifest.json`
```json
{
  "tables": [
    "obat",
    "penjualan",
    "resep"        // ← Tambah di sini
  ]
}
```

### Step 3: Done!
Reload `farmasi.html` - table baru langsung appear dengan relasi ke obat ✨

---

## 🔗 Reuse Table di Multiple Modules

Untuk table yang digunakan di beberapa module (misal `c_upm` di Pendaftaran dan Farmasi):

### Option 1: Add ke Multiple Manifests

```json
// data/tables/manifest.json (Pendaftaran)
{
  "tables": ["c_upm", "c_pst", ...]
}

// data/tables/farmasi-manifest.json (Farmasi)
{
  "tables": ["c_upm", ...]  // Reuse sama table!
}
```

File `data/tables/c_upm.json` hanya ada 1 copy, di-reference dari 2 module. Tidak ada duplikasi data! 🎯

---

## 🛠️ Advanced: Custom Colors dan Styling

### Mengubah Warna Table Card

Edit property `color` dan `light` di table JSON:

```json
{
  "table": {
    "color": "#cc0000",    // Warna header (header text akan white)
    "light": "#ffe6e6",    // Warna background card
    "cols": [...]
  }
}
```

**Tips Pemilihan Warna:**
- Header color: Gunakan warna yang cerah (tidak gelap)
- Light color: Gunakan warna pastel (HSL dengan L=95% lebih baik)
- Hindari contrast ratio < 4.5:1 untuk aksesibilitas

### Background Color Chart:
- Biru → Medical/General data (#185fa5, #e6f1fb)
- Hijau → Farmasi/Inventory (#009966, #e6fff2)
- Ungu → Lab/Tests (#9900cc, #f3e6ff)
- Merah → Critical/Alert (#cc3300, #ffe6e0)
- Abu-abu → Reference/Lookup (#666666, #f0f0f0)

---

## 📝 Contoh Lengkap: Module Radiologi

Mari kita buat module Radiologi dengan 3 table: pemeriksaan, hasil, alat.

### 1. Buat `data/tables/pemeriksaan.json`
```json
{
  "table": {
    "color": "#9900cc",
    "light": "#f3e6ff",
    "note": "Catatan permintaan pemeriksaan radiologi",
    "cols": [
      { "n": "id_pemeriksaan", "t": "int(11)", "pk": true, "note": "ID unik pemeriksaan" },
      { "n": "id_pasien", "t": "int(11)", "fk": "c_pst", "note": "Referensi ke patient" },
      { "n": "tipe_radiasi", "t": "enum('xray','ct','mri','ultrasound')", "note": "Tipe radiasi yang digunakan" },
      { "n": "area_scanI", "t": "varchar(100)", "note": "Area yang di-scan" },
      { "n": "tgl_pemeriksaan", "t": "datetime", "note": "Tanggal & waktu pemeriksaan" }
    ]
  },
  "position": { "x": 20, "y": 20 },
  "relations": [
    ["pemeriksaan", "id_pemeriksaan", "hasil", "id_pemeriksaan", "11"],
    ["pemeriksaan", "id_pemeriksaan", "alat", "id_pemeriksaan", "n1"]
  ]
}
```

### 2. Buat `data/tables/hasil.json`
```json
{
  "table": {
    "color": "#cc0099",
    "light": "#ffe6f3",
    "note": "Hasil radiologi dari pemeriksaan",
    "cols": [
      { "n": "id_hasil", "t": "int(11)", "pk": true, "note": "ID hasil" },
      { "n": "id_pemeriksaan", "t": "int(11)", "fk": "pemeriksaan", "note": "Referensi pemeriksaan" },
      { "n": "status_hasil", "t": "enum('normal','abnormal','pending')", "note": "Status hasil scan" },
      { "n": "deskripsi", "t": "text", "note": "Deskripsi hasil umum" }
    ]
  },
  "position": { "x": 280, "y": 20 },
  "relations": []
}
```

### 3. Buat `data/tables/alat.json`
```json
{
  "table": {
    "color": "#0066cc",
    "light": "#e6f2ff",
    "note": "Alat/equipment radiologi yang digunakan",
    "cols": [
      { "n": "id_alat", "t": "int(11)", "pk": true, "note": "ID alat" },
      { "n": "nama_alat", "t": "varchar(100)", "note": "Nama/model alat" },
      { "n": "status", "t": "enum('aktif','maintenance','rusak')", "note": "Status operasional" },
      { "n": "kapasitas", "t": "varchar(50)", "note": "Spesifikasi kapasitas" }
    ]
  },
  "position": { "x": 20, "y": 180 },
  "relations": []
}
```

### 4. Update `data/tables/radiologi-manifest.json`
```json
{
  "tables": [
    "pemeriksaan",
    "hasil",
    "alat"
  ]
}
```

### 5. Buka `radiologi.html` → ERD terbaru muncul! ✨

---

## 📖 Dokumentasi Lengkap

- **README.md** - Penjelasan architecture & technical details
- **NOTE-FEATURE-GUIDE.md** - Dokumentasi fitur notes/comments
- **GETTING-STARTED.md** - File ini, untuk quick start guide
- **relationship.txt** - Detail relasi database (legacy doc)

---

## ❓ FAQ

**Q: Apakah perlu restart server?**  
A: Tidak, browser akan auto-load manifest & table JSON baru saat refresh page.

**Q: Bisakah satu table digunakan di beberapa module?**  
A: Ya! Cukup tambahkan nama table ke multiple manifest files.

**Q: Bagaimana cara hide table tertentu?**  
A: Hapus nama table dari manifest file, table JSON bisa disimpan untuk di-reuse nanti.

**Q: Bisakah mengubah relasi setelah table dibuat?**  
A: Ya, edit array `relations` di table JSON dan reload page.

**Q: Urutan table di manifest penting?**  
A: Tidak, table di-load secara parallel. Urutan tidak mempengaruhi tampilan.

**Q: Apakah color harus hex (#)? Bisakah RGB?**  
A: Belum support RGB, hanya hex format (#RRGGBB).

---

Selamat! Anda sudah siap membuat ERD module sendiri! 🚀
