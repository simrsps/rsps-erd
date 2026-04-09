# RSPS ERD Viewer - Dokumentasi

> **Dokumentasi Lengkap untuk RSPS ERD Visualization System**  
> Panduan step-by-step membuat & customize ERD module dengan JSON modular architecture

## 📚 Quick Navigation (Pilih Sesuai Kebutuhan)

| Kebutuhan | File Dokumentasi |
|-----------|------------------|
| **Baru pertama kali?** | [GETTING-STARTED.md](GETTING-STARTED.md) |
| **Ingin buat module baru?** | [GETTING-STARTED.md](GETTING-STARTED.md) + [MODULE-CHECKLIST.md](MODULE-CHECKLIST.md) |
| **Ada error/masalah?** | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| **Penjelasan architecture?** | [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md) + [README.md](README.md) |
| **Fitur dokumentasi/notes?** | [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md) |
| **File struktur & best practice?** | [README.md](README.md) |

---

## Struktur Proyek

```
.
├── index.html              # Halaman utama dengan tab navigation
├── pendaftaran.html        # ERD modul Pendaftaran
├── farmasi.html            # ERD modul Farmasi
├── radiologi.html          # ERD modul Radiologi
├── lab.html                # ERD modul Lab
├── shared.css              # Style umum untuk semua ERD
├── shared.js               # JavaScript umum untuk generate ERD
├── relationship.txt        # File dokumentasi relasi database
└── data/
    ├── pendaftaran-data.json    # (deprecated - gunakan modular approach)
    ├── farmasi-data.json        # (deprecated - gunakan modular approach)
    ├── radiologi-data.json      # (deprecated - gunakan modular approach)
    ├── lab-data.json            # (deprecated - gunakan modular approach)
    └── tables/                  # ⭐ Folder untuk modular table JSON
        ├── manifest.json           # List semua table dalam pendaftaran
        ├── farmasi-manifest.json   # List table farmasi (kosong)
        ├── radiologi-manifest.json # List table radiologi (kosong)
        ├── lab-manifest.json       # List table lab (kosong)
        ├── c_upm.json              # Individual table: c_upm
        ├── c_pst.json              # Individual table: c_pst
        ├── cm_reg__.json           # Individual table: cm_reg__
        ├── cm_j26__.json           # Individual table: cm_j26__
        ├── c_asr.json              # Individual table: c_asr
        ├── c_doc.json              # Individual table: c_doc
        ├── c_edu.json              # Individual table: c_edu
        ├── c_pkj.json              # Individual table: c_pkj
        ├── c_ref4.json             # Individual table: c_ref4
        ├── c_pst_af.json           # Individual table: c_pst_af
        ├── cm_sch__.json           # Individual table: cm_sch__
        ├── ref_relegions.json      # Individual table: ref_relegions
        └── ref_wilayah.json        # Individual table: ref_wilayah
```

## Data-Driven Architecture (Modular Approach)

Sejak update terbaru, semua data ERD disimpan dalam file JSON terpisah di folder `data/tables/`. Setiap table memiliki file JSON tersendiri yang bisa di-reuse:

✅ **Modular**: Setiap table adalah file JSON independen  
✅ **Reusable**: Bisa di-import ke berbagai halaman  
✅ **Maintainable**: Mudah update individual table  
✅ **Scalable**: Mudah add table baru tanpa modifikasi file utama  

## Cara Kerja

### 1. **shared.css** - Style yang Di-reuse
Berisi semua styling untuk:
- `.table-card` - Card untuk tabel
- `.col-row` - Row untuk kolom
- `.badge` - Badge untuk PK/FK
- `.toolbar` & `.legend` - Toolbar dan legenda

### 2. **shared.js** - JavaScript yang Di-reuse
Berisi semua fungsi umum:
- `initializeERD()` - Inisialisasi ERD viewer
- `darkenColor()` - Fungsi helper untuk darkening color
- `setActiveTable()` - Set tabel yang aktif
- `resetActiveTable()` - Reset tabel aktif
- `buildCard()` - Build table card
- `makeDraggable()` - Membuat card draggable
- `drawArrows()` - Draw relationship arrows

### 3. **Halaman Kategori** (pendaftaran.html, farmasi.html, dll)

Setiap halaman memuat data dari manifest dan individual table JSON files:

```javascript
// Manifest berisi list table untuk modul tersebut
fetch("data/tables/manifest.json")
  .then(r => r.json())
  .then(manifest => {
    // Load semua table JSON dalam parallel
    return Promise.all(
      manifest.tables.map(tableName =>
        fetch(`data/tables/${tableName}.json`)
          .then(r => r.json())
          .then(data => ({ tableName, data }))
      )
    );
  })
  .then(results => {
    // Spread/merge data menggunakan spread operator
    results.forEach(({ tableName, data }) => {
      TABLES[tableName] = data.table;           // Spread table definition
      POSITIONS[tableName] = data.position;     // Spread position
      RELATIONS.push(...data.relations);        // Spread relations array
    });
    initializeERD();
  });
```

### 4. **Individual Table JSON Structure** (data/tables/[table_name].json)

Setiap file table mengandung:

```json
{
  "table": {
    "color": "#185fa5",
    "light": "#e6f1fb",
    "note": "Dokumentasi tabel (opsional)",
    "cols": [
      { "n": "column_name", "t": "type", "pk": true, "note": "Column doc" },
      { "n": "column_name", "t": "type", "fk": "referenced_table", "note": null },
      { "n": "column_name", "t": "type", "note": null }
    ]
  },
  "position": { "x": 20, "y": 20 },
  "relations": [
    ["from_table", "from_col", "to_table", "to_col", "n1"],
    ["from_table", "from_col", "to_table", "to_col", "11"]
  ]
}
```

**Keuntungan struktur ini:**
- `table` → Definisi table yang bisa di-spread ke TABLES
- `position` → Posisi individual untuk canvas  
- `relations` → Array relasi yang melibatkan table ini, bisa di-push ke RELATIONS global
- Bisa di-import di halaman mana saja yang membutuhkannya

### 5. **Manifest File** (data/tables/[modul]-manifest.json)

Manifest berisi list table yang digunakan di setiap modul:

```json
{
  "tables": [
    "c_upm",
    "c_pst",
    "cm_reg__",
    "cm_j26__",
    "c_asr",
    "c_doc",
    "c_edu",
    "c_pkj",
    "c_ref4",
    "c_pst_af",
    "cm_sch__",
    "ref_relegions",
    "ref_wilayah"
  ]
}
```

## Cara Menambah Data ERD Baru

### Untuk menambah table baru ke modul Pendaftaran:

1. **Buat file JSON baru** di `data/tables/nama_table.json`:

```json
{
  "table": {
    "color": "#0099cc",
    "light": "#e6f3ff",
    "note": "Dokumentasi table (opsional)",
    "cols": [
      { "n": "id", "t": "int(11)", "pk": true, "note": "ID unik" },
      { "n": "nama", "t": "varchar(100)", "note": "Nama" },
      { "n": "nilai", "t": "decimal(10,2)", "note": null }
    ]
  },
  "position": { "x": 20, "y": 20 },
  "relations": [
    ["nama_table", "id", "other_table", "table_id", "n1"]
  ]
}
```

2. **Update manifest.json** - Tambahkan nama table ke array:

```json
{
  "tables": [
    "c_upm",
    "c_pst",
    "nama_table",  // Tambah di sini
    ...
  ]
}
```

3. **Selesai!** Halaman pendaftaran.html akan otomatis load table baru.

### Untuk modul yang berbeda (misal Farmasi):

1. **Buat file table JSON** di `data/tables/nama_table.json` (sama dengan di atas)

2. **Update farmasi-manifest.json** - Tambahkan table baru:

```json
{
  "tables": [
    "obat",
    "penjualan",
    "nama_table"  // Add here
  ]
}
```

3. **HTML dan manifest terpisah** - Memungkinkan Pendaftaran dan Farmasi memiliki set table berbeda

### Reuse Table di Multiple Modules:

Jika ingin menggunakan table yang sama (misal `c_asr` di beberapa modul):

```json
// pendaftaran-manifest.json
{
  "tables": ["c_asr", ...]
}

// farmasi-manifest.json  
{
  "tables": ["c_asr", ...]  // Reuse table yang sama
}
```

Table JSON di `data/tables/c_asr.json` akan di-load di kedua modul secara otomatis! 🎯

### Contoh Lengkap: Tambah Data Farmasi

**1. Buat `data/tables/obat.json`:**
```json
{
  "table": {
    "color": "#0099cc",
    "light": "#e6f3ff",
    "note": "Informasi obat/farmasi",
    "cols": [
      { "n": "id_obat", "t": "int(11)", "pk": true, "note": "ID Obat" },
      { "n": "nama_obat", "t": "varchar(100)", "note": "Nama obat" },
      { "n": "stok", "t": "int(11)", "note": "Stok tersedia" },
      { "n": "harga", "t": "decimal(10,2)", "note": "Harga per unit" }
    ]
  },
  "position": { "x": 20, "y": 20 },
  "relations": [
    ["penjualan", "id_obat", "obat", "id_obat", "n1"]
  ]
}
```

**2. Buat `data/tables/penjualan.json`:**
```json
{
  "table": {
    "color": "#009966",
    "light": "#e6fff2",
    "cols": [
      { "n": "id_jual", "t": "int(11)", "pk": true },
      { "n": "id_obat", "t": "int(11)", "fk": "obat" },
      { "n": "qty", "t": "int(11)" },
      { "n": "tgl_jual", "t": "date" }
    ]
  },
  "position": { "x": 280, "y": 20 },
  "relations": []
}
```

**3. Update `data/tables/farmasi-manifest.json`:**
```json
{
  "tables": [
    "obat",
    "penjualan"
  ]
}
```

**4. Done!** Kunjungi `farmasi.html` - ERD akan menampilkan kedua table dengan relasi otomatis ✨

## Features

✅ **Drag & Drop** - Drag table cards ke posisi lain  
✅ **Relationship Visualization** - Kurva bezier dengan crow's foot notation  
✅ **N-1 dan 1-1 Relationships** - Garis dashed untuk N-1, solid untuk 1-1  
✅ **Interactive** - Click header untuk highlight table & related relationships  
✅ **Data Legend** - Legenda untuk PK, FK, dan relationship types  
✅ **Responsive** - SVG markers yang scalable untuk semua ukuran  
✅ **Reusable** - Style dan logic shared di semua module  
✅ **Documentation Notes** - Tambahkan catatan dengan 📝 icon di tabel dan kolom  

## Documentation Notes Feature (NEW!)

Sistem ERD sekarang mendukung catatan (notes) untuk mendokumentasikan tabel dan kolom:

### Cara Menggunakan:

1. **Tambahkan Property `note` ke TABLES**:
```javascript
const TABLES = {
  c_upm: {
    color: "#185fa5",
    light: "#e6f1fb",
    note: "Unit/Departemen utama dalam sistem",  // ← Table-level note
    cols: [
      { n: "KODE", t: "varchar(2)", pk: true, note: "Kode unik 2 karakter" },
      { n: "UNIT", t: "varchar(200)", note: "Nama lengkap unit" },
    ]
  }
};
```

2. **Gunakan di Interface**:
   - Hover over 📝 icon → lihat tooltip (max 200 karakter)
   - Click 📝 icon → buka modal dengan konten penuh (HTML-supported)
   - ESC key / click outside → tutup modal

3. **Konten Note**:
   - Plain text: Teks biasa
   - HTML: Full HTML support (gunakan trusted content saja)

### Contoh dengan HTML:
```javascript
note: `<strong>Customer ID</strong><br/>
Primary key untuk identifikasi pelanggan/pasien.
<ul><li>Format: 8 digit</li><li>Range: 10000000-99999999</li></ul>`
```

Lihat [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md) untuk dokumentasi lengkap.

## Keyboard Shortcuts

- **ESC** - Reset active table dan highlight

## Browser Compatibility

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Development Notes

- Style/script umum di-centralize di `shared.css` dan `shared.js`
- Setiap halaman kategori hanya perlu define data (TABLES, POSITIONS, RELATIONS)
- Hindari duplikasi - gunakan file shared untuk semua fungsi umum
- Canvas sizing otomatis sesuai dengan SVG content
