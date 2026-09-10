/** @jest-environment jsdom */

describe("shared board viewport",()=>{
  beforeEach(()=>{
    jest.resetModules();
    document.body.innerHTML='<main><div id="board" style="width:400px;aspect-ratio:1 / 1"></div></main>';
    require("./board-viewport.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  test("wraps an existing board without replacing it",()=>{
    const board=document.getElementById("board");
    const viewport=document.querySelector(".atlas-board-viewport");
    expect(viewport).not.toBeNull();
    expect(viewport.contains(board)).toBe(true);
    expect(board.classList.contains("atlas-zoom-target")).toBe(true);
    expect(document.querySelectorAll("#board")).toHaveLength(1);
  });

  test("zoom controls change visual scale and Fit restores 100 percent",()=>{
    const viewport=document.querySelector(".atlas-board-viewport");
    const controls=document.querySelector(".atlas-board-zoom-controls");
    controls.querySelector('[data-zoom="in"]').click();
    expect(viewport.querySelector(".atlas-board-stage").style.transform).toContain("scale(1.25)");
    expect(controls.querySelector(".atlas-board-zoom-readout").textContent).toBe("125%");
    controls.querySelector('[data-zoom="reset"]').click();
    expect(viewport.querySelector(".atlas-board-stage").style.transform).toContain("scale(1)");
    expect(controls.querySelector(".atlas-board-zoom-readout").textContent).toBe("100%");
  });

  test("initial hidden state is mirrored by the viewport",()=>{
    document.body.innerHTML='<div id="other" hidden style="aspect-ratio:9 / 10"></div>';
    window.ChessAtlasBoardViewport.init(document.getElementById("other"));
    expect(document.querySelector(".atlas-board-viewport").hidden).toBe(true);
    expect(document.querySelector(".atlas-board-zoom-controls").hidden).toBe(true);
  });
});