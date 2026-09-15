"use strict";

/* Browser-safe present-day feeds adapted from Map3D's normalized live layer boundary. */
(function (root) {
  const CACHE_MS = 5 * 60 * 1000;
  const USGS_URL =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";
  const EONET_URL =
    "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=24";
  let cache = null;

  function earthquakeFeatures(payload) {
    return (payload.features || []).slice(0, 24).flatMap(item => {
      const coordinates = item.geometry?.coordinates;
      if (!coordinates || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return [];
      return [{
        id: item.id,
        layerId: "earthquakes",
        lon: coordinates[0],
        lat: coordinates[1],
        altitudeM: Number.isFinite(coordinates[2]) ? -coordinates[2] * 1000 : 0,
        timestamp: item.properties?.time || Date.now(),
        label: item.properties?.place || "Earthquake",
        description: `Magnitude ${item.properties?.mag ?? "unknown"} · observed by the USGS seismic network`,
        color: "#ffcf5a",
        sourceUrl: item.properties?.url || "https://earthquake.usgs.gov/"
      }];
    });
  }

  function latestPoint(geometries) {
    for (let index = geometries.length - 1; index >= 0; index -= 1) {
      const geometry = geometries[index];
      if (geometry.type === "Point" && Number.isFinite(geometry.coordinates?.[0]) && Number.isFinite(geometry.coordinates?.[1])) {
        return { lon: geometry.coordinates[0], lat: geometry.coordinates[1], date: geometry.date };
      }
    }
    return null;
  }

  function fireFeatures(payload) {
    return (payload.events || []).slice(0, 24).flatMap(event => {
      const point = latestPoint(event.geometry || []);
      if (!point) return [];
      return [{
        id: `eonet-${event.id}`,
        layerId: "fires",
        lon: point.lon,
        lat: point.lat,
        altitudeM: 0,
        timestamp: Date.parse(point.date || "") || Date.now(),
        label: event.title || "Open wildfire event",
        description: "Open wildfire event catalogued by NASA EONET",
        color: "#ff7043",
        sourceUrl: event.link || "https://eonet.gsfc.nasa.gov/"
      }];
    });
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Live source returned ${response.status}`);
    return response.json();
  }

  async function loadPresent() {
    const now = Date.now();
    if (cache && cache.expiresAt > now) return cache.snapshot;
    const results = await Promise.allSettled([fetchJson(USGS_URL), fetchJson(EONET_URL)]);
    const features = [];
    const errors = [];
    if (results[0].status === "fulfilled") features.push(...earthquakeFeatures(results[0].value));
    else errors.push("USGS earthquakes");
    if (results[1].status === "fulfilled") features.push(...fireFeatures(results[1].value));
    else errors.push("NASA EONET fires");
    if (features.length === 0 && errors.length === 2) throw new Error("Present-day feeds are unavailable");
    const snapshot = {
      fetchedAt: now,
      features,
      errors,
      sources: [
        { id: "usgs-earthquakes", name: "USGS Earthquake Hazards Program", shortName: "USGS", url: "https://earthquake.usgs.gov/", license: "USGS public data", description: "Observed seismic-network event solutions." },
        { id: "nasa-eonet-fires", name: "NASA EONET", shortName: "EONET", url: "https://eonet.gsfc.nasa.gov/", license: "NASA open data", description: "Catalogued open wildfire events." }
      ]
    };
    cache = { expiresAt: now + CACHE_MS, snapshot };
    return snapshot;
  }

  root.AtlasGodsEyeLive = Object.freeze({
    USGS_URL,
    EONET_URL,
    earthquakeFeatures,
    fireFeatures,
    loadPresent
  });
})(typeof window !== "undefined" ? window : globalThis);
