"use strict";

window.AtlasMapInput = class AtlasMapInput {
  constructor(element, camera, onChange, onTap) {
    this.element = element;
    this.camera = camera;
    this.onChange = onChange;
    this.onTap = onTap;
    this.pointers = new Map();
    this.gesture = null;

    element.addEventListener("pointerdown", event => this.pointerDown(event));
    element.addEventListener("pointermove", event => this.pointerMove(event));
    element.addEventListener("pointerup", event => this.pointerUp(event));
    element.addEventListener("pointercancel", event => this.pointerUp(event));
    element.addEventListener("wheel", event => this.wheel(event), { passive: false });
  }

  pointerDown(event) {
    event.preventDefault();
    try {
      this.element.setPointerCapture(event.pointerId);
    } catch (error) {
      // Some synthetic test environments do not expose active pointer capture.
    }
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      moved: false
    });

    if (this.pointers.size === 2) {
      const points = [...this.pointers.values()];
      this.gesture = {
        distance: distance(points[0], points[1]),
        midpoint: midpoint(points[0], points[1])
      };
    }
  }

  pointerMove(event) {
    const point = this.pointers.get(event.pointerId);
    if (!point) return;
    event.preventDefault();

    const previous = { x: point.x, y: point.y };
    point.x = event.clientX;
    point.y = event.clientY;
    if (Math.hypot(point.x - point.startX, point.y - point.startY) > 6) {
      point.moved = true;
    }

    if (this.pointers.size === 1 && !this.gesture) {
      this.camera.panBy(point.x - previous.x, point.y - previous.y);
      this.onChange();
      return;
    }

    if (this.pointers.size === 2) {
      const points = [...this.pointers.values()];
      const nextDistance = distance(points[0], points[1]);
      const nextMidpoint = midpoint(points[0], points[1]);
      if (this.gesture && this.gesture.distance > 0) {
        this.camera.zoomAt(
          nextMidpoint.x - this.element.getBoundingClientRect().left,
          nextMidpoint.y - this.element.getBoundingClientRect().top,
          nextDistance / this.gesture.distance
        );
        this.camera.panBy(
          nextMidpoint.x - this.gesture.midpoint.x,
          nextMidpoint.y - this.gesture.midpoint.y
        );
        this.gesture = {
          distance: nextDistance,
          midpoint: nextMidpoint
        };
        this.onChange();
      }
    }
  }

  pointerUp(event) {
    const point = this.pointers.get(event.pointerId);
    if (point && !point.moved && this.pointers.size === 1 && !this.gesture) {
      const rect = this.element.getBoundingClientRect();
      this.onTap(event.clientX - rect.left, event.clientY - rect.top);
    }
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) this.gesture = null;
  }

  wheel(event) {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    const factor = Math.exp(-event.deltaY * 0.0015);
    this.camera.zoomAt(
      event.clientX - rect.left,
      event.clientY - rect.top,
      factor
    );
    this.onChange();
  }
};

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}