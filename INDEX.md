# 📖 RSPS ERD Documentation Index

Panduan lengkap RSPS ERD Viewer system dengan semua dokumentasi.

---

## 🎯 Start Here - Pilih Path Anda

### 👶 **Saya baru pertama kali**
→ Baca [GETTING-STARTED.md](GETTING-STARTED.md)

Dokumentasi ini menjelaskan:
- Apa itu RSPS ERD Viewer
- Cara kerja modular JSON architecture
- Quick start: buat module Farmasi dalam 5 menit
- Contoh lengkap step-by-step

---

### 🛠️ **Saya ingin buat module baru** 
→ Gunakan [GETTING-STARTED.md](GETTING-STARTED.md) + [MODULE-CHECKLIST.md](MODULE-CHECKLIST.md)

GETTING-STARTED.md berisi:
- Architecture explanation
- Table JSON structure dengan contoh
- Step-by-step guide buat module baru
- Best practices & naming convention
- Contoh lengkap (Radiologi module)

MODULE-CHECKLIST.md berisi:
- Pre-development checklist
- Per-table creation checklist
- Manifest setup checklist
- HTML page creation (jika module baru)
- Testing checklist
- Deployment checklist
- Troubleshooting checklist

---

### 🐛 **Ada error / aplikasi tidak jalan**
→ Baca [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Dokumentasi ini mencakup:
- Critical issues (halaman blank, syntax error, dll)
- Warning issues (tables visible tapi arrows tidak, dll)
- Minor issues (colors wrong, performance slow, dll)
- Debugging tips & console commands
- Solution untuk setiap masalah

---

### 🏗️ **Saya developer yang ingin pahami internals**
→ Baca [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md)

Dokumentasi ini menjelaskan:
- System architecture diagram
- Data flow dari page load sampai render
- Core objects (TABLES, POSITIONS, RELATIONS)
- Key functions di shared.js
- File structure & responsibilities
- Performance considerations
- Debugging tips
- Future enhancement ideas

---

### 📝 **Fitur dokumentasi & notes**
→ Baca [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md)

Dokumentasi ini menjelaskan:
- Feature: 📝 note icon ke table & kolom
- Cara add notes ke JSON
- Tooltip vs Modal behavior
- HTML content support
- Examples

---

### 📋 **File struktur & cara kerja umum**
→ Baca [README.md](README.md)

Dokumentasi ini berisi:
- File structure lengkap
- Data-driven architecture penjelasan
- Cara kerja (shared.css, shared.js, HTML pages)
- Table JSON format
- Manifest file format
- Feature list

---

## 📁 Dokumentasi Files Reference

### Untuk Pemula
| File | Purpose | Target Audience |
|------|---------|-----------------|
| [GETTING-STARTED.md](GETTING-STARTED.md) | Quick start guide + tutorial | Pemula, new developers |
| [README.md](README.md) | Overview & reference | Everyone |

### Untuk Development
| File | Purpose | Target Audience |
|------|---------|-----------------|
| [MODULE-CHECKLIST.md](MODULE-CHECKLIST.md) | Step-by-step checklist development | Developers creating modules |
| [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md) | Deep dive internals | Advanced developers |
| [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md) | Documentation feature details | Developers using notes |

### Untuk Troubleshooting
| File | Purpose | Target Audience |
|------|---------|-----------------|
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problem solving guide | Anyone with issues |

### Legacy
| File | Purpose | Status |
|------|---------|--------|
| [relationship.txt](relationship.txt) | Database relationship documentation | Legacy (informational) |

---

## 🚀 Common Tasks - Find Documentation Quickly

### Task: Membuat Module Farmasi
```
1. Read: GETTING-STARTED.md (section: "Contoh Lengkap")
2. Follow: MODULE-CHECKLIST.md (checklist semua)
3. Refer: README.md (section: "Individual Table JSON Structure")
4. If stuck: TROUBLESHOOTING.md (find your error)
```

### Task: Menambah Notes/Dokumentasi
```
1. Read: NOTE-FEATURE-GUIDE.md
2. Edit: Table JSON (add "note" property)
3. Test: Hover & click 📝 icon di browser
```

### Task: Debug "Blank Page"
```
1. Open: Browser console (F12)
2. Read: TROUBLESHOOTING.md (section: "Issue 1")
3. Follow: Step-by-step solutions
```

### Task: Upgrade Module Radiologi (Sudah Ada)
```
1. Read: GETTING-STARTED.md (section: "Workflow")
2. Add: New table JSON di data/tables/
3. Update: radiologi-manifest.json
4. Use: MODULE-CHECKLIST.md (untuk testing)
```

### Task: Understand How It Works
```
1. Read: README.md (architecture overview)
2. Deep dive: TECHNICAL-ARCHITECTURE.md
3. Refer: Code examples di dokumentasi
```

---

## 📊 Documentation Map

### Workflow Progression
```
Start
  ↓
[GETTING-STARTED.md]        ← Intro + quick start
  ├─ Ready to build?
  ├─ Yes → [MODULE-CHECKLIST.md]
  └─ Questions? → [README.md]
       ↓
  Create Module
       ↓
  Something wrong?
  Yes → [TROUBLESHOOTING.md]
  No → Continue
       ↓
  Finished ✓
       ↓
  Want to learn more?
  Yes → [TECHNICAL-ARCHITECTURE.md]
  No → Done!
```

### Decision Tree
```
What do you need?

├─ "Saya tidak tahu mulai dari mana"
│  → [GETTING-STARTED.md](GETTING-STARTED.md)
│
├─ "Saya ingin buat module baru"
│  → [MODULE-CHECKLIST.md](MODULE-CHECKLIST.md)
│  → [GETTING-STARTED.md](GETTING-STARTED.md)
│
├─ "Ada error / tidak jalan"
│  → [TROUBLESHOOTING.md](troubleshooting.md)
│
├─ "Saya ingin add notes/dokumentasi"
│  → [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md)
│
├─ "Saya ingin pahami technical"
│  → [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md)
│
└─ "Saya ingin reference struktur"
   → [README.md](README.md)
```

---

## 🔗 Cross-References

### GETTING-STARTED.md references:
- `→ JSON Format` → README.md (section: Individual Table JSON Structure)
- `→ Warna Recommendation` → Warna codes hardcoded, bisa custom
- `→ Best Practices` → Termasuk naming convention & structure
- `→ FAQ` → Common questions answered

### MODULE-CHECKLIST.md references:
- `→ Table JSON Template` → README.md (section: Individual Table JSON Structure)
- `→ Manifest Update` → README.md & GETTING-STARTED.md
- `→ HTML Creation` → Template included di checklist
- `→ Testing Checklist` → Browser compatibility tested
- `→ Common Issues` → TROUBLESHOOTING.md (section: Common Issues)

### TROUBLESHOOTING.md references:
- `→ JSON Error?` → GETTING-STARTED.md (Data Structure), README.md (JSON Format)
- `→ SVG Issue?` → TECHNICAL-ARCHITECTURE.md (drawArrows function)
- `→ Console Errors?` → TECHNICAL-ARCHITECTURE.md (Debugging Tips)
- `→ Network Issues?` → Check file paths di MODULE-CHECKLIST.md

### TECHNICAL-ARCHITECTURE.md references:
- `→ System Architecture` → README.md (Cara Kerja section)
- `→ Data Objects` → README.md (Individual Table JSON Structure)
- `→ Functions` → Code bisa dilihat di shared.js
- `→ Performance` → Related: TROUBLESHOOTING.md (Issue 11)

### README.md references:
- `→ Add Data Baru?` → GETTING-STARTED.md, MODULE-CHECKLIST.md
- `→ Features?` → NOTE-FEATURE-GUIDE.md
- `→ Technical?` → TECHNICAL-ARCHITECTURE.md

---

## 💡 Usage Patterns

### Pattern 1: "I'm a complete beginner"
```
Step 1: Read INDEX.md (file ini) - 5 min
Step 2: Read GETTING-STARTED.md (full) - 20 min
Step 3: Follow MODULE-CHECKLIST.md - 30 min
Step 4: Create your first module - 30 min
Total: ~1 hour 30 min
```

### Pattern 2: "I know basics, want to build"
```
Step 1: Review GETTING-STARTED.md (skim for recap) - 5 min
Step 2: Use MODULE-CHECKLIST.md (follow line-by-line) - 30 min
Step 3: Reference README.md untuk structure questions - 10 min
Step 4: Create module - 30 min
Total: ~1 hour 15 min
```

### Pattern 3: "Sesuatu error"
```
Step 1: Check console (F12)
Step 2: Find error type di TROUBLESHOOTING.md
Step 3: Follow solution step-by-step
```

### Pattern 4: "I want to understand everything"
```
Step 1: GETTING-STARTED.md (understand architecture)
Step 2: README.md (reference all structures)
Step 3: TECHNICAL-ARCHITECTURE.md (internals deep dive)
Step 4: Read shared.css & shared.js (implementation)
Total: 2-3 hours (thorough understanding)
```

---

## 📞 When Each Document Is Most Useful

| Scenario | Best Resource |
|----------|---------------|
| "Saya belum tahu mulai" | GETTING-STARTED.md |
| "Saya lupa syntax JSON table" | README.md + GETTING-STARTED.md |
| "Halaman blank, error apa?" | TROUBLESHOOTING.md |
| "Arrows tidak muncul" | TROUBLESHOOTING.md (Issue 5) |
| "Notes/📝 tidak kerja" | NOTE-FEATURE-GUIDE.md |
| "Bagaimana drawArrows() bekerja?" | TECHNICAL-ARCHITECTURE.md |
| "Saya ingin add new feature" | TECHNICAL-ARCHITECTURE.md |
| "Performance lambat" | TROUBLESHOOTING.md (Issue 11) + TECHNICAL-ARCHITECTURE.md (Performance) |
| "Saya stuck, perlu checklist" | MODULE-CHECKLIST.md |
| "File ini error di mana?" | TROUBLESHOOTING.md + JSONLint online validator |

---

## 🆘 If You're Stuck

### Tidak tahu mulai:
→ [GETTING-STARTED.md](GETTING-STARTED.md)

### Error message di console:
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md) (find error type)

### Ingin checklist step-by-step:
→ [MODULE-CHECKLIST.md](MODULE-CHECKLIST.md)

### Ingin pahami technical:
→ [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md)

### File structure / reference:
→ [README.md](README.md)

### Feature notes/documentation:
→ [NOTE-FEATURE-GUIDE.md](NOTE-FEATURE-GUIDE.md)

---

## 🎓 Learning Resources

### For Beginners:
1. Start: GETTING-STARTED.md (15 min read)
2. Practice: Create Farmasi module following checklist (30 min)
3. Experiment: Add custom notes (10 min)
4. Done! - Anda bisa create module

### For Intermediate:
1. Learn: MODULE-CHECKLIST.md + README.md (20 min)
2. Practice: Create Radiologi module (20 min)
3. Troubleshoot: Test error scenarios (10 min)
4. Master: Refer TECHNICAL-ARCHITECTURE.md for internals

### For Advanced:
1. Study: TECHNICAL-ARCHITECTURE.md (30 min)
2. Review: shared.js source code (30 min)
3. Enhance: Consider features dari "Future Enhancement Ideas"
4. Maintain: Keep documentation updated as you improve system

---

## 📝 Quick Command Reference

### JSON Validation:
```
https://jsonlint.com/
Paste JSON → Click Validate → See errors
```

### File Navigation:
```
Ctrl+F (in README/docs) → Find any keyword
```

### Browser Debug:
```
F12 → Open DevTools
Console tab → Paste commands for debugging
Network tab → Check file loads
```

### Test Module:
```
1. Edit table JSON
2. Ctrl+Shift+R → Hard refresh
3. Check console → No errors?
4. Check canvas → Tables visible?
5. If problem → TROUBLESHOOTING.md
```

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Now | Initial modular architecture complete |
| | | - 13 individual table JSONs created |
| | | - Manifest system implemented |
| | | - All 4 modules support manifest based loading |
| | | - Full documentation suite |

---

## 🚀 Next Steps

**If you're ready to start:**
→ Go to [GETTING-STARTED.md](GETTING-STARTED.md)

**If you want to understand before starting:**
→ Go to [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md)

**If you have questions:**
→ Go to [README.md](README.md) (FAQ section)

**If something is broken:**
→ Go to [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📚 All Documentation Files

1. **INDEX.md** (file ini) - Navigation guide
2. **GETTING-STARTED.md** - Quick start tutorial
3. **MODULE-CHECKLIST.md** - Development checklist
4. **README.md** - Technical reference
5. **TECHNICAL-ARCHITECTURE.md** - Architecture deep dive
6. **NOTE-FEATURE-GUIDE.md** - Notes feature guide
7. **TROUBLESHOOTING.md** - Problem solving guide

---

**Total Documentation: ~8000+ lines of guides, examples, and solutions**

Selamat membuat ERD system yang awesome! 🚀

Choose your path above dan mulai coding! 💻
