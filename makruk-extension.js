"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasMakrukExtension = api;

  if (root && root.ChessEngine && root.ChessAtlasMakrukRules) {
    api.install(root.ChessEngine, root.ChessAtlasMakrukRules);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function install(ChessEngine, MakrukRules) {
    if (!ChessEngine || !MakrukRules) throw new Error("Makruk extension requires ChessEngine and MakrukRules");
    if (ChessEngine.PROFILES.makruk) return ChessEngine;

    ChessEngine.PROFILES.makruk = {
      name: "Makruk — Thai Chess",
      dimensions: [8, 8],
      backRank: ["R", "N", "B", "K", "F", "B", "N", "R"],
      blackBackRank: ["R", "N", "B", "F", "K", "B", "N", "R"],
      pawnDoubleStep: false,
      promotion: "F",
      stalemate: "draw",
      bareKing: "continue",
      countingRule: "formal-pawnless-endgame-counting-not-yet-enforced"
    };

    const proto = ChessEngine.prototype;
    const baseCreateStartingBoard = proto.createStartingBoard;
    const basePseudoMoves = proto.pseudoMoves;
    const baseFinishTurn = proto.finishTurn;

    proto.createStartingBoard = function () {
      if (this.profileId !== "makruk") return baseCreateStartingBoard.call(this);

      const rows = this.boardShape.dimensions[0];
      const columns = this.boardShape.dimensions[1];
      const board = Array.from({ length: rows }, () => Array(columns).fill(""));

      for (let col = 0; col < columns; col++) {
        board[2][col] = "bP";
        board[5][col] = "wP";
      }

      this.profile.backRank.forEach((piece, col) => {
        board[rows - 1][col] = `w${piece}`;
      });

      this.profile.blackBackRank.forEach((piece, col) => {
        board[0][col] = `b${piece}`;
      });

      return board;
    };

    proto.pseudoMoves = function (row, col, board = this.board) {
      if (this.profileId !== "makruk") return basePseudoMoves.call(this, row, col, board);

      return MakrukRules.generateMoves({
        board,
        shape: this.boardShape,
        row,
        col
      }).map(move => ({ row: move.to[0], col: move.to[1] }));
    };

    proto.finishTurn = function (mover) {
      if (this.profileId === "makruk") {
        const promotionRow = mover === "w" ? 2 : 5;
        for (let col = 0; col < this.boardShape.dimensions[1]; col++) {
          if (this.board[promotionRow][col] === `${mover}P`) {
            this.board[promotionRow][col] = `${mover}F`;
          }
        }
      }
      return baseFinishTurn.call(this, mover);
    };

    return ChessEngine;
  }

  return Object.freeze({ install });
});
