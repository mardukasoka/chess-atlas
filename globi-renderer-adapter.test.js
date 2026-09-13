"use strict";

require("./globi-renderer-adapter.js");

const Adapter = globalThis.AtlasGlobiAdapter;

describe("Globi presentation adapter", () => {
  const coordinateSpace = { width: 2048, height: 1024 };

  test("converts the Atlas equirectangular corners and centre", () => {
    expect(Adapter.toLonLat([0, 0], coordinateSpace)).toEqual([-180, 90]);
    expect(Adapter.toLonLat([1024, 512], coordinateSpace)).toEqual([0, 0]);
    expect(Adapter.toLonLat([2048, 1024], coordinateSpace)).toEqual([180, -90]);
  });

  test("converts cultural evidence into closed GeoJSON regions", () => {
    const scene = Adapter.createScene({
      coordinateSpace,
      navigationRegions: [],
      culturalFeatures: [{
        id: "culture-test",
        slug: "test",
        name: "Test culture",
        mapMeaning: "Evidence envelope; not territory.",
        geometry: [[1024, 512], [1100, 512], [1100, 600]],
        sources: [{ label: "Test source", url: "https://example.com" }]
      }]
    });

    expect(scene.projection).toBe("globe");
    expect(scene.regions).toHaveLength(1);
    expect(scene.regions[0].geojson.type).toBe("Polygon");
    const ring = scene.regions[0].geojson.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(scene.markers[0].id).toBe("marker-culture-test");
  });

  test("does not turn physical land polygons into duplicate globe geometry", () => {
    const scene = Adapter.createScene({
      coordinateSpace,
      navigationRegions: [],
      culturalFeatures: [],
      physicalFeatures: [{ id: "land", geometry: [[0, 0], [1, 0], [1, 1]] }]
    });

    expect(scene.regions).toEqual([]);
  });

  test("renders and resets through the Globi component public API", () => {
    const summary = { textContent: "" };
    const renderer = new Adapter.AtlasGlobiRenderer({
      viewport: { hidden: true },
      geography: {
        coordinateSpace,
        navigationRegions: []
      },
      summary
    });
    renderer.viewer = {
      setScene: jest.fn(),
      flyTo: jest.fn()
    };

    renderer.render();
    renderer.resetWorld();

    expect(renderer.viewer.setScene).toHaveBeenCalledWith(
      expect.objectContaining({ projection: "globe" })
    );
    expect(renderer.viewer.flyTo).toHaveBeenCalledWith(
      { lat: 0, lon: 0 },
      { zoom: 1 }
    );
  });
});
