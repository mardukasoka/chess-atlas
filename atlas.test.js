/**
 * @jest-environment jsdom
 */

const fs =
  require("fs");

const path =
  require("path");


const indexHtml =
  fs.readFileSync(
    path.join(
      __dirname,
      "index.html"
    ),
    "utf8"
  );

const bodyHtml =
  indexHtml.match(
    /<body[^>]*>([\s\S]*)<\/body>/i
  )[1];


function loadAtlas() {
  jest.resetModules();

  document.body.innerHTML =
    bodyHtml;

  localStorage.clear();

  window.AtlasGeography = {
    load: jest.fn(
      () => Promise.resolve({})
    )
  };

  window.AtlasMapRenderer =
    class {
      resetWorld() {}

      focusSelection() {}
    };

  window.ChessEngine =
    require("./engine.js");

  require("./stateGraph.js");
  require("./chess.js");
  require("./atlas.js");

  document.dispatchEvent(
    new Event(
      "DOMContentLoaded"
    )
  );
}


function moveToTimelineIndex(
  index
) {
  const timelineDown =
    document.getElementById(
      "timeline-down"
    );

  for (
    let step = 0;
    step < index;
    step += 1
  ) {
    timelineDown.click();
  }
}


describe(
  "Atlas historical game alignment",
  () => {
    const timelineCases = [
      {
        name: "2500 BCE",
        index: 7,
        value: "",
        visible: false
      },
      {
        name: "218 BCE",
        index: 6,
        value: "",
        visible: false
      },
      {
        name: "216 BCE",
        index: 5,
        value: "",
        visible: false
      },
      {
        name: "600 CE",
        index: 4,
        value: "chaturanga",
        visible: true
      },
      {
        name: "800 CE",
        index: 3,
        value: "shatranj",
        visible: true
      },
      {
        name: "1500 CE",
        index: 2,
        value: "modern",
        visible: true
      }
    ];


    test.each(
      timelineCases
    )(
      "$name maps to its historical chess state",
      ({
        index,
        value,
        visible
      }) => {
        loadAtlas();
        moveToTimelineIndex(index);

        const select =
          document.getElementById(
            "game-variant"
          );

        const board =
          document.getElementById(
            "board"
          );

        const context =
          document.getElementById(
            "game-variant-context"
          );

        expect(
          select.value
        ).toBe(value);

        expect(
          board.hidden
        ).toBe(!visible);

        if (visible) {
          expect(
            context.textContent
          ).toContain(
            "Timeline default"
          );
        } else {
          expect(
            context.textContent
          ).toContain(
            "no chess-family game"
          );

          expect(
            document.getElementById(
              "status"
            ).textContent
          ).toContain(
            "No historically valid chess-family game"
          );
        }
      }
    );


    test(
      "Present starts with Modern Chess on a fresh page load",
      () => {
        loadAtlas();

        expect(
          document.getElementById(
            "atlas-year"
          ).textContent
        ).toBe("2026 CE");

        expect(
          document.getElementById(
            "game-variant"
          ).value
        ).toBe("modern");

        expect(
          document.getElementById(
            "board"
          ).hidden
        ).toBe(false);

        expect(
          document.getElementById(
            "game-variant-context"
          ).textContent
        ).toContain(
          "Timeline default"
        );
      }
    );


    test(
      "manual exploration resets when the timeline changes",
      () => {
        loadAtlas();
        moveToTimelineIndex(6);

        const select =
          document.getElementById(
            "game-variant"
          );

        const board =
          document.getElementById(
            "board"
          );

        const context =
          document.getElementById(
            "game-variant-context"
          );

        expect(
          select.value
        ).toBe("");

        expect(
          board.hidden
        ).toBe(true);

        select.value =
          "chaturanga";

        select.dispatchEvent(
          new Event(
            "change",
            {
              bubbles: true
            }
          )
        );

        expect(
          board.hidden
        ).toBe(false);

        expect(
          context.textContent
        ).toContain(
          "Manual exploration"
        );

        document.getElementById(
          "timeline-up"
        ).click();

        expect(
          select.value
        ).toBe("");

        expect(
          board.hidden
        ).toBe(true);

        expect(
          context.textContent
        ).not.toContain(
          "Manual exploration"
        );

        document.getElementById(
          "timeline-up"
        ).click();

        expect(
          select.value
        ).toBe("chaturanga");

        expect(
          board.hidden
        ).toBe(false);

        expect(
          context.textContent
        ).toContain(
          "Timeline default"
        );
      }
    );
  }
);