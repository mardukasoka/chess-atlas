const STARTING_POSITION = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

class ChessEngine {
  constructor() {
    this.resetGame();
  }

  isWhite(piece) {
    return Boolean(piece) &&
      "♙♖♘♗♕♔".includes(piece);
  }

  isBlack(piece) {
    return Boolean(piece) &&
      "♟♜♞♝♛♚".includes(piece);
  }

  isFriendly(piece) {
    if (!piece) {
      return false;
    }

    if (this.turn === "White") {
      return this.isWhite(piece);
    }

    return this.isBlack(piece);
  }

  getState() {
    return {
      board: this.board.map(
        row => [...row]
      ),

      selected: this.selected
        ? { ...this.selected }
        : null,

      turn: this.turn,
      status: this.status,
      error: this.error
    };
  }

  resetGame() {
    this.board =
      STARTING_POSITION.map(
        row => [...row]
      );

    this.selected = null;
    this.turn = "White";
    this.status = "White to move";
    this.error = null;

    return this.getState();
  }

  handleSquare(
    row,
    col,
    intent = "auto"
  ) {
    const piece =
      this.board[row][col];

    this.error = null;

    // No active selection:
    // only the side whose turn it is
    // may select a piece.
    if (!this.selected) {
      if (!piece) {
        return this.getState();
      }

      if (
        this.turn === "White" &&
        !this.isWhite(piece)
      ) {
        return this.getState();
      }

      if (
        this.turn === "Black" &&
        !this.isBlack(piece)
      ) {
        return this.getState();
      }

      this.selected = {
        row,
        col
      };

      this.status =
        `Selected ${piece} at ${row},${col}`;

      return this.getState();
    }

    const selectedPiece =
      this.board[
        this.selected.row
      ][
        this.selected.col
      ];

    // Ordinary square interaction:
    //
    // Clicking another friendly piece
    // means "change my active selection",
    // not "capture my own piece".
    //
    // This does not modify the board
    // and does not consume the turn.
    if (
      intent !== "move" &&
      this.isFriendly(piece)
    ) {
      this.selected = {
        row,
        col
      };

      this.status =
        `Selected ${piece} at ${row},${col}`;

      this.error = null;

      return this.getState();
    }

    // Explicit movement/capture intent:
    //
    // A movement transition may never
    // overwrite a friendly piece.
    //
    // Preserve the original active
    // selection so another destination
    // can be attempted.
    if (
      intent === "move" &&
      this.isFriendly(piece)
    ) {
      this.error =
        "Cannot capture your own piece";

      this.status =
        "Cannot capture your own piece";

      return this.getState();
    }

    // Prototype move execution.
    //
    // Empty destinations and enemy
    // destinations are processed
    // normally.
    //
    // Piece-specific movement legality,
    // check rules, and richer capture
    // semantics arrive in later layers.
    this.board[row][col] =
      selectedPiece;

    this.board[
      this.selected.row
    ][
      this.selected.col
    ] = "";

    this.selected = null;

    this.turn =
      this.turn === "White"
        ? "Black"
        : "White";

    this.status =
      `${this.turn} to move`;

    this.error = null;

    return this.getState();
  }
}

// Node / Jest
if (
  typeof module !== "undefined" &&
  module.exports
) {
  module.exports = ChessEngine;
}

// Browser
if (
  typeof window !== "undefined"
) {
  window.ChessEngine =
    ChessEngine;
}