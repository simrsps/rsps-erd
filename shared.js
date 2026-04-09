// These variables are initialized globally or optionally defined in halaman:
// - TABLES: object with table definitions (initialized in halaman)
// - POSITIONS: object with table positions (auto-created if undefined)
// - RELATIONS: array of relationships (auto-created if undefined)

let canvas,
  svg,
  cards = {},
  colEls = {},
  activeTable = null,
  POSITIONS = {},
  RELATIONS = [];

// Note helper functions
function truncateText(text, maxLength = 200) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function showTooltip(element, note) {
  if (!note) return;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = truncateText(note);

  document.body.appendChild(tooltip);

  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + "px";
  tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px";
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) tooltip.remove();
}

function openNoteModal(title, note) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal-popup";

  modal.innerHTML = `
    <div class="modal-header">
      <span>${title}</span>
      <button class="modal-close-btn" onclick="closeNoteModal()">✕</button>
    </div>
    <div class="modal-body">${note}</div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeNoteModal();
  });

  // Close on ESC key
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeNoteModal();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);
}

function closeNoteModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();
}

// Extract relations from table column FK definitions
function extractRelations() {
  RELATIONS = []; // Clear existing relations

  Object.keys(TABLES).forEach((tableName) => {
    const table = TABLES[tableName];
    if (!table.cols) return;

    table.cols.forEach((col) => {
      // Check if column has FK definition
      if (!col.fk) return; // Skip if no fk property

      // Handle fk as array or single object (backward compatibility)
      const fkList = Array.isArray(col.fk) ? col.fk : [col.fk];

      fkList.forEach((fk) => {
        // Validate FK structure
        if (!fk || !fk.table || !fk.column || !fk.cardinality) {
          console.warn(`Invalid FK structure in ${tableName}.${col.n}:`, fk);
          return; // Skip invalid FK
        }

        // Check if referenced table exists in loaded TABLES
        if (!TABLES[fk.table]) {
          console.debug(
            `FK target table '${fk.table}' not loaded, skipping relation in ${tableName}.${col.n}`,
          );
          return; // Skip relation to unloaded table
        }

        // Add relation: [fromTable, fromCol, toTable, toCol, cardinality]
        RELATIONS.push([tableName, col.n, fk.table, fk.column, fk.cardinality]);
      });
    });
  });
}

// Initialize the ERD viewer
function initializeERD() {
  canvas = document.getElementById("canvas");
  svg = document.getElementById("arrows");

  if (!canvas || !svg) {
    console.error("Canvas or SVG element not found");
    return;
  }

  // Extract relations from table definitions
  extractRelations();

  // Build cards with auto-positioning (wrapping) for undefined positions
  let lastX = 20; // Starting X position
  let lastY = 20; // Starting Y position
  const canvasWidth = canvas.parentElement?.offsetWidth || 1200; // Get page width
  const rowPadding = 20; // Padding between rows
  const estimatedCardWidth = 280; // Average card width estimate
  let rowMaxHeight = 0; // Track max height in current row

  Object.keys(TABLES).forEach((tname) => {
    try {
      const pos = POSITIONS[tname];
      // Check if position is valid (exists and has x, y properties)
      if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") {
        // Check if adding this card would overflow the row
        const wouldOverflow =
          lastX + estimatedCardWidth + rowPadding > canvasWidth && lastX > 20;

        if (wouldOverflow) {
          // Wrap to next row
          lastX = 20;
          lastY += rowMaxHeight + rowPadding;
          rowMaxHeight = 0;
        }

        // Position at current location
        POSITIONS[tname] = { x: lastX, y: lastY };
      }

      buildCard(tname);

      // Update position tracking based on actual card dimensions
      const card = cards[tname];
      if (card && card.offsetWidth > 0) {
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;

        // Track max height in this row
        rowMaxHeight = Math.max(rowMaxHeight, cardHeight);

        // Move lastX for next card
        lastX += cardWidth + rowPadding;
      }
    } catch (err) {
      console.error(`Error building card for table ${tname}:`, err);
      throw err;
    }
  });

  drawArrows();

  // Add ESC key listener to reset active table
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      resetActiveTable();
    }
  });
}

// Helper function to darken a hex color by percentage
function darkenColor(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = ((num >> 8) & 0x00ff) - amt;
  let B = (num & 0x0000ff) - amt;
  R = R < 0 ? 0 : R > 255 ? 255 : R;
  G = G < 0 ? 0 : G > 255 ? 255 : G;
  B = B < 0 ? 0 : B > 255 ? 255 : B;
  return (
    "#" +
    (
      0x1000000 +
      (R < 16 ? 0 : 1) * R * 0x10000 +
      (G < 16 ? 0 : 1) * G * 0x100 +
      (B < 16 ? 0 : 1) * B
    )
      .toString(16)
      .slice(1)
  );
}

function setActiveTable(tname) {
  if (activeTable === tname) return;

  // Reset previous active table
  if (activeTable) {
    const prevCard = cards[activeTable];
    if (prevCard) {
      const hdr = prevCard.querySelector(".table-header");
      const tbl = TABLES[activeTable];
      hdr.style.background = tbl.light;
      prevCard.classList.remove("active");
    }
  }

  activeTable = tname;
  const card = cards[tname];
  const tbl = TABLES[tname];
  const hdr = card.querySelector(".table-header");

  // Darken background by 20%
  const darkenedBg = darkenColor(tbl.light, 20);
  hdr.style.background = darkenedBg;

  // Add active class for shadow
  card.classList.add("active");

  // Redraw arrows to highlight related ones
  drawArrows();
}

function resetActiveTable() {
  if (!activeTable) return;

  const card = cards[activeTable];
  const tbl = TABLES[activeTable];
  const hdr = card.querySelector(".table-header");

  hdr.style.background = tbl.light;
  card.classList.remove("active");
  activeTable = null;

  drawArrows();
}

function buildCard(tname) {
  const tbl = TABLES[tname];
  if (!tbl || !tbl.cols) {
    console.error(`Table ${tname} is missing or has no cols property:`, tbl);
    throw new Error(`Invalid table structure for ${tname}`);
  }
  const div = document.createElement("div");
  div.className = "table-card";
  div.id = "tbl-" + tname;
  const pos = POSITIONS[tname] || { x: 0, y: 0 };
  div.style.left = pos.x + "px";
  div.style.top = pos.y + "px";

  const hdr = document.createElement("div");
  hdr.className = "table-header";
  hdr.style.background = tbl.light;
  hdr.style.color = tbl.color;
  hdr.style.borderBottom = "1.5px solid " + tbl.color + "55";

  // Add table name with note icon
  let headerHTML = `<span class="tname">${tname}</span>`;
  if (tbl.note) {
    headerHTML += `<span class="note-icon" title="View note">📝</span>`;
  }
  hdr.innerHTML = headerHTML;
  div.appendChild(hdr);

  // Add note icon click handler for table
  if (tbl.note) {
    const noteIcon = hdr.querySelector(".note-icon");
    if (!noteIcon) {
      console.warn(
        `Note icon not found in table header ${tname}, but tbl.note exists`,
      );
    } else {
      noteIcon.addEventListener("mouseenter", (e) =>
        showTooltip(noteIcon, tbl.note),
      );
      noteIcon.addEventListener("mouseleave", hideTooltip);
      noteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        openNoteModal(tname, tbl.note);
      });
    }
  }

  colEls[tname] = {};
  tbl.cols.forEach((col) => {
    const row = document.createElement("div");
    row.className = "col-row";
    row.id = `col-${tname}-${col.n}`;
    let badges = "";
    if (col.pk) badges += `<span class="badge pk">PK</span>`;
    if (col.fk) badges += `<span class="badge fk">FK</span>`;

    let noteIcon = "";
    if (col.note) {
      noteIcon = `<span class="note-icon" title="View note">📝</span>`;
    }

    row.innerHTML = `${badges}<span class="col-name">${col.n}</span>${noteIcon}<span class="col-type">${col.t}</span>`;

    // Add note icon click handler for column
    if (col.note) {
      const colNoteIcon = row.querySelector(".note-icon");
      if (!colNoteIcon) {
        console.warn(
          `Note icon not found in column ${tname}.${col.n}, but col.note exists`,
        );
      } else {
        colNoteIcon.addEventListener("mouseenter", (e) =>
          showTooltip(colNoteIcon, col.note),
        );
        colNoteIcon.addEventListener("mouseleave", hideTooltip);
        colNoteIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          openNoteModal(`${tname}.${col.n}`, col.note);
        });
      }
    }

    div.appendChild(row);
    colEls[tname][col.n] = row;
  });

  canvas.appendChild(div);
  cards[tname] = div;
  makeDraggable(div, hdr);

  // Add click listener to set active table
  div.addEventListener("click", (e) => {
    if (!e.target.closest(".table-header")) return;
    setActiveTable(tname);
  });
}

function makeDraggable(el, handle) {
  let ox = 0,
    oy = 0,
    mx = 0,
    my = 0,
    dragging = false;
  handle.addEventListener("mousedown", (e) => {
    const tname = el.id.replace("tbl-", "");
    setActiveTable(tname);
    dragging = true;
    mx = e.clientX;
    my = e.clientY;
    ox = parseInt(el.style.left) || 0;
    oy = parseInt(el.style.top) || 0;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - mx,
      dy = e.clientY - my;
    el.style.left = Math.max(0, ox + dx) + "px";
    el.style.top = Math.max(0, oy + dy) + "px";
    drawArrows();
  });
  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  // Touch
  handle.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;
      ox = parseInt(el.style.left) || 0;
      oy = parseInt(el.style.top) || 0;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - mx,
        dy = e.touches[0].clientY - my;
      el.style.left = Math.max(0, ox + dx) + "px";
      el.style.top = Math.max(0, oy + dy) + "px";
      drawArrows();
    },
    { passive: true },
  );
  document.addEventListener("touchend", () => {
    dragging = false;
  });
}

function getColCenter(tname, colName) {
  const card = cards[tname];
  const colEl = colEls[tname][colName];
  if (!card || !colEl) return null;
  const cRect = canvas.getBoundingClientRect();
  const elRect = colEl.getBoundingClientRect();
  const cardLeft = parseInt(card.style.left) || 0;
  const cardTop = parseInt(card.style.top) || 0;
  const cardW = card.offsetWidth;
  const rowOffTop = colEl.offsetTop + colEl.offsetHeight / 2;
  return {
    lx: cardLeft,
    rx: cardLeft + cardW,
    y: cardTop + rowOffTop,
    cardLeft,
    cardTop,
    cardW,
  };
}

function drawArrows() {
  while (svg.children.length > 1) svg.removeChild(svg.lastChild);
  // Update canvas svg size
  svg.setAttribute("width", canvas.scrollWidth);
  svg.setAttribute("height", canvas.scrollHeight);

  RELATIONS.forEach(([ft, fc, tt, tc, type]) => {
    const from = getColCenter(ft, fc);
    const to = getColCenter(tt, tc);
    if (!from || !to) return;

    const color = type === "11" ? "#3b6d11" : "#378add";
    const dash = type === "n1" ? "5,3" : "";

    // Check if this relationship is related to active table
    const isRelatedToActive =
      activeTable && (ft === activeTable || tt === activeTable);
    const strokeWidth = isRelatedToActive ? "3" : "1.5";
    const opacity = isRelatedToActive ? "1" : "0.75";

    // Determine cardinality markers
    let startMarkerType, endMarkerType;
    if (type === "n1") {
      // N on left side (from), 1 on right side (to)
      startMarkerType = "crowsfoot"; // many side
      endMarkerType = "one"; // one side
    } else {
      // type === "11"
      startMarkerType = "one";
      endMarkerType = "one";
    }

    const startMarkerColor = type === "11" ? "-green" : "-blue";
    const endMarkerColor = type === "11" ? "-green" : "-blue";
    const startMarkerId = startMarkerType + startMarkerColor;
    const endMarkerId = endMarkerType + endMarkerColor;

    // Pick exit/entry sides
    let x1, x2;
    if (from.rx < to.lx) {
      x1 = from.rx;
      x2 = to.lx;
    } else if (from.lx > to.rx) {
      x1 = from.lx;
      x2 = to.rx;
    } else {
      x1 = from.rx;
      x2 = to.rx;
    }

    const y1 = from.y,
      y2 = to.y;
    const mx1 = x1 + (x2 - x1) * 0.45,
      mx2 = x1 + (x2 - x1) * 0.55;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M${x1},${y1} C${mx1},${y1} ${mx2},${y2} ${x2},${y2}`,
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", strokeWidth);
    if (dash) path.setAttribute("stroke-dasharray", dash);
    path.setAttribute("marker-start", `url(#${startMarkerId})`);
    path.setAttribute("marker-end", `url(#${endMarkerId})`);
    path.setAttribute("opacity", opacity);
    svg.appendChild(path);

    // Label midpoint
    const lx = (x1 + x2) / 2,
      ly = (y1 + y2) / 2 - 6;
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("x", lx);
    label.setAttribute("y", ly);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "10");
    label.setAttribute("fill", color);
    label.setAttribute("font-family", "var(--font-sans)");
    label.textContent = type === "11" ? "1-1" : "N-1";
    svg.appendChild(label);
  });
}

// Initialize canvas with SVG marker definitions
function initCanvasMarkup() {
  const svg = document.getElementById("arrows");
  if (!svg || svg.querySelector("defs marker#crowsfoot-blue")) {
    return; // Already initialized or SVG not found
  }

  const defs =
    document.querySelector("#arrows defs") ||
    document.createElementNS("http://www.w3.org/2000/svg", "defs");

  // Marker definitions: crowsfoot and one-markers for N-1 and 1-1 relationships
  const markers = [
    {
      id: "crowsfoot-blue",
      stroke: "#378add",
      type: "crowsfoot",
    },
    {
      id: "crowsfoot-green",
      stroke: "#3b6d11",
      type: "crowsfoot",
    },
    {
      id: "one-blue",
      stroke: "#378add",
      type: "line",
    },
    {
      id: "one-green",
      stroke: "#3b6d11",
      type: "line",
    },
  ];

  markers.forEach((markerConfig) => {
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker",
    );
    marker.setAttribute("id", markerConfig.id);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto");

    if (markerConfig.type === "crowsfoot") {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", "M5 1L10 5L5 9 M10 5L0 5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", markerConfig.stroke);
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      marker.appendChild(path);
    } else if (markerConfig.type === "line") {
      // Double line (||) marker
      const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line1.setAttribute("x1", "2");
      line1.setAttribute("y1", "1");
      line1.setAttribute("x2", "2");
      line1.setAttribute("y2", "9");
      line1.setAttribute("stroke", markerConfig.stroke);
      line1.setAttribute("stroke-width", "1.5");

      const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line2.setAttribute("x1", "6");
      line2.setAttribute("y1", "1");
      line2.setAttribute("x2", "6");
      line2.setAttribute("y2", "9");
      line2.setAttribute("stroke", markerConfig.stroke);
      line2.setAttribute("stroke-width", "1.5");

      marker.appendChild(line1);
      marker.appendChild(line2);
    }

    defs.appendChild(marker);
  });

  if (!svg.querySelector("defs")) {
    svg.insertBefore(defs, svg.firstChild);
  }
}

// Initialize toolbar with legend
function initToolbar() {
  const toolbarEl = document.getElementById("toolbar");
  if (!toolbarEl || toolbarEl.querySelector(".legend")) {
    return; // Already initialized or toolbar not found
  }

  const toolbarHTML = `
    <span>🖱 Drag tabel untuk memindahkan</span>
    <div class="legend">
      <div class="leg-item">
        <span class="badge pk">PK</span><span>Primary Key</span>
      </div>
      <div class="leg-item">
        <span class="badge fk">FK</span><span>Foreign Key</span>
      </div>
      <div class="leg-item">
        <span style="display: inline-block; width: 24px; height: 2px; background: #378add; border-top: 2px dashed #378add;"></span>
        <span>N-1 (Dashed line)</span>
      </div>
      <div class="leg-item">
        <span style="display: inline-block; width: 24px; height: 2px; background: #639922;"></span>
        <span>1-1 (Solid line)</span>
      </div>
      <div class="leg-item">
        <svg style="display: inline-block; width: 20px; height: 14px; margin-right: 4px;" viewBox="0 0 20 14">
          <path d="M5 1L10 7L5 13 M10 7L0 7" fill="none" stroke="#378add" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span>Many (Crow's foot)</span>
      </div>
      <div class="leg-item">
        <svg style="display: inline-block; width: 20px; height: 14px; margin-right: 4px;" viewBox="0 0 20 14">
          <line x1="3" y1="1" x2="3" y2="13" stroke="#378add" stroke-width="1.5" />
          <line x1="7" y1="1" x2="7" y2="13" stroke="#378add" stroke-width="1.5" />
        </svg>
        <span>One (||)</span>
      </div>
    </div>
  `;

  toolbarEl.innerHTML = toolbarHTML;
}

// Load ERD module - unified loader for all halaman
function loadERDModule(moduleName, tablesToLoad) {
  // Initialize toolbar with legend
  initToolbar();

  // Initialize canvas markup (SVG markers)
  initCanvasMarkup();

  // Show placeholder if no tables defined
  if (!tablesToLoad || tablesToLoad.length === 0) {
    document.getElementById("canvas").innerHTML =
      `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#999; font-size:18px;">Modul ${moduleName} - Data ERD akan ditampilkan di sini</div>`;
    return;
  }

  // Ensure TABLES is initialized
  if (typeof TABLES === "undefined") window.TABLES = {};

  // Load and merge table data from individual JSON files
  Promise.all(
    tablesToLoad.map((tableName) =>
      fetch(`data/tables/${tableName}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to load ${tableName}.json: ${response.status} ${response.statusText}`,
            );
          }
          return response.json();
        })
        .then((data) => {
          if (!data.table) {
            throw new Error(
              `Invalid JSON structure in ${tableName}.json: missing 'table' property`,
            );
          }
          return {
            tableName,
            tableData: data.table,
          };
        })
        .catch((error) => {
          console.error(`Error loading ${tableName}.json:`, error);
          throw error; // Re-throw to catch in Promise.all
        }),
    ),
  )
    .then((results) => {
      // Merge all tables using spread operator
      results.forEach(({ tableName, tableData }) => {
        TABLES = { ...TABLES, ...tableData };
      });
      // Initialize ERD after all data is loaded
      initializeERD();
    })
    .catch((error) => {
      console.error("Error loading ERD data:", error.message || error);
      document.getElementById("canvas").innerHTML =
        `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#f00; font-size:12px; padding:20px; text-align:center;">Error loading ERD data<br><small>${error.message || error}</small></div>`;
    });
}
