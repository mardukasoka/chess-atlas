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


const stateBackButton =
  document.getElementById(
    "state-back"
  );


const stateForwardSelect =
  document.getElementById(
    "state-forward"
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

const historicalState = {
  date: null,
  region: null,

  polity: {
    id: null,
    name: null,
    ruler: null,
    capital: null,
    government: null
  },

  cities: [],
  territory: [],
  tradeRoutes: [],
  resources: [],

  technology: {
    transport: null,
    communication: null,
    agriculture: null,
    materials: null,
    military: null,
    administration: null
  },

diplomacy: [],
  armies: [],
  events: []
};

const alexander336BCE = {
  ...structuredClone(historicalState),

  date: -336,
  region: "Eastern Mediterranean",

  polity: {
    id: "macedon",
    name: "Kingdom of Macedon",
    ruler: "Alexander III",
    capital: "Pella",
    government: "Monarchy"
  },

  cities: [
    "Pella",
    "Amphipolis"
  ],

  technology: {
    transport: "horse-road-sea",
    communication: "messenger",
    agriculture: "iron-age",
    materials: "iron-bronze-wood",
    military: "macedonian-combined-arms",
    administration: "royal-administration"
  },

  diplomacy: [
    {
      polity: "Achaemenid Empire",
      relation: "hostile"
    }
  ],

  armies: [
    {
      id: "macedonian-main",
      commander: "Alexander III",
      location: "Macedon"
    }
  ],

  events: [
    "Alexander succeeds Philip II"
  ]
};

  

const STORAGE_KEY =
  "chess-atlas-5d-state-v0.2";

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


function goBackState() {

  const node =
    stateGraph.goBack();


  if (
    !node ||
    !node.state
  ) {
    return;
  }


  const state =
    engine.restoreState(
      node.state
    );

if (node.game !== "chess") {
  graphTime = node.time;
  saveGraph();
  updateForwardOptions();
  return;
}

  variantSelect.value =
    state.profile;


  graphTime =
    node.time;


    drawState(
    state
  );


  saveGraph();


  updateForwardOptions();

}

function updateForwardOptions() {

  const children =
    stateGraph
      .getForwardOptions();


  stateForwardSelect
    .innerHTML =
      '<option value="">Future States</option>';


  children.forEach(
    (
      node,
      index
    ) => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        node.id;


      option.textContent =
        `Future ${index + 1} — ${node.action || "state"}`;


      stateForwardSelect
        .appendChild(
          option
        );

    }
  );

}


function goForwardState() {

  const childId =
    stateForwardSelect.value;


  if (!childId) {
    return;
  }


  const node =
    stateGraph.goForward(
      childId
    );


  if (
    !node ||
    !node.state
  ) {
    return;
  }

if (node.game !== "chess") {
  graphTime = node.time;
  saveGraph();
  updateForwardOptions();
  return;
}

  const state =
    engine.restoreState(
      node.state
    );


  variantSelect.value =
    state.profile;


  graphTime =
    node.time;


  drawState(
    state
  );


  saveGraph();


  updateForwardOptions();

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

updateForwardOptions();

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


stateBackButton.addEventListener(
  "click",
  goBackState
);

stateForwardSelect.addEventListener(
  "change",
  goForwardState
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

variantSelect.value =
  initialState.profile;

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
    game: "history",
    timeline: "alexander",
    time: alexander336BCE.date,
    parentId: null,
    action: "Alexander becomes king",
    state: alexander336BCE
  });
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

updateForwardOptions();