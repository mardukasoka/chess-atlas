"use strict";

window.AtlasGeography = (() => {
  async function load(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geography failed to load (${response.status})`);
    }

    const data = await response.json();
    validate(data);
    return new Geography(data);
  }

  function validate(data) {
    if (data.schemaVersion !== 1 || data.worldId !== "earth-main") {
      throw new Error("Unsupported Atlas geography schema");
    }

    const ids = new Set();
    [...data.physicalFeatures, ...data.navigationRegions].forEach(feature => {
      if (!feature.id || ids.has(feature.id)) {
        throw new Error(`Duplicate or missing geography ID: ${feature.id}`);
      }
      ids.add(feature.id);
      if (!Array.isArray(feature.geometry) || feature.geometry.length < 3) {
        throw new Error(`Invalid geometry for ${feature.id}`);
      }
    });
  }

  class Geography {
    constructor(data) {
      this.worldId = data.worldId;
      this.coordinateSpace = data.coordinateSpace;
      this.physicalFeatures = data.physicalFeatures;
      this.navigationRegions = data.navigationRegions;
      this.byId = new Map(
        [...this.physicalFeatures, ...this.navigationRegions]
          .map(feature => [feature.id, feature])
      );
    }

    getFeature(id) {
      return this.byId.get(id) || null;
    }

    getAllFeatures() {
      return [...this.physicalFeatures, ...this.navigationRegions];
    }

    getBounds(id) {
      const feature = this.getFeature(id);
      if (!feature) return null;
      return boundsOf(feature.geometry);
    }
  }

  function boundsOf(points) {
    return points.reduce((bounds, [x, y]) => ({
      minX: Math.min(bounds.minX, x),
      minY: Math.min(bounds.minY, y),
      maxX: Math.max(bounds.maxX, x),
      maxY: Math.max(bounds.maxY, y)
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });
  }

  return { load, boundsOf };
})();