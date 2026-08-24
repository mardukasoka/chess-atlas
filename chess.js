const boardElement =
  document.getElementById(
    "board"
  );


const statusElement =
  document.getElementById(
    "status"
  );





const resetButton =
  document.getElementById(
    "reset"
  );


const variantSelect =
  document.getElementById(
    "game-variant"
  );


const engine =
  new window.ChessEngine(
    variantSelect.value
  );

const stateGraph =
  new window.StateGraph();

let graphTime = 0;

const STORAGE_KEY =
  "chess-atlas-5d-state-v0.1";

function saveGraph() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      stateGraph.export()
    )
  );
}

function createBoard() {

  boardElement.innerHTML =
    "";


  for (
    let row = 0;
    row < 8;
    row++
  ) {

    for (
      let col = 0;
      col < 8;
      col++
    ) {

      const square =
        document.createElement(
          "button"
        );


      square.type =
        "button";


      square.id =
        `square-${row}-${col}`;


      square.dataset.row =
        row;


      square.dataset.col =
        col;


      square.classList.add(
        "square"
      );


      square.classList.add(
        (
          row + col
        ) %
          2 ===
          0
          ? "light"
          : "dark"
      );


      boardElement
        .appendChild(
          square
        );

    }

  }

}


function drawState(
  state
) {

  for (
    let row = 0;
    row < 8;
    row++
  ) {

    for (
      let col = 0;
      col < 8;
      col++
    ) {

      const square =
        document.getElementById(
          `square-${row}-${col}`
        );


      square.textContent =
        state
          .displayBoard[
            row
          ][
            col
          ];


      square.classList.toggle(
        "selected",
        Boolean(
          state.selected &&
          state.selected.row ===
            row &&
          state.selected.col ===
            col
        )
      );

    }

  }


  


  statusElement.textContent =
    state.status;


  boardElement.dataset.variant =
    state.profile;

}


function resetGame() {

  const state =
    engine.resetGame();


  drawState(
    state
  );

}


function changeVariant() {

  const state =
    engine.setProfile(
      variantSelect.value
    );


  drawState(
    state
  );

}


function handleSquare(
  row,
  col
) {

  const before =
    engine.getState();

  const state =
    engine.handleSquare(
      row,
      col
    );

  if (
    state.turn !== before.turn
  ) {
    graphTime += 1;

    stateGraph.addState({
      game: "chess",
      timeline: "history",
      time: graphTime,
      action: "move",
      state
    });

saveGraph();

  }

  drawState(
    state
  );

}


boardElement.addEventListener(
  "pointerdown",
  event => {

    const square =
      event.target.closest(
        ".square"
      );


    if (
      !square ||
      !boardElement.contains(
        square
      )
    ) {
      return;
    }


    event.preventDefault();


    const row =
      Number(
        square.dataset.row
      );


    const col =
      Number(
        square.dataset.col
      );


    handleSquare(
      row,
      col
    );

  }
);


resetButton.addEventListener(
  "click",
  resetGame
);


variantSelect.addEventListener(
  "change",
  changeVariant
);


createBoard();

let initialState =
  engine.getState();

const saved =
  localStorage.getItem(
    STORAGE_KEY
  );

if (saved) {
  try {
    const data =
      JSON.parse(saved);

    if (
      stateGraph.load(data)
    ) {
      const current =
        stateGraph.getCurrent();

      if (
        current &&
        current.state
      ) {
        initialState =
          engine.restoreState(
            current.state
          );

        graphTime =
          current.time;
      }
    }
  } catch (error) {
    console.warn(
      "Could not restore saved game",
      error
    );
  }
}

if (
  stateGraph.nodes.length === 0
) {
  stateGraph.addState({
    game: "chess",
    timeline: "history",
    time: graphTime,
    parentId: null,
    action: "initial",
    state: initialState
  });

  saveGraph();
}

drawState(
  initialState
);