"use strict";

/*
 * Lightweight 4D -> 2D projection for the future-chess renderer.
 * Game coordinates remain [x, y, z, w]; projection is presentation only.
 */

function validate4D(coordinate) {
  if (!Array.isArray(coordinate) || coordinate.length !== 4 || coordinate.some(value => !Number.isFinite(value))) {
    throw new TypeError("Expected a finite [x,y,z,w] coordinate");
  }
  return coordinate;
}

function project4D(coordinate, options = {}) {
  const [x, y, z, w] = validate4D(coordinate);
  const cell = options.cell ?? 42;
  const zOffset = options.zOffset ?? 0.42;
  const wOffset = options.wOffset ?? 0.72;
  const originX = options.originX ?? 24;
  const originY = options.originY ?? 24;

  return Object.freeze({
    x: originX + cell * (x + z * zOffset + w * wOffset),
    y: originY + cell * (y + z * zOffset - w * wOffset)
  });
}

function coordinateId(coordinate) {
  return validate4D(coordinate).join(":");
}

function enumerateCells(dimensions = [4, 4, 2, 2]) {
  if (!Array.isArray(dimensions) || dimensions.length !== 4 || dimensions.some(size => !Number.isInteger(size) || size < 1)) {
    throw new RangeError("Tesseract dimensions must contain four positive integers");
  }

  const cells = [];
  for (let x = 0; x < dimensions[0]; x++) {
    for (let y = 0; y < dimensions[1]; y++) {
      for (let z = 0; z < dimensions[2]; z++) {
        for (let w = 0; w < dimensions[3]; w++) {
          cells.push([x, y, z, w]);
        }
      }
    }
  }
  return cells;
}

function adjacent4D(first, second) {
  validate4D(first);
  validate4D(second);
  let changed = 0;
  for (let axis = 0; axis < 4; axis++) {
    const delta = Math.abs(first[axis] - second[axis]);
    if (delta > 1) return false;
    if (delta === 1) changed++;
    if (delta !== 0 && delta !== 1) return false;
  }
  return changed === 1;
}

function edgePairs(dimensions = [4, 4, 2, 2]) {
  const cells = enumerateCells(dimensions);
  const edges = [];
  for (let index = 0; index < cells.length; index++) {
    for (let next = index + 1; next < cells.length; next++) {
      if (adjacent4D(cells[index], cells[next])) {
        edges.push([cells[index], cells[next]]);
      }
    }
  }
  return edges;
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function render(svg, options = {}) {
  if (!svg || typeof svg.replaceChildren !== "function") {
    throw new TypeError("render requires an SVG element");
  }

  const dimensions = options.dimensions ?? [4, 4, 2, 2];
  const occupancy = options.occupancy;
  const selected = options.selected ?? null;
  const legal = new Set((options.legal ?? []).map(coordinateId));
  const onCell = typeof options.onCell === "function" ? options.onCell : null;
  const cells = enumerateCells(dimensions);
  const points = new Map(cells.map(cell => [coordinateId(cell), project4D(cell, options.projection)]));

  const width = options.width ?? 260;
  const height = options.height ?? 260;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "application");
  svg.setAttribute("aria-label", "Projected four-dimensional chess board");
  svg.replaceChildren();

  const edgeLayer = svgElement("g", { class: "tesseract-edges" });
  for (const [from, to] of edgePairs(dimensions)) {
    const a = points.get(coordinateId(from));
    const b = points.get(coordinateId(to));
    edgeLayer.appendChild(svgElement("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      "data-axis-edge": "true"
    }));
  }
  svg.appendChild(edgeLayer);

  const cellLayer = svgElement("g", { class: "tesseract-cells" });
  for (const coordinate of cells) {
    const id = coordinateId(coordinate);
    const point = points.get(id);
    const piece = occupancy && typeof occupancy.get === "function" ? occupancy.get(coordinate) : null;
    const group = svgElement("g", {
      class: [
        "tesseract-cell",
        selected && coordinateId(selected) === id ? "selected" : "",
        legal.has(id) ? "legal" : "",
        piece ? "occupied" : ""
      ].filter(Boolean).join(" "),
      transform: `translate(${point.x} ${point.y})`,
      tabindex: "0",
      role: "button",
      "aria-label": `${id}${piece ? ` ${piece.side}${piece.type}` : " empty"}`
    });

    group.appendChild(svgElement("circle", { r: piece ? 9 : 5 }));
    if (piece) {
      const text = svgElement("text", { x: 0, y: 3, "text-anchor": "middle" });
      text.textContent = String(piece.type ?? "?");
      group.appendChild(text);
    }

    if (onCell) {
      const activate = event => {
        event.preventDefault();
        onCell([...coordinate]);
      };
      group.addEventListener("click", activate);
      group.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") activate(event);
      });
    }
    cellLayer.appendChild(group);
  }
  svg.appendChild(cellLayer);
  return svg;
}

const TesseractRenderer = {
  project4D,
  coordinateId,
  enumerateCells,
  adjacent4D,
  edgePairs,
  render
};

if (typeof module !== "undefined" && module.exports) module.exports = TesseractRenderer;
if (typeof window !== "undefined") window.ChessAtlasTesseractRenderer = TesseractRenderer;
