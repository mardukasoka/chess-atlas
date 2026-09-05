"use strict";

window.AtlasMapRenderer = class AtlasMapRenderer {
  constructor({ viewport, geography, summary }) {
    this.viewport = viewport;
    this.geography = geography;
    this.summary = summary;
    this.canvas = viewport.querySelector(".world-map-canvas");
    this.hitCanvas = viewport.querySelector(".world-map-hit-canvas");
    this.context = this.canvas.getContext("2d");
    this.hitContext = this.hitCanvas.getContext("2d", { willReadFrequently: true });
    this.camera = new AtlasMapCamera({
      minX: 0,
      minY: 0,
      maxX: geography.coordinateSpace.width,
      maxY: geography.coordinateSpace.height
    });
    this.selectedId = null;
    this.dirty = false;
    this.hasViewport = false;
    this.dpr = 1;
    this.hitDpr = 1;
    this.input = new AtlasMapInput(
      this.canvas,
      this.camera,
      () => this.invalidate(),
      (x, y) => this.selectAt(x, y)
    );
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(viewport);
    this.resize();
    this.camera.reset();
    this.invalidate();
  }

  resize() {
    const rect = this.viewport.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.hitDpr = Math.min(this.dpr, 1);
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.hitCanvas.width = Math.round(rect.width * this.hitDpr);
    this.hitCanvas.height = Math.round(rect.height * this.hitDpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.hitCanvas.style.width = `${rect.width}px`;
    this.hitCanvas.style.height = `${rect.height}px`;
    this.camera.setViewport(rect.width, rect.height);
    if (!this.hasViewport) {
      this.camera.reset();
      this.hasViewport = true;
    }
    this.invalidate();
  }

  invalidate() {
    if (this.dirty) return;
    this.dirty = true;
    requestAnimationFrame(() => {
      this.dirty = false;
      this.render();
    });
  }

  render() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = "#0e2638";
    this.context.fillRect(0, 0, width, height);
    this.drawFeatures(this.context, false);
    this.drawFeatures(this.hitContext, true);
    this.drawHud();
  }

  drawFeatures(context, hitTest) {
    const scale = hitTest ? this.hitDpr : this.dpr;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    if (hitTest) context.fillStyle = "#000";

    this.geography.physicalFeatures.forEach((feature, index) => {
      this.drawPolygon(context, feature.geometry, hitTest
        ? hitColor(index + 1)
        : feature.id === this.selectedId ? "#e2b85c" : "#7d9b73");
    });

    this.geography.navigationRegions.forEach((feature, index) => {
      const color = hitTest
        ? hitColor(this.geography.physicalFeatures.length + index + 1)
        : feature.id === this.selectedId ? "rgba(255, 211, 91, .72)" : "rgba(255, 211, 91, .08)";
      this.drawPolygon(context, feature.geometry, color);
      if (!hitTest && this.camera.zoom > 1.05) {
        this.strokePolygon(context, feature.geometry, feature.id === this.selectedId ? "#ffe29a" : "rgba(255, 226, 154, .42)");
      }
    });

    if (hitTest) return;
    this.context.save();
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.context.font = "600 12px system-ui";
    this.context.fillStyle = "rgba(255,255,255,.72)";
    this.geography.navigationRegions.forEach(feature => {
      if (this.camera.zoom < 1.25) return;
      const bounds = this.geography.getBounds(feature.id);
      const [x, y] = this.camera.worldToScreen([
        (bounds.minX + bounds.maxX) / 2,
        (bounds.minY + bounds.maxY) / 2
      ]);
      this.context.fillText(feature.name, x - 30, y);
    });
    this.context.restore();
  }

  drawPolygon(context, points, fill) {
    context.beginPath();
    points.forEach(([x, y], index) => {
      const [screenX, screenY] = this.camera.worldToScreen([x, y]);
      if (index === 0) context.moveTo(screenX, screenY);
      else context.lineTo(screenX, screenY);
    });
    context.closePath();
    context.fillStyle = fill;
    context.fill();
  }

  strokePolygon(context, points, stroke) {
    context.beginPath();
    points.forEach(([x, y], index) => {
      const [screenX, screenY] = this.camera.worldToScreen([x, y]);
      if (index === 0) context.moveTo(screenX, screenY);
      else context.lineTo(screenX, screenY);
    });
    context.closePath();
    context.strokeStyle = stroke;
    context.lineWidth = 1 / this.camera.zoom;
    context.stroke();
  }

  drawHud() {
    const selected = this.geography.getFeature(this.selectedId);
    this.summary.textContent = selected
      ? `Selected region: ${selected.name}. Atlas ID: ${selected.id}.`
      : "No region selected. Tap a landmass or Atlas navigation region.";
  }

  selectAt(x, y) {
    const pixel = this.hitContext.getImageData(
      Math.round(x * this.hitDpr),
      Math.round(y * this.hitDpr),
      1,
      1
    ).data;
    const index = pixel[0] - 1;
    const features = [
      ...this.geography.physicalFeatures,
      ...this.geography.navigationRegions
    ];
    this.selectedId = features[index] ? features[index].id : null;
    this.invalidate();
  }

  resetWorld() {
    this.camera.reset();
    this.invalidate();
  }

  focusSelection() {
    const bounds = this.geography.getBounds(this.selectedId);
    if (!bounds) return;
    this.camera.focus(bounds);
    this.invalidate();
  }

  destroy() {
    this.resizeObserver.disconnect();
  }
};

function hitColor(index) {
  return `rgb(${index & 255},${(index >> 8) & 255},${(index >> 16) & 255})`;
}