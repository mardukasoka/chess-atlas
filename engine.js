const GeometryApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./geometry.js")
    : window.Geometry;

const ModernChessRulesApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./modern-rules.js")
    : window.ChessAtlasModernRules;

const ShatranjChessRulesApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./shatranj-rules.js")
    : window.ChessAtlasShatranjRules;


const GLYPHS = {
  wK: "♔",
  bK: "♚",

  wR: "♖",
  bR: "♜",

  wN: "♘",
  bN: "♞",

  wB: "♗",
  bB: "♝",

  wQ: "♕",
  bQ: "♛",

  wP: "♙",
  bP: "♟",

  // Historical pieces
  wF: "◆",
  bF: "◇",

  wE: "🐘",
  bE: "🐘"
};


const PROFILES = {

  chaturanga: {
    name: "Chaturanga",

    dimensions: [8, 8],

    backRank: [
      "R",
      "N",
      "E",
      "F",
      "K",
      "E",
      "N",
      "R"
    ],

    blackBackRank: [
      "R",
      "N",
      "E",
      "K",
      "F",
      "E",
      "N",
      "R"
    ],

    pawnDoubleStep: false,

    elephant:
      "orthogonal-jump",

    promotion: "F",

    stalemate:
      "win",

    bareKing:
      "loss"
  },


  shatranj: {
    name: "Shatranj",

    dimensions: [8, 8],

    backRank: [
      "R",
      "N",
      "E",
      "F",
      "K",
      "E",
      "N",
      "R"
    ],

    blackBackRank: [
      "R",
      "N",
      "E",
      "F",
      "K",
      "E",
      "N",
      "R"
    ],

    pawnDoubleStep: false,

    elephant:
      "diagonal-jump",

    promotion: "F",

    stalemate:
      "win",

    bareKing:
      "loss"
  },


acedrex: {
  name: "Acedrex — Alfonso X, 1283",

  dimensions: [8, 8],

  backRank: [
    "R",
    "N",
    "B",
    "Q",
    "K",
    "B",
    "N",
    "R"
  ],

  blackBackRank: [
    "R",
    "N",
    "B",
    "Q",
    "K",
    "B",
    "N",
    "R"
  ],

  pawnDoubleStep: true,

  pawnDoubleUntilCapture: true,

  bishop:
    "diagonal-jump",

  queen:
    "ferz-first-jump",

  elephant: null,

  promotion:
    "Q",

  promotionRequiresMissingQueen:
    true,

  stalemate:
    "continue",

  bareKing:
    "continue"
},


  modern: {
    name: "Modern Chess",

    dimensions: [8, 8],

    backRank: [
      "R",
      "N",
      "B",
      "Q",
      "K",
      "B",
      "N",
      "R"
    ],

    blackBackRank: [
      "R",
      "N",
      "B",
      "Q",
      "K",
      "B",
      "N",
      "R"
    ],

    pawnDoubleStep: true,

    elephant: null,

    promotion: "Q",

    stalemate:
      "draw",

    bareKing:
      "continue"
  }

};


const ORTHOGONAL = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];


const DIAGONAL = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
];


const KING_MOVES = [
  ...ORTHOGONAL,
  ...DIAGONAL
];


const KNIGHT_MOVES = [
  [-2, -1],
  [-2, 1],

  [-1, -2],
  [-1, 2],

  [1, -2],
  [1, 2],

  [2, -1],
  [2, 1]
];


function inside(
  row,
  col,
  boardShape
) {
  return boardShape.contains(
    [row, col]
  );
}


function cloneBoard(
  board
) {
  return board.map(
    row => [...row]
  );
}


function colourOf(
  piece
) {
  if (!piece) {
    return null;
  }

  return piece[0];
}


function typeOf(
  piece
) {
  if (!piece) {
    return null;
  }

  return piece[1];
}


function opposite(
  colour
) {
  return (
    colour === "w"
      ? "b"
      : "w"
  );
}


function colourName(
  colour
) {
  return (
    colour === "w"
      ? "White"
      : "Black"
  );
}


class ChessEngine {

  constructor(
    profile = "chaturanga"
  ) {
    this.setProfile(
      profile
    );
  }


  setProfile(
    profile
  ) {
    if (!PROFILES[profile]) {
      throw new Error(
        `Unknown profile: ${profile}`
      );
    }

    this.profileId =
      profile;

    this.profile =
      PROFILES[profile];

    this.boardShape =
      GeometryApi.createBoardShape(
        this.profile
          .dimensions
      );

    return this.resetGame();
  }


  createStartingBoard() {

    const [
      rows,
      columns
    ] =
      this.boardShape
        .dimensions;

    const board =
      Array.from(
        {
          length: rows
        },
        () =>
          Array(columns)
            .fill("")
      );


    for (
      let col = 0;
      col < columns;
      col++
    ) {

      board[1][col] =
        "bP";

      board[
        rows - 2
      ][col] =
        "wP";

    }


    this.profile
      .backRank
      .forEach(
        (
          piece,
          col
        ) => {

          board[
            rows - 1
          ][col] =
            `w${piece}`;

        }
      );


    this.profile
      .blackBackRank
      .forEach(
        (
          piece,
          col
        ) => {

          board[0][col] =
            `b${piece}`;

        }
      );


    return board;
  }


  resetGame() {

    this.board =
      this.createStartingBoard();

    this.turn = "w";

    this.selected = null;

    this.error = null;

    this.gameOver = false;

    this.winner = null;

this.captureOccurred =
  false;


// Acedrex gives each queen
// one special first-move jump.
this.queenHasMoved = {
  w: false,
  b: false
};


this.status =
      `${this.profile.name}: White to move`;

    return this.getState();
  }


  getState() {

    return {

      profile:
        this.profileId,

      profileName:
        this.profile.name,

      dimensions:
        [
          ...this.boardShape
            .dimensions
        ],

      board:
        cloneBoard(
          this.board
        ),

      displayBoard:
        this.board.map(
          row =>
            row.map(
              piece =>
                GLYPHS[piece] || ""
            )
        ),

      selected:
        this.selected
          ? {
              ...this.selected
            }
          : null,

turnCode:
  this.turn,

      turn:
        colourName(
          this.turn
        ),

      status:
        this.status,

      error:
        this.error,

      gameOver:
        this.gameOver,

      winnerCode:
  this.winner,

winner:
  this.winner
    ? colourName(
        this.winner
      )
    : null,

captureOccurred:
  this.captureOccurred,

queenHasMoved: {
  ...this.queenHasMoved
}
    };

  }


restoreState(
  snapshot
) {

  if (
    !snapshot ||
    !PROFILES[snapshot.profile]
  ) {
    throw new Error(
      "Invalid chess state"
    );
  }

  this.profileId =
    snapshot.profile;

  this.profile =
    PROFILES[
      snapshot.profile
    ];

  this.boardShape =
    GeometryApi.createBoardShape(
      this.profile
        .dimensions
    );

  this.board =
    cloneBoard(
      snapshot.board
    );

  this.selected =
    snapshot.selected
      ? {
          ...snapshot.selected
        }
      : null;

  this.turn =
    snapshot.turnCode;

  this.status =
    snapshot.status;

  this.error =
    snapshot.error;

  this.gameOver =
    snapshot.gameOver;

  this.winner =
    snapshot.winnerCode;

  this.captureOccurred =
    Boolean(
      snapshot.captureOccurred
    );

  this.queenHasMoved = {
    w: Boolean(
      snapshot.queenHasMoved?.w
    ),
    b: Boolean(
      snapshot.queenHasMoved?.b
    )
  };

  return this.getState();
}


  findKing(
    colour,
    board = this.board
  ) {

    for (
      const [row, col]
      of this.boardShape
        .coordinates()
    ) {

      if (
        board[row][col] ===
        `${colour}K`
      ) {

        return {
          row,
          col
        };

      }

    }

    return null;
  }


  stepMoves(
    row,
    col,
    offsets,
    board = this.board
  ) {

    const piece =
      board[row][col];

    const colour =
      colourOf(piece);

    const moves = [];


    for (
      const [
        rowOffset,
        colOffset
      ]
      of offsets
    ) {

      const destination =
        GeometryApi.add(
          [row, col],
          [rowOffset, colOffset]
        );

      const targetRow =
        destination[0];

      const targetCol =
        destination[1];


      if (
        !inside(
          targetRow,
          targetCol,
          this.boardShape
        )
      ) {
        continue;
      }


      const pieceAtTarget =
        board[
          targetRow
        ][
          targetCol
        ];


      if (
        !pieceAtTarget ||
        colourOf(pieceAtTarget) !==
          colour
      ) {

        moves.push({
          row:
            targetRow,

          col:
            targetCol
        });

      }

    }


    return moves;
  }


  slidingMoves(
    row,
    col,
    directions,
    board = this.board
  ) {

    const piece =
      board[row][col];

    const colour =
      colourOf(piece);

    const moves = [];


    for (
      const [
        rowOffset,
        colOffset
      ]
      of directions
    ) {

      let target =
        GeometryApi.add(
          [row, col],
          [rowOffset, colOffset]
        );


      while (
        inside(
          target[0],
          target[1],
          this.boardShape
        )
      ) {

        const pieceAtTarget =
          board[
            target[0]
          ][
            target[1]
          ];


        if (!pieceAtTarget) {

          moves.push({
            row:
              target[0],

            col:
              target[1]
          });

        } else {

          if (
            colourOf(pieceAtTarget) !==
            colour
          ) {

            moves.push({
              row:
                target[0],

              col:
                target[1]
            });

          }

          break;
        }


        target =
          GeometryApi.step(
            target,
            [rowOffset, colOffset]
          );

      }

    }


    return moves;
  }


  pawnMoves(
    row,
    col,
    board = this.board
  ) {

    const piece =
      board[row][col];

    const colour =
      colourOf(piece);

    const direction =
      colour === "w"
        ? -1
        : 1;

    const startingRow =
      colour === "w"
        ? (
            this.boardShape
              .dimensions[0] -
            2
          )
        : 1;

    const moves = [];


    const oneStep =
      row + direction;


    if (
      inside(
        oneStep,
        col,
        this.boardShape
      ) &&
      !board[
        oneStep
      ][
        col
      ]
    ) {

      moves.push({
        row:
          oneStep,

        col
      });


      const twoStep =
        row +
        (
          direction * 2
        );


      if (
        this.profile
  .pawnDoubleStep &&

(
  !this.profile
    .pawnDoubleUntilCapture ||
  !this.captureOccurred
) &&

row ===
  startingRow &&
        !board[
          twoStep
        ][
          col
        ]
      ) {

        moves.push({
          row:
            twoStep,

          col
        });

      }

    }


    for (
      const colOffset
      of [-1, 1]
    ) {

      const captureRow =
        row + direction;

      const captureCol =
        col + colOffset;


      if (
        !inside(
          captureRow,
          captureCol,
          this.boardShape
        )
      ) {
        continue;
      }


      const target =
        board[
          captureRow
        ][
          captureCol
        ];


      if (
        target &&
        colourOf(target) !==
          colour
      ) {

        moves.push({
          row:
            captureRow,

          col:
            captureCol
        });

      }

    }


    return moves;
  }


  elephantMoves(
    row,
    col,
    board = this.board
  ) {

    if (
      this.profile
        .elephant ===
      "orthogonal-jump"
    ) {

      return this.stepMoves(
        row,
        col,
        [
          [-2, 0],
          [2, 0],
          [0, -2],
          [0, 2]
        ],
        board
      );

    }


    if (
      this.profile
        .elephant ===
      "diagonal-jump"
    ) {

      return this.stepMoves(
        row,
        col,
        [
          [-2, -2],
          [-2, 2],
          [2, -2],
          [2, 2]
        ],
        board
      );

    }


    return [];
  }


  modernMoveCandidates(
    row,
    col,
    board = this.board
  ) {
    return ModernChessRulesApi
      .generateMoves({
        board,
        shape:
          this.boardShape,
        row,
        col
      });
  }


  modernPseudoMoves(
    row,
    col,
    board = this.board
  ) {
    return this
      .modernMoveCandidates(
        row,
        col,
        board
      )
      .map(
        move => ({
          row: move.to[0],
          col: move.to[1]
        })
      );
  }


  shatranjMoveCandidates(
    row,
    col,
    board = this.board
  ) {
    return ShatranjChessRulesApi
      .generateMoves({
        board,
        shape:
          this.boardShape,
        row,
        col
      });
  }


  shatranjPseudoMoves(
    row,
    col,
    board = this.board
  ) {
    return this
      .shatranjMoveCandidates(
        row,
        col,
        board
      )
      .map(
        move => ({
          row: move.to[0],
          col: move.to[1]
        })
      );
  }


  pseudoMoves(
    row,
    col,
    board = this.board
  ) {
    if (
      this.profileId ===
      "modern"
    ) {
      return this
        .modernPseudoMoves(
          row,
          col,
          board
        );
    }

    if (
      this.profileId ===
      "shatranj"
    ) {
      return this
        .shatranjPseudoMoves(
          row,
          col,
          board
        );
    }

    return this
      .legacyPseudoMoves(
        row,
        col,
        board
      );
  }


  legacyPseudoMoves(
    row,
    col,
    board = this.board
  ) {

    const piece =
      board[row][col];


    if (!piece) {
      return [];
    }


    switch (
      typeOf(piece)
    ) {

      case "P":

        return this.pawnMoves(
          row,
          col,
          board
        );


      case "R":

        return this.slidingMoves(
          row,
          col,
          ORTHOGONAL,
          board
        );


      case "B":

  if (
    this.profile.bishop ===
    "diagonal-jump"
  ) {

    return this.stepMoves(
      row,
      col,
      [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2]
      ],
      board
    );

  }

  return this.slidingMoves(
    row,
    col,
    DIAGONAL,
    board
  );


      case "Q":

  if (
    this.profile.queen ===
    "ferz-first-jump"
  ) {

    const moves =
      this.stepMoves(
        row,
        col,
        DIAGONAL,
        board
      );


    const queenColour =
  colourOf(piece);


if (
  !this.queenHasMoved[
    queenColour
  ]
) {

      for (
        const [
          rowOffset,
          colOffset
        ]
        of [
          [-2, -2],
          [-2, 2],
          [2, -2],
          [2, 2]
        ]
      ) {

        const targetRow =
          row + rowOffset;

        const targetCol =
          col + colOffset;


        if (
          inside(
            targetRow,
            targetCol,
            this.boardShape
          ) &&
          !board[
            targetRow
          ][
            targetCol
          ]
        ) {

          moves.push({
            row:
              targetRow,

            col:
              targetCol
          });

        }

      }

    }


    return moves;

  }


  return this.slidingMoves(
    row,
    col,
    KING_MOVES,
    board
  );


      case "K":

        return this.stepMoves(
          row,
          col,
          KING_MOVES,
          board
        );


      case "N":

        return this.stepMoves(
          row,
          col,
          KNIGHT_MOVES,
          board
        );


      case "F":

        return this.stepMoves(
          row,
          col,
          DIAGONAL,
          board
        );


      case "E":

        return this.elephantMoves(
          row,
          col,
          board
        );


      default:

        return [];

    }

  }


  isSquareAttacked(
    row,
    col,
    byColour,
    board = this.board
  ) {

    for (
      const [
        pieceRow,
        pieceCol
      ]
      of this.boardShape
        .coordinates()
    ) {

        const piece =
          board[
            pieceRow
          ][
            pieceCol
          ];


        if (
          !piece ||
          colourOf(piece) !==
            byColour
        ) {
          continue;
        }


        if (
          typeOf(piece) ===
          "P"
        ) {

          const direction =
            byColour === "w"
              ? -1
              : 1;


          if (
            pieceRow +
              direction ===
                row &&
            (
              pieceCol - 1 ===
                col ||
              pieceCol + 1 ===
                col
            )
          ) {

            return true;

          }


          continue;
        }


        const moves =
          this.pseudoMoves(
            pieceRow,
            pieceCol,
            board
          );


        if (
          moves.some(
            move =>
              move.row === row &&
              move.col === col
          )
        ) {

          return true;

        }

    }


    return false;
  }


  inCheck(
    colour,
    board = this.board
  ) {

    const king =
      this.findKing(
        colour,
        board
      );


    if (!king) {
      return true;
    }


    return this
      .isSquareAttacked(
        king.row,
        king.col,
        opposite(colour),
        board
      );

  }


  legalMoves(
    row,
    col
  ) {

    const piece =
      this.board[row][col];


    if (!piece) {
      return [];
    }


    const colour =
      colourOf(piece);


    return this
      .pseudoMoves(
        row,
        col
      )
      .filter(
        move => {

          const nextBoard =
            cloneBoard(
              this.board
            );


          nextBoard[
            move.row
          ][
            move.col
          ] = piece;


          nextBoard[
            row
          ][
            col
          ] = "";


          return !this.inCheck(
            colour,
            nextBoard
          );

        }
      );

  }


  hasLegalMove(
    colour
  ) {

    for (
      const [row, col]
      of this.boardShape
        .coordinates()
    ) {

        if (
          colourOf(
            this.board[
              row
            ][
              col
            ]
          ) !==
          colour
        ) {
          continue;
        }


        if (
          this.legalMoves(
            row,
            col
          ).length > 0
        ) {

          return true;

        }

    }


    return false;
  }


  countPieces(
    colour
  ) {

    return this.board
      .flat()
      .filter(
        piece =>
          colourOf(piece) ===
          colour
      )
      .length;

  }


  finishTurn(
    mover
  ) {

    const next =
      opposite(mover);


    if (
      this.profile
        .bareKing ===
        "loss" &&
      this.countPieces(
        next
      ) === 1 &&
      this.findKing(
        next
      )
    ) {

      this.gameOver =
        true;

      this.winner =
        mover;

      this.status =
        `${colourName(mover)} wins by bare king`;

      return;
    }


    const hasMoves =
      this.hasLegalMove(
        next
      );


    if (!hasMoves) {

      const checked =
        this.inCheck(
          next
        );


      this.gameOver =
        true;


      if (checked) {

        this.winner =
          mover;

        this.status =
          `${colourName(mover)} wins by checkmate`;

        return;
      }


      if (
        this.profile
          .stalemate ===
        "draw"
      ) {

        this.winner =
          null;

        this.status =
          "Draw by stalemate";

        return;
      }


      this.winner =
        mover;

      this.status =
        `${colourName(mover)} wins by stalemate`;

      return;
    }


    this.turn =
      next;


    this.status =
      `${this.profile.name}: ${colourName(next)} to move`;

  }


  handleSquare(
    row,
    col
  ) {

    if (
      this.gameOver
    ) {
      return this.getState();
    }


    this.error = null;


    const piece =
      this.board[row][col];


    if (
      !this.selected
    ) {

      if (
        piece &&
        colourOf(piece) ===
          this.turn
      ) {

        this.selected = {
          row,
          col
        };


        this.status =
          `Selected ${GLYPHS[piece]}`;

      }


      return this.getState();
    }


    if (
      piece &&
      colourOf(piece) ===
        this.turn
    ) {

      this.selected = {
        row,
        col
      };


      this.status =
        `Selected ${GLYPHS[piece]}`;


      return this.getState();
    }


    const fromRow =
      this.selected.row;

    const fromCol =
      this.selected.col;


    const selectedPiece =
      this.board[
        fromRow
      ][
        fromCol
      ];


    const legal =
      this.legalMoves(
        fromRow,
        fromCol
      ).some(
        move =>
          move.row === row &&
          move.col === col
      );


    if (!legal) {

      this.error =
        "Illegal move";

      this.status =
        "Illegal move";

      return this.getState();
    }


    const mover =
      this.turn;


const capturedPiece =
  this.board[row][col];


if (capturedPiece) {

  this.captureOccurred =
    true;

}

    this.board[
      row
    ][
      col
    ] =
      selectedPiece;


    this.board[
  fromRow
][
  fromCol
] =
  "";


// Record the Acedrex queen's
// first move permanently.
if (
  this.profile.queen ===
    "ferz-first-jump" &&
  typeOf(
    selectedPiece
  ) ===
    "Q"
) {

  this.queenHasMoved[
    mover
  ] =
    true;

}


if (
  typeOf(
    selectedPiece
  ) ===
    "P" &&

  (
    row === 0 ||
    row ===
      this.boardShape
        .dimensions[0] -
        1
  )
) {

  const ownQueen =
    `${mover}Q`;

  const queenStillExists =
    this.board
      .flat()
      .includes(
        ownQueen
      );


  const promotionAllowed =
    !this.profile
      .promotionRequiresMissingQueen ||
    !queenStillExists;


  if (
    promotionAllowed
  ) {

    this.board[
      row
    ][
      col
    ] =
      `${mover}${this.profile.promotion}`;

  }

}


    this.selected =
      null;


    this.finishTurn(
      mover
    );


    return this.getState();

  }

}


ChessEngine.PROFILES =
  PROFILES;


ChessEngine.GLYPHS =
  GLYPHS;


// Node / Jest
if (
  typeof module !==
    "undefined" &&
  module.exports
) {

  module.exports =
    ChessEngine;

}


// Browser
if (
  typeof window !==
    "undefined"
) {

  window.ChessEngine =
    ChessEngine;

}