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