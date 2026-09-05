/**
 * @jest-environment node
 */

const Geometry =
  require("./geometry.js");
const Rules =
  require("./rules.js");
const VariantProfiles =
  require(
    "./variant-profiles.js"
  );


function destinations(
  moves
) {
  return moves.map(
    move => move.to
  );
}


function emptyBoard(
  dimensions
) {
  return new Geometry
    .CoordinateMap(
      dimensions
    );
}


describe(
  "generic chess-family rule kernel",
  () => {
    test(
      "generates rook vectors by dimensionality",
      () => {
        expect(
          Rules.vectors.rook(2)
        ).toHaveLength(4);
        expect(
          Rules.vectors.rook(3)
        ).toHaveLength(6);
        expect(
          Rules.vectors.rook(4)
        ).toHaveLength(8);

        Rules.vectors
          .rook(4)
          .forEach(
            vector => {
              expect(
                vector.filter(
                  value =>
                    value !== 0
                )
              ).toHaveLength(1);
            }
          );
      }
    );


    test(
      "generates bishop, queen and king vectors mathematically",
      () => {
        const bishops =
          Rules.vectors
            .bishop(4);
        const queens =
          Rules.vectors
            .queen(4);
        const kings =
          Rules.vectors
            .king(4);

        expect(bishops)
          .toHaveLength(24);
        expect(queens)
          .toHaveLength(80);
        expect(kings)
          .toHaveLength(80);

        bishops.forEach(
          vector => {
            const active =
              vector.filter(
                value =>
                  value !== 0
              );

            expect(active)
              .toHaveLength(2);
            expect(
              active.every(
                value =>
                  Math.abs(value) ===
                  1
              )
            ).toBe(true);
          }
        );

        expect(
          Rules.vectors.queen(4)
        ).toBe(queens);
      }
    );


    test(
      "generates N-dimensional knight permutations and signs",
      () => {
        expect(
          Rules.vectors.knight(2)
        ).toHaveLength(8);
        expect(
          Rules.vectors.knight(3)
        ).toHaveLength(24);
        expect(
          Rules.vectors.knight(4)
        ).toHaveLength(48);

        Rules.vectors
          .knight(4)
          .forEach(
            vector => {
              expect(
                vector
                  .map(Math.abs)
                  .filter(Boolean)
                  .sort()
              ).toEqual([1, 2]);
            }
          );
      }
    );


    test(
      "caches practical vectors and rejects explosive sets",
      () => {
        expect(
          Rules.vectors.knight(4)
        ).toBe(
          Rules.vectors.knight(4)
        );

        expect(
          () =>
            Rules.vectors.queen(
              11
            )
        ).toThrow(
          "too large"
        );

        expect(
          () =>
            Rules.slide(
              [[1, 0]],
              {
                maxSteps: -1
              }
            )
        ).toThrow(
          "non-negative"
        );
      }
    );


    test.each([
      {
        dimensions: [5, 5],
        origin: [2, 2],
        expected: 8
      },
      {
        dimensions: [3, 3, 3],
        origin: [1, 1, 1],
        expected: 6
      },
      {
        dimensions:
          [4, 4, 2, 2],
        origin: [1, 1, 0, 0],
        expected: 8
      }
    ])(
      "generates rook rays on $dimensions",
      ({
        dimensions,
        origin,
        expected
      }) => {
        const moves =
          Rules.generateMoves({
            dimensions,
            origin,
            side: "white",
            occupancy:
              emptyBoard(
                dimensions
              ),
            movement:
              Rules.slide(
                Rules.vectors.rook(
                  dimensions.length
                )
              )
          });

        expect(moves)
          .toHaveLength(expected);
      }
    );


    test(
      "stops at friendly blockers",
      () => {
        const dimensions =
          [8, 8];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [3, 5],
          {
            side: "white",
            type: "pawn"
          }
        );
        occupancy.set(
          [3, 6],
          {
            side: "black",
            type: "queen"
          }
        );

        const moves =
          destinations(
            Rules.generateMoves({
              dimensions,
              origin: [3, 3],
              side: "white",
              occupancy,
              movement:
                Rules.slide(
                  [[0, 1]]
                )
            })
          );

        expect(moves)
          .toContainEqual([3, 4]);
        expect(moves)
          .not.toContainEqual([3, 5]);
        expect(moves)
          .not.toContainEqual([3, 6]);
      }
    );


    test(
      "captures an enemy and stops the ray",
      () => {
        const dimensions =
          [8, 8];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [3, 5],
          {
            side: "black",
            type: "pawn"
          }
        );

        const moves =
          Rules.generateMoves({
            dimensions,
            origin: [3, 3],
            side: "white",
            occupancy,
            movement:
              Rules.slide(
                [[0, 1]]
              )
          });

        expect(
          destinations(moves)
        ).toEqual([
          [3, 4],
          [3, 5]
        ]);
        expect(moves[1].capture)
          .toBe(true);
        expect(
          destinations(moves)
        ).not.toContainEqual(
          [3, 6]
        );
      }
    );


    test(
      "jumping ignores intermediate occupancy",
      () => {
        const dimensions =
          [5, 5];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [1, 0],
          {
            side: "white",
            type: "pawn"
          }
        );

        const moves =
          Rules.generateMoves({
            dimensions,
            origin: [0, 0],
            side: "white",
            occupancy,
            movement:
              Rules.jump(
                Rules.vectors
                  .knight(2)
              )
          });

        expect(
          destinations(moves)
        ).toContainEqual([2, 1]);
      }
    );


    test(
      "supports capture-only and non-capturing movement",
      () => {
        const dimensions =
          [4, 4];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [1, 2],
          {
            side: "black",
            type: "piece"
          }
        );

        const captureOnly =
          Rules.generateMoves({
            dimensions,
            origin: [1, 1],
            side: "white",
            occupancy,
            movement:
              Rules.step(
                [
                  [0, 1],
                  [1, 0]
                ],
                {
                  captureMode:
                    "only"
                }
              )
          });

        const nonCapturing =
          Rules.generateMoves({
            dimensions,
            origin: [1, 1],
            side: "white",
            occupancy,
            movement:
              Rules.step(
                [
                  [0, 1],
                  [1, 0]
                ],
                {
                  captureMode:
                    "none"
                }
              )
          });

        expect(
          destinations(
            captureOnly
          )
        ).toEqual([[1, 2]]);
        expect(
          destinations(
            nonCapturing
          )
        ).toEqual([[2, 1]]);
      }
    );


    test(
      "rejects invalid origins and skips out-of-bounds destinations",
      () => {
        const dimensions =
          [10, 8];
        const occupancy =
          emptyBoard(dimensions);

        expect(
          destinations(
            Rules.generateMoves({
              dimensions,
              origin: [9, 7],
              side: "white",
              occupancy,
              movement:
                Rules.step([
                  [1, 0],
                  [-1, 0],
                  [0, 1],
                  [0, -1]
                ])
            })
          )
        ).toEqual([
          [8, 7],
          [9, 6]
        ]);

        expect(
          () =>
            Rules.generateMoves({
              dimensions,
              origin: [10, 0],
              side: "white",
              occupancy,
              movement:
                Rules.step([
                  [-1, 0]
                ])
            })
        ).toThrow(
          "outside"
        );
      }
    );


    test(
      "supports configurable pawn-like movement",
      () => {
        const dimensions =
          [8, 8];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [2, 2],
          {
            side: "black",
            type: "piece"
          }
        );

        const moves =
          Rules.generateMoves({
            dimensions,
            origin: [1, 1],
            side: "white",
            occupancy,
            movement:
              Rules.pawn({
                forwardAxis: 0,
                forwardDirection: 1,
                startingRank: 1,
                oneStep: 1,
                multiStep: 2,
                captureAxes: [1],
                promotionBoundary: 7
              })
          });

        expect(
          destinations(moves)
        ).toEqual([
          [2, 1],
          [3, 1],
          [2, 2]
        ]);
      }
    );


    test(
      "blocks pawn multi-step movement at intermediate occupancy",
      () => {
        const dimensions =
          [8, 8];
        const occupancy =
          emptyBoard(dimensions);

        occupancy.set(
          [3, 1],
          {
            side: "black",
            type: "piece"
          }
        );

        const moves =
          Rules.generateMoves({
            dimensions,
            origin: [1, 1],
            side: "white",
            occupancy,
            movement:
              Rules.pawn({
                forwardAxis: 0,
                forwardDirection: 1,
                startingRank: 1,
                multiStep: 3,
                captureAxes: [1]
              })
          });

        expect(
          destinations(moves)
        ).toEqual([[2, 1]]);
      }
    );


    test(
      "uses the hidden 4D reference profile",
      () => {
        const profile =
          VariantProfiles
            .reference4D;
        const occupancy =
          emptyBoard(
            profile.dimensions
          );

        profile.startingState
          .forEach(
            entry => {
              occupancy.set(
                entry.coordinate,
                entry.piece
              );
            }
          );

        const moves =
          Rules.generateMoves({
            dimensions:
              profile.dimensions,
            origin: [0, 1, 0, 0],
            side: "white",
            occupancy,
            movement:
              profile.pieces.rook
          });

        expect(profile.playable)
          .toBe(false);
        expect(
          destinations(moves)
        ).toContainEqual(
          [3, 1, 0, 0]
        );
        expect(
          destinations(moves)
        ).toContainEqual(
          [0, 1, 1, 0]
        );
      }
    );


    test(
      "limits sliding on unbounded shapes",
      () => {
        const dimensions =
          [null, null];
        const occupancy =
          emptyBoard(dimensions);

        expect(
          () =>
            Rules.generateMoves({
              dimensions,
              origin: [0, 0],
              side: "white",
              occupancy,
              movement:
                Rules.slide(
                  [[1, 0]]
                )
            })
        ).toThrow(
          "requires maxSteps"
        );

        expect(
          Rules.generateMoves({
            dimensions,
            origin: [0, 0],
            side: "white",
            occupancy,
            movement:
              Rules.slide(
                [[1, 0]],
                {
                  maxSteps: 3
                }
              )
          })
        ).toHaveLength(3);
      }
    );
  }
);