const boardElement =
  document.getElementById(
    "board"
  );


const statusElement =
  document.getElementById(
    "status"
  );


const turnDisplay =
  document.getElementById(
    "turn-display"
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


  turnDisplay.textContent =
    state.turn;


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

  const state =
    engine.handleSquare(
      row,
      col
    );


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


drawState(
  engine.getState()
);