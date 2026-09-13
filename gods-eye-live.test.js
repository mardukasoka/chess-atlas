"use strict";

require("./gods-eye-live.js");

describe("present-day God's-Eye feed normalization", () => {
  test("normalizes USGS earthquake observations", () => {
    const features = AtlasGodsEyeLive.earthquakeFeatures({ features: [{
      id: "quake-1",
      geometry: { coordinates: [140.1, 35.2, 12] },
      properties: { mag: 5.4, place: "Test region", time: 123, url: "https://example.com/quake" }
    }] });
    expect(features[0]).toEqual(expect.objectContaining({
      id: "quake-1",
      layerId: "earthquakes",
      lon: 140.1,
      lat: 35.2,
      altitudeM: -12000
    }));
  });

  test("uses the latest point from an EONET wildfire event", () => {
    const features = AtlasGodsEyeLive.fireFeatures({ events: [{
      id: "fire-1",
      title: "Test fire",
      geometry: [
        { type: "Point", coordinates: [10, 20], date: "2026-01-01" },
        { type: "Point", coordinates: [12, 22], date: "2026-01-02" }
      ]
    }] });
    expect(features[0]).toEqual(expect.objectContaining({
      id: "eonet-fire-1",
      layerId: "fires",
      lon: 12,
      lat: 22
    }));
  });
});
