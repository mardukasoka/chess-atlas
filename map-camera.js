"use strict";

window.AtlasMapCamera = class AtlasMapCamera {
  constructor(worldBounds) {
    this.worldBounds = worldBounds;
    this.viewport = { width: 1, height: 1 };
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.minZoom = 0.18;
    this.maxZoom = 8;
  }

  setViewport(width, height) {
    this.viewport = { width, height };
    this.clamp();
  }

  reset() {
    const scale = Math.min(
      this.viewport.width / (this.worldBounds.maxX - this.worldBounds.minX),
      this.viewport.height / (this.worldBounds.maxY - this.worldBounds.minY)
    ) * 0.92;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, scale));
    this.x = (this.viewport.width -
      (this.worldBounds.maxX - this.worldBounds.minX) * this.zoom) / 2;
    this.y = (this.viewport.height -
      (this.worldBounds.maxY - this.worldBounds.minY) * this.zoom) / 2;
    this.clamp();
  }

  panBy(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.clamp();
  }

  zoomAt(screenX, screenY, factor) {
    const nextZoom = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, this.zoom * factor)
    );
    const worldX = (screenX - this.x) / this.zoom;
    const worldY = (screenY - this.y) / this.zoom;
    this.zoom = nextZoom;
    this.x = screenX - worldX * nextZoom;
    this.y = screenY - worldY * nextZoom;
    this.clamp();
  }

  focus(bounds) {
    const width = Math.max(1, bounds.maxX - bounds.minX);
    const height = Math.max(1, bounds.maxY - bounds.minY);
    this.zoom = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, Math.min(
        this.viewport.width / width,
        this.viewport.height / height
      ) * 0.7)
    );
    this.x = (this.viewport.width - width * this.zoom) / 2 -
      bounds.minX * this.zoom;
    this.y = (this.viewport.height - height * this.zoom) / 2 -
      bounds.minY * this.zoom;
    this.clamp();
  }

  worldToScreen([x, y]) {
    return [x * this.zoom + this.x, y * this.zoom + this.y];
  }

  screenToWorld(x, y) {
    return [(x - this.x) / this.zoom, (y - this.y) / this.zoom];
  }

  clamp() {
    const worldWidth = (this.worldBounds.maxX - this.worldBounds.minX) * this.zoom;
    const worldHeight = (this.worldBounds.maxY - this.worldBounds.minY) * this.zoom;
    const margin = 35;
    this.x = Math.min(
      this.viewport.width - margin,
      Math.max(margin - worldWidth, this.x)
    );
    this.y = Math.min(
      this.viewport.height - margin,
      Math.max(margin - worldHeight, this.y)
    );
  }
};