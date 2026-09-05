/**
 * @jest-environment node
 */

const Geometry =
  require("./geometry.js");


describe(
  "generic geometry primitives",
  () => {
    test(
      "validates 2D, 3D and 4D coordinates",
      () => {
        expect(
          Geometry.validateCoordinate(
            [3, 4],
            2
          )
        ).toEqual([3, 4]);

        expect(
          Geometry.validateCoordinate(
            [1, 2, 0],
            3
          )
        ).toEqual([1, 2, 0]);

        expect(
          Geometry.validateCoordinate(
            [2, 3, 1, 0],
            4
          )
        ).toEqual([2, 3, 1, 0]);

        expect(
          Geometry.validateDimensions(
            [4, 4, 2, 2],
            4
          )
        ).toEqual([4, 4, 2, 2]);
      }
    );


    test(
      "compares, adds and subtracts coordinates",
      () => {
        expect(
          Geometry.equals(
            [1, 2, 3],
            [1, 2, 3]
          )
        ).toBe(true);

        expect(
          Geometry.equals(
            [1, 2, 3],
            [1, 2, 4]
          )
        ).toBe(false);

        expect(
          Geometry.add(
            [3, 4],
            [1, -2]
          )
        ).toEqual([4, 2]);

        expect(
          Geometry.difference(
            [4, 2, 1, 0],
            [1, 1, 0, 2]
          )
        ).toEqual([3, 1, 1, -2]);
      }
    );


    test(
      "steps along vectors in arbitrary dimensions",
      () => {
        expect(
          Geometry.step(
            [2, 3, 1, 0],
            [1, -1, 2, 3],
            2
          )
        ).toEqual([4, 1, 5, 6]);
      }
    );


    test(
      "checks finite and unbounded board dimensions",
      () => {
        expect(
          Geometry.inBounds(
            [7, 7],
            [8, 8]
          )
        ).toBe(true);

        expect(
          Geometry.inBounds(
            [8, 7],
            [8, 8]
          )
        ).toBe(false);

        expect(
          Geometry.inBounds(
            [3, 3, 1, 1],
            [4, 4, 2, 2]
          )
        ).toBe(true);

        expect(
          Geometry.inBounds(
            [-100, 3],
            [null, 8]
          )
        ).toBe(true);
      }
    );


    test(
      "generates bounded 2D, 3D and 4D rays",
      () => {
        expect(
          Geometry.ray(
            [0, 0],
            [1, 0],
            {
              bounds: [3, 3]
            }
          )
        ).toEqual([
          [1, 0],
          [2, 0]
        ]);

        expect(
          Geometry.ray(
            [0, 0, 0],
            [1, 1, 0],
            {
              bounds: [3, 3, 2]
            }
          )
        ).toEqual([
          [1, 1, 0],
          [2, 2, 0]
        ]);

        expect(
          Geometry.ray(
            [0, 0, 0, 0],
            [1, 0, 0, 1],
            {
              maxSteps: 3
            }
          )
        ).toEqual([
          [1, 0, 0, 1],
          [2, 0, 0, 2],
          [3, 0, 0, 3]
        ]);
      }
    );


    test(
      "supports sparse or unbounded ray limits",
      () => {
        expect(
          Geometry.ray(
            [-2, 1],
            [1, 0],
            {
              bounds: [null, 3],
              maxSteps: 3
            }
          )
        ).toEqual([
          [-1, 1],
          [0, 1],
          [1, 1]
        ]);
      }
    );


    test(
      "represents rectangular, 3D and 4D board shapes",
      () => {
        const chess =
          Geometry.createBoardShape(
            [8, 8]
          );
        const rectangular =
          Geometry.createBoardShape(
            [10, 8]
          );
        const threeDimensional =
          Geometry.createBoardShape(
            [4, 4, 2]
          );
        const fourDimensional =
          Geometry.createBoardShape(
            [4, 4, 2, 2]
          );

        expect(chess.size)
          .toBe(64);
        expect(rectangular.size)
          .toBe(80);
        expect(
          rectangular.contains(
            [9, 7]
          )
        ).toBe(true);
        expect(
          rectangular.contains(
            [10, 7]
          )
        ).toBe(false);
        expect(threeDimensional.size)
          .toBe(32);
        expect(fourDimensional.size)
          .toBe(64);
      }
    );


    test(
      "iterates every coordinate on finite boards",
      () => {
        expect(
          Array.from(
            Geometry
              .iterateCoordinates(
                [2, 3]
              )
          )
        ).toEqual([
          [0, 0],
          [0, 1],
          [0, 2],
          [1, 0],
          [1, 1],
          [1, 2]
        ]);

        expect(
          Array.from(
            Geometry
              .iterateCoordinates(
                [4, 4, 2]
              )
          )
        ).toHaveLength(32);

        expect(
          Array.from(
            Geometry
              .iterateCoordinates(
                [4, 4, 2, 2]
              )
          )
        ).toHaveLength(64);
      }
    );


    test(
      "serializes coordinates without key collisions",
      () => {
        const first =
          Geometry.coordinateKey(
            [1, 23]
          );
        const second =
          Geometry.coordinateKey(
            [12, 3]
          );

        expect(first)
          .not.toBe(second);
        expect(
          Geometry.coordinateFromKey(
            first,
            2
          )
        ).toEqual([1, 23]);
      }
    );


    test(
      "stores bounded and unbounded boards sparsely",
      () => {
        const bounded =
          new Geometry.CoordinateMap(
            [4, 4, 2]
          );

        bounded
          .set(
            [3, 1, 0],
            "white-knight"
          )
          .set(
            [0, 0, 1],
            "black-king"
          );

        expect(
          bounded.get(
            [3, 1, 0]
          )
        ).toBe("white-knight");
        expect(
          [...bounded]
        ).toEqual([
          [
            [3, 1, 0],
            "white-knight"
          ],
          [
            [0, 0, 1],
            "black-king"
          ]
        ]);
        expect(
          () =>
            bounded.set(
              [4, 0, 0],
              "outside"
            )
        ).toThrow(
          "outside"
        );

        const unbounded =
          new Geometry.CoordinateMap(
            [null, null]
          );

        unbounded.set(
          [-1000000, 2500000],
          "piece"
        );

        expect(
          unbounded.get(
            [-1000000, 2500000]
          )
        ).toBe("piece");
        expect(unbounded.shape.size)
          .toBeNull();
        expect(
          () =>
            Array.from(
              unbounded.shape
                .coordinates()
            )
        ).toThrow(
          "finite dimensions"
        );
      }
    );


    test(
      "rejects invalid dimensionality and geometry",
      () => {
        expect(
          () =>
            Geometry.add(
              [1, 2],
              [1, 2, 3]
            )
        ).toThrow(
          "same dimensionality"
        );

        expect(
          () =>
            Geometry.inBounds(
              [1, 2],
              [8]
            )
        ).toThrow(
          "board dimensions"
        );

        expect(
          () =>
            Geometry.validateCoordinate(
              [1, 1.5]
            )
        ).toThrow(
          "integers"
        );

        expect(
          () =>
            Geometry.ray(
              [0, 0],
              [0, 0]
            )
        ).toThrow(
          "zero"
        );

        expect(
          () =>
            Geometry.ray(
              [0, 0],
              [1, 0]
            )
        ).toThrow(
          "maxSteps"
        );
      }
    );
  }
);