"use strict";

(function () {
  const params = new URLSearchParams(location.search);
  const culture = AtlasCultureData.get(params.get("id"));
  const returnState = params.get("return") || "";
  const returnLink = document.getElementById("return-map");

  returnLink.href = returnState
    ? `index.html#${encodeURIComponent(returnState)}`
    : "index.html";

  if (!culture) {
    document.getElementById("culture-name").textContent = "Culture not found";
    document.getElementById("culture-summary").textContent =
      "Return to the Atlas map and select a cultural evidence region.";
    return;
  }

  document.title = `${culture.name} · Atlas`;
  document.getElementById("culture-name").textContent = culture.name;
  document.getElementById("culture-date").textContent = culture.dateLabel;
  document.getElementById("culture-summary").textContent = culture.summary;
  document.getElementById("culture-map-meaning").textContent = culture.mapMeaning;
  document.getElementById("culture-evidence").textContent = culture.evidenceType;
  document.getElementById("culture-confidence").textContent = culture.confidence;

  const sources = document.getElementById("culture-sources");
  culture.sources.forEach(source => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.label;
    item.appendChild(link);
    sources.appendChild(item);
  });
})();
