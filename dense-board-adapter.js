"use strict";

const DenseBoardGeometryApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./geometry.js")
    : window.Geometry;


class DenseBoardOccupancy {

  constructor(
    board,
    dimensions
  ) {
    if (
      !Array.isArray(board)
    ) {
      throw new TypeError(
        "Dense board must be an array"
      );
    }

    const inferred =
      dimensions || [
        board.length,
        board[0]?.length || 0
      ];

    this.shape =
      DenseBoardGeometryApi
        .createBoardShape(
          inferred
        );

    if (
      this.shape
        .dimensions.length !== 2 ||
      board.length !==
        this.shape.dimensions[0] ||
      board.some(
        row =>
          !Array.isArray(row) ||
          row.length !==
            this.shape
              .dimensions[1]
      )
    ) {
      throw new RangeError(
        "Dense board does not match its 2D dimensions"
      );
    }

    this.board =
      board;
  }


  get dimensions() {
    return this.shape
      .dimensions;
  }


  get(coordinate) {
    const point =
      DenseBoardGeometryApi
        .validateCoordinate(
          coordinate,
          2
        );

    if (
      !this.shape.contains(
        point
      )
    ) {
      return undefined;
    }

    return (
      this.board[
        point[0]
      ][
        point[1]
      ] ||
      undefined
    );
  }
}


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    DenseBoardOccupancy;
}


if (
  typeof window !==
    "undefined"
) {
  window.DenseBoardOccupancy =
    DenseBoardOccupancy;
}