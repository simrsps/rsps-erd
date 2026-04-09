# RSPS ERD Viewer - Dokumentasi

## Struktur Proyek

```
.
├── index.html           # Halaman utama dengan tab navigation
├── pendaftaran.html     # ERD modul Pendaftaran (sudah lengkap)
├── farmasi.html         # ERD modul Farmasi (template)
├── radiologi.html       # ERD modul Radiologi (template)
├── lab.html             # ERD modul Lab (template)
├── shared.css           # Style umum untuk semua ERD
├── shared.js            # JavaScript umum untuk generate ERD
└── relationship.txt     # File dokumentasi relasi database
```

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
Setiap file kategori harus mendefinisikan:

```javascript
const TABLES = {
  table_name: {
    color: "#hexcolor",      // Warna header
    light: "#hexcolor",      // Warna background
    cols: [
      { n: "column_name", t: "type", pk: true },    // Primary Key
      { n: "column_name", t: "type", fk: true },    // Foreign Key
      { n: "column_name", t: "type" },              // Normal Column
    ]
  }
};

const POSITIONS = {
  table_name: { x: 20, y: 20 }    // Posisi X, Y di canvas
};

const RELATIONS = [
  ["from_table", "from_col", "to_table", "to_col", "n1"],  // N-1 relationship
  ["from_table", "from_col", "to_table", "to_col", "11"],   // 1-1 relationship
];
```

Kemudian panggil `initializeERD()` saat DOM ready:
```javascript
document.addEventListener("DOMContentLoaded", initializeERD);
```

## Cara Menambah Data ERD Baru

### Untuk modul yang belum ada data (farmasi, radiologi, lab):

1. Buka file `farmasi.html` (atau radiologi.html / lab.html)
2. Lengkapi objek `TABLES` dengan definisi tabel Anda
3. Lengkapi objek `POSITIONS` dengan posisi di canvas
4. Lengkapi array `RELATIONS` dengan relasi antar tabel
5. Save file

### Contoh Lengkap untuk Farmasi:

```javascript
const TABLES = {
  obat: {
    color: "#0099cc",
    light: "#e6f3ff",
    cols: [
      { n: "id_obat", t: "int(11)", pk: true },
      { n: "nama_obat", t: "varchar(100)" },
      { n: "stok", t: "int(11)" },
      { n: "harga", t: "decimal(10,2)" },
    ],
  },
  penjualan: {
    color: "#009966",
    light: "#e6fff2",
    cols: [
      { n: "id_jual", t: "int(11)", pk: true },
      { n: "id_obat", t: "int(11)", fk: "obat" },
      { n: "qty", t: "int(11)" },
      { n: "tgl_jual", t: "date" },
    ],
  },
};

const POSITIONS = {
  obat: { x: 20, y: 20 },
  penjualan: { x: 280, y: 20 },
};

const RELATIONS = [
  ["penjualan", "id_obat", "obat", "id_obat", "n1"],
];
```

## Features

✅ **Drag & Drop** - Drag table cards ke posisi lain  
✅ **Relationship Visualization** - Kurva bezier dengan crow's foot notation  
✅ **N-1 dan 1-1 Relationships** - Garis dashed untuk N-1, solid untuk 1-1  
✅ **Interactive** - Click header untuk highlight table & related relationships  
✅ **Data Legend** - Legenda untuk PK, FK, dan relationship types  
✅ **Responsive** - SVG markers yang scalable untuk semua ukuran  
✅ **Reusable** - Style dan logic shared di semua module  

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
