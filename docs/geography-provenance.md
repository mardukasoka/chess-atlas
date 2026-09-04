# Map v0.1 geography provenance

The physical land outline is derived from Natural Earth Vector
`ne_110m_land.geojson` at 1:110 million scale, source version `5.2.0-pre`,
retrieved from the
[Natural Earth Vector repository](https://github.com/nvkelso/natural-earth-vector)
at commit `ca96624a56bd078437bca8184e78163e5039ad19`.

Natural Earth vector data is public domain. The project recommends the credit
“Made with Natural Earth.”

For Map v0.1, the source geometry was transformed as follows:

- exterior land rings were retained; the Caspian Sea interior ring was omitted
  because the current renderer accepts one exterior ring per feature
- longitude/latitude coordinates were equirectangularly preprojected into the
  integer `2048 × 1024` Atlas `earth-main-v0.1` coordinate space
- adjacent duplicate integer points were removed
- Douglas–Peucker simplification used a tolerance of `1.5` Atlas coordinate
  units, below one screen pixel at the normal full-world display size
- polygons below 10 square Atlas coordinate units were removed while major
  islands and geographically useful world-scale features were retained

The published source supplied 127 land polygons and 5,091 exterior-ring
points. The Atlas derivative retains 120 physical land polygons and 3,097
points. The prior 89-point schematic fixture is preserved in
`data/earth-main-v0.1-schematic.json` for review and rollback.

The Atlas navigation regions in `data/earth-main-v0.1.json` are Atlas-owned
approximate navigation areas. They are not Natural Earth political boundaries,
historical borders, ownership claims, or simulation state. They exist only as
stable IDs for zoom, selection, and future cross-system navigation.

Map v0.1 contains no polity, controller, year, war, army, route, diplomacy, or
historical ownership data.