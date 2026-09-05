"use strict";

window.AtlasMapCamera = class AtlasMapCamera {
  constructor(worldBounds) {
    this.worldBounds = worldBounds;
    this.viewport = { width: 1, height: 1 };
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.minZoom = 1;
    this.maxZoom = 8;
  }

  setViewport(width, height) {
    this.viewport = { width, height };
    this.minZoom = this.getFitZoom();
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    this.clamp();
  }

  reset() {
    this.minZoom = this.getFitZoom();
    this.zoom = Math.min(this.maxZoom, this.minZoom);
    this.centerWorld();
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
    this.minZoom = this.getFitZoom();
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    this.x = this.clampAxis(
      this.x,
      this.worldBounds.minX,
      this.worldBounds.maxX,
      this.viewport.width
    );
    this.y = this.clampAxis(
      this.y,
      this.worldBounds.minY,
      this.worldBounds.maxY,
      this.viewport.height
    );
  }

  getFitZoom() {
    const worldWidth = this.worldBounds.maxX - this.worldBounds.minX;
    const worldHeight = this.worldBounds.maxY - this.worldBounds.minY;
    return Math.min(
      this.viewport.width / worldWidth,
      this.viewport.height / worldHeight
    );
  }

  centerWorld() {
    const worldWidth = (this.worldBounds.maxX - this.worldBounds.minX) * this.zoom;
    const worldHeight = (this.worldBounds.maxY - this.worldBounds.minY) * this.zoom;
    this.x = (this.viewport.width - worldWidth) / 2 -
      this.worldBounds.minX * this.zoom;
    this.y = (this.viewport.height - worldHeight) / 2 -
      this.worldBounds.minY * this.zoom;
  }

  clampAxis(position, worldMin, worldMax, viewportSize) {
    const scaledMin = worldMin * this.zoom;
    const scaledMax = worldMax * this.zoom;
    const scaledSize = scaledMax - scaledMin;

    if (scaledSize <= viewportSize) {
      return (viewportSize - scaledSize) / 2 - scaledMin;
    }

    return Math.min(
      -scaledMin,
      Math.max(viewportSize - scaledMax, position)
    );
  }
};