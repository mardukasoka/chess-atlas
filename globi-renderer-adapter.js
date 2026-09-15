"use strict";

/* Presentation-only adapter. The flat Atlas canvas remains authoritative for play. */
(function (root) {
  const GLOBI_MODULE_URL =
    "https://unpkg.com/globi-viewer@1.0.0/dist/globi.min.js";
  const EARTH_TEXTURE_URL =
    "https://cdn.jsdelivr.net/npm/three@0.183.2/examples/textures/planets/earth_atmos_2048.jpg";

  let componentPromise = null;

  function toLonLat([x, y], coordinateSpace) {
    return [
      (x / coordinateSpace.width) * 360 - 180,
      90 - (y / coordinateSpace.height) * 180
    ];
  }

  function closeRing(points) {
    if (!points.length) return points;
    const first = points[0];
    const last = points[points.length - 1];
    return first[0] === last[0] && first[1] === last[1]
      ? points
      : [...points, first];
  }

  function centreOf(points) {
    const sum = points.reduce(
      (total, [lon, lat]) => [total[0] + lon, total[1] + lat],
      [0, 0]
    );
    return [sum[0] / points.length, sum[1] / points.length];
  }

  function featureRegion(feature, coordinateSpace, cultural) {
    const ring = closeRing(
      feature.geometry.map(point => toLonLat(point, coordinateSpace))
    );
    return {
      id: feature.id,
      name: { en: feature.name },
      geojson: { type: "Polygon", coordinates: [ring] },
      capColor: cultural ? "rgba(151, 211, 255, 0.38)" : "rgba(255, 217, 107, 0.12)",
      sideColor: cultural ? "#9ed7ff" : "#ffd96b",
      altitude: cultural ? 0.008 : 0.003,
      sourceId: cultural ? `source-${feature.id}` : "atlas-geography"
    };
  }

  function physicalRegion(feature, coordinateSpace) {
    const ring = closeRing(
      feature.geometry.map(point => toLonLat(point, coordinateSpace))
    );
    return {
      id: feature.id,
      name: { en: feature.name },
      geojson: { type: "Polygon", coordinates: [ring] },
      capColor: "rgba(125, 155, 115, 0.88)",
      sideColor: "#5f7658",
      altitude: 0.001,
      sourceId: "atlas-geography"
    };
  }

  function cultureMarker(feature, coordinateSpace) {
    const points = feature.geometry.map(point => toLonLat(point, coordinateSpace));
    const [lon, lat] = centreOf(points);
    return {
      id: `marker-${feature.id}`,
      name: { en: feature.name },
      description: { en: feature.mapMeaning || "Archaeological evidence envelope." },
      lat,
      lon,
      alt: 0.012,
      visualType: "dot",
      color: "#9ed7ff",
      category: "historical-evidence",
      calloutMode: "click",
      sourceId: `source-${feature.id}`
    };
  }

  function liveMarker(feature) {
    return {
      id: `live-${feature.layerId}-${feature.id}`,
      name: { en: feature.label },
      description: { en: feature.description },
      lat: feature.lat,
      lon: feature.lon,
      alt: Math.max(0.006, (feature.altitudeM || 0) / 637100000),
      visualType: "dot",
      markerScale: feature.layerId === "earthquakes" ? 0.018 : 0.015,
      color: feature.color,
      category: `live-${feature.layerId}`,
      calloutMode: "click",
      pulse: true,
      timestamp: new Date(feature.timestamp).toISOString(),
      sourceId: feature.layerId === "earthquakes" ? "usgs-earthquakes" : "nasa-eonet-fires"
    };
  }

  function createScene({ coordinateSpace, physicalFeatures, navigationRegions, culturalFeatures, liveSnapshot }) {
    const cultures = Array.isArray(culturalFeatures) ? culturalFeatures : [];
    const liveFeatures = Array.isArray(liveSnapshot?.features) ? liveSnapshot.features : [];
    return {
      version: 1,
      locale: "en",
      projection: "globe",
      theme: "photo",
      planet: {
        id: "earth",
        textureUri: EARTH_TEXTURE_URL,
        lightingMode: "fixed",
        showBorders: true
      },
      camera: { lat: 20, lon: 15, zoom: 1 },
      viewerUi: {
        controlStyle: "icon",
        showBodySelector: false,
        showProjectionToggle: false,
        showLegendButton: true,
        showInspectButton: false,
        showFullscreenButton: true,
        showCompass: true,
        showScale: true
      },
      markers: [
        ...cultures.map(feature => cultureMarker(feature, coordinateSpace)),
        ...liveFeatures.map(liveMarker)
      ],
      paths: [],
      arcs: [],
      regions: [
        ...(physicalFeatures || []).map(feature =>
          physicalRegion(feature, coordinateSpace)
        ),
        ...(navigationRegions || []).map(feature =>
          featureRegion(feature, coordinateSpace, false)
        ),
        ...cultures.map(feature => featureRegion(feature, coordinateSpace, true))
      ],
      animations: [],
      filters: liveFeatures.length ? [{
        id: "gods-eye-layer",
        label: "God’s-Eye layer",
        options: [
          { value: "earthquakes", label: "Earthquakes", categories: ["live-earthquakes"] },
          { value: "fires", label: "Wildfires", categories: ["live-fires"] }
        ]
      }] : [],
      dataSources: [
        {
          id: "atlas-geography",
          name: "Chess Atlas geography",
          shortName: "Atlas",
          url: "data/earth-main-v0.1.json",
          license: "Atlas provenance",
          description: "Simplified navigation regions for the playable Atlas surface."
        },
        ...cultures.map(feature => ({
          id: `source-${feature.id}`,
          name: feature.sources?.[0]?.label || `${feature.name} evidence sources`,
          shortName: "Evidence",
          url: feature.sources?.[0]?.url || "culture.html",
          license: "See linked source",
          description: feature.mapMeaning || "Archaeological evidence envelope."
        })),
        ...(liveSnapshot?.sources || [])
      ]
    };
  }

  function loadComponent() {
    if (root.customElements?.get("globi-viewer")) return Promise.resolve();
    if (!componentPromise) {
      componentPromise = import(GLOBI_MODULE_URL).catch(error => {
        componentPromise = null;
        throw error;
      });
    }
    return componentPromise;
  }

  class AtlasGlobiRenderer {
    constructor({ viewport, geography, summary, onFeatureSelected }) {
      this.viewport = viewport;
      this.geography = geography;
      this.summary = summary;
      this.onFeatureSelected = onFeatureSelected;
      this.culturalFeatures = [];
      this.liveSnapshot = null;
      this.viewer = null;
      this.active = false;
      this.zoomLevel = 1;
    }

    async activate() {
      this.active = true;
      this.viewport.hidden = false;
      this.summary.textContent = "Loading the God’s-Eye globe…";
      try {
        await loadComponent();
        if (!this.active) return;
        if (!this.viewer) {
          this.viewer = document.createElement("globi-viewer");
          this.viewer.setAttribute("aria-label", "Interactive God’s-Eye globe");
          this.viewer.addEventListener("markerClick", event => {
            const featureId = event.detail?.id?.replace(/^marker-/, "");
            const feature = this.culturalFeatures.find(item => item.id === featureId);
            if (feature && this.onFeatureSelected) this.onFeatureSelected(feature);
          });
          this.viewport.replaceChildren(this.viewer);
        }
        this.render();
      } catch (error) {
        this.summary.textContent =
          "The presentation globe could not load. The playable flat map remains available.";
        throw error;
      }
    }

    deactivate() {
      this.active = false;
      this.viewport.hidden = true;
    }

    setCulturalFeatures(features) {
      this.culturalFeatures = Array.isArray(features) ? features : [];
      if (this.viewer) this.render();
    }

    setLiveSnapshot(snapshot) {
      this.liveSnapshot = snapshot || null;
      if (this.viewer) this.render();
    }

    render() {
      if (!this.viewer) return;
      this.viewer.setScene(createScene({
        coordinateSpace: this.geography.coordinateSpace,
        physicalFeatures: this.geography.physicalFeatures,
        navigationRegions: this.geography.navigationRegions,
        culturalFeatures: this.culturalFeatures,
        liveSnapshot: this.liveSnapshot
      }));
      this.summary.textContent = this.liveSnapshot
        ? `${this.liveSnapshot.features.length} present-day observations · updated ${new Date(this.liveSnapshot.fetchedAt).toLocaleTimeString()}.`
        : this.culturalFeatures.length
        ? "Globe presentation. Select an evidence marker to open its God’s-Eye record."
        : "Globe presentation. No cultural evidence layer is active at this date.";
    }

    resetWorld() {
      this.zoomLevel = 1;
      this.viewer?.flyTo({ lat: 0, lon: 0 }, { zoom: 1 });
    }

    zoomBy(delta) {
      this.zoomLevel = Math.max(0.3, Math.min(4, this.zoomLevel + delta));
      this.viewer?.globi?.zoom(this.zoomLevel);
    }

    focusSelection() {
      this.summary.textContent =
        "Select a cultural evidence marker on the globe to open its record.";
    }
  }

  root.AtlasGlobiAdapter = Object.freeze({
    GLOBI_MODULE_URL,
    EARTH_TEXTURE_URL,
    toLonLat,
    createScene,
    AtlasGlobiRenderer
  });
})(typeof window !== "undefined" ? window : globalThis);
