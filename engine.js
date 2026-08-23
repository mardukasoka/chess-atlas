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


  modern: {
    name: "Modern Chess",

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
  col
) {
  return (
    row >= 0 &&
    row < 8 &&
    col >= 0 &&
    col < 8
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

    return this.resetGame();
  }


  createStartingBoard() {

    const board =
      Array.from(
        {
          length: 8
        },
        () =>
          Array(8)
            .fill("")
      );


    for (
      let col = 0;
      col < 8;
      col++
    ) {

      board[1][col] =
        "bP";

      board[6][col] =
        "wP";

    }


    this.profile
      .backRank
      .forEach(
        (
          piece,
          col
        ) => {

          board[7][col] =
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

      winner:
        this.winner
          ? colourName(
              this.winner
            )
          : null
    };

  }


  findKing(
    colour,
    board = this.board
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

      const targetRow =
        row + rowOffset;

      const targetCol =
        col + colOffset;


      if (
        !inside(
          targetRow,
          targetCol
        )
      ) {
        continue;
      }


      const target =
        board[
          targetRow
        ][
          targetCol
        ];


      if (
        !target ||
        colourOf(target) !==
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

      let targetRow =
        row + rowOffset;

      let targetCol =
        col + colOffset;


      while (
        inside(
          targetRow,
          targetCol
        )
      ) {

        const target =
          board[
            targetRow
          ][
            targetCol
          ];


        if (!target) {

          moves.push({
            row:
              targetRow,

            col:
              targetCol
          });

        } else {

          if (
            colourOf(target) !==
            colour
          ) {

            moves.push({
              row:
                targetRow,

              col:
                targetCol
            });

          }

          break;
        }


        targetRow +=
          rowOffset;

        targetCol +=
          colOffset;

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
        ? 6
        : 1;

    const moves = [];


    const oneStep =
      row + direction;


    if (
      inside(
        oneStep,
        col
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
          captureCol
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


  pseudoMoves(
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

        return this.slidingMoves(
          row,
          col,
          DIAGONAL,
          board
        );


      case "Q":

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
      let pieceRow = 0;
      pieceRow < 8;
      pieceRow++
    ) {

      for (
        let pieceCol = 0;
        pieceCol < 8;
        pieceCol++
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
      let row = 0;
      row < 8;
      row++
    ) {

      for (
        let col = 0;
        col < 8;
        col++
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


    if (
      typeOf(
        selectedPiece
      ) ===
        "P" &&
      (
        row === 0 ||
        row === 7
      )
    ) {

      this.board[
        row
      ][
        col
      ] =
        `${mover}${this.profile.promotion}`;

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