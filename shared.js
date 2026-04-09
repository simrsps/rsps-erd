// These variables should be defined in the page that uses this script:
// - TABLES: object with table definitions
// - POSITIONS: object with table positions
// - RELATIONS: array of relationships

let canvas,
  svg,
  cards = {},
  colEls = {},
  activeTable = null;

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

// Initialize the ERD viewer
function initializeERD() {
  canvas = document.getElementById("canvas");
  svg = document.getElementById("arrows");

  if (!canvas || !svg) {
    console.error("Canvas or SVG element not found");
    return;
  }

  Object.keys(TABLES).forEach(buildCard);
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
  const div = document.createElement("div");
  div.className = "table-card";
  div.id = "tbl-" + tname;
  const pos = POSITIONS[tname];
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
    noteIcon.addEventListener("mouseenter", (e) =>
      showTooltip(noteIcon, tbl.note),
    );
    noteIcon.addEventListener("mouseleave", hideTooltip);
    noteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      openNoteModal(tname, tbl.note);
    });
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
      colNoteIcon.addEventListener("mouseenter", (e) =>
        showTooltip(colNoteIcon, col.note),
      );
      colNoteIcon.addEventListener("mouseleave", hideTooltip);
      colNoteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        openNoteModal(`${tname}.${col.n}`, col.note);
      });
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
