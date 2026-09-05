"use strict";

/*
 * Generic coordinate and board-geometry primitives.
 *
 * Coordinates are integer arrays. Finite dimensions are zero-based sizes.
 * A null or Infinity dimension is unbounded and may contain negative values.
 */

function validateCoordinate(
  coordinate,
  expectedDimension
) {
  if (!Array.isArray(coordinate)) {
    throw new TypeError(
      "Coordinate must be an array"
    );
  }

  if (
    expectedDimension !== undefined &&
    coordinate.length !== expectedDimension
  ) {
    throw new RangeError(
      `Expected ${expectedDimension} coordinate dimensions`
    );
  }

  if (
    coordinate.some(
      value => !Number.isInteger(value)
    )
  ) {
    throw new TypeError(
      "Coordinates must contain integers"
    );
  }

  return [...coordinate];
}


function validateDimensions(
  dimensions,
  expectedDimension
) {
  if (!Array.isArray(dimensions)) {
    throw new TypeError(
      "Dimensions must be an array"
    );
  }

  if (
    expectedDimension !== undefined &&
    dimensions.length !== expectedDimension
  ) {
    throw new RangeError(
      `Expected ${expectedDimension} board dimensions`
    );
  }

  dimensions.forEach(
    dimension => {
      const unbounded =
        dimension === null ||
        dimension === Infinity;

      if (
        !unbounded &&
        (
          !Number.isInteger(dimension) ||
          dimension <= 0
        )
      ) {
        throw new RangeError(
          "Finite dimensions must be positive integers"
        );
      }
    }
  );

  return [...dimensions];
}


function assertSameDimension(
  first,
  second
) {
  if (first.length !== second.length) {
    throw new RangeError(
      "Coordinates must have the same dimensionality"
    );
  }
}


function equals(
  first,
  second
) {
  const left =
    validateCoordinate(first);
  const right =
    validateCoordinate(second);

  assertSameDimension(left, right);

  return left.every(
    (value, index) =>
      value === right[index]
  );
}


function add(
  first,
  second
) {
  const left =
    validateCoordinate(first);
  const right =
    validateCoordinate(second);

  assertSameDimension(left, right);

  return left.map(
    (value, index) =>
      value + right[index]
  );
}


function difference(
  first,
  second
) {
  const left =
    validateCoordinate(first);
  const right =
    validateCoordinate(second);

  assertSameDimension(left, right);

  return left.map(
    (value, index) =>
      value - right[index]
  );
}


function step(
  coordinate,
  vector,
  distance = 1
) {
  if (!Number.isInteger(distance)) {
    throw new TypeError(
      "Step distance must be an integer"
    );
  }

  const direction =
    validateCoordinate(vector);

  return add(
    coordinate,
    direction.map(
      component =>
        component * distance
    )
  );
}


function inBounds(
  coordinate,
  dimensions
) {
  const point =
    validateCoordinate(coordinate);
  const sizes =
    validateDimensions(
      dimensions,
      point.length
    );

  return point.every(
    (value, index) => {
      const size =
        sizes[index];

      return (
        size === null ||
        size === Infinity ||
        (
          value >= 0 &&
          value < size
        )
      );
    }
  );
}


function coordinateKey(
  coordinate,
  expectedDimension
) {
  return JSON.stringify(
    validateCoordinate(
      coordinate,
      expectedDimension
    )
  );
}


function coordinateFromKey(
  key,
  expectedDimension
) {
  if (typeof key !== "string") {
    throw new TypeError(
      "Coordinate key must be a string"
    );
  }

  let coordinate;

  try {
    coordinate =
      JSON.parse(key);
  } catch {
    throw new TypeError(
      "Invalid coordinate key"
    );
  }

  return validateCoordinate(
    coordinate,
    expectedDimension
  );
}


function* iterateCoordinates(
  dimensions
) {
  const sizes =
    validateDimensions(dimensions);

  if (
    sizes.some(
      size =>
        size === null ||
        size === Infinity
    )
  ) {
    throw new RangeError(
      "Coordinate iteration requires finite dimensions"
    );
  }

  if (sizes.length === 0) {
    yield [];
    return;
  }

  const coordinate =
    Array(sizes.length)
      .fill(0);

  while (true) {
    yield [...coordinate];

    let axis =
      coordinate.length - 1;

    while (axis >= 0) {
      coordinate[axis]++;

      if (
        coordinate[axis] <
        sizes[axis]
      ) {
        break;
      }

      coordinate[axis] = 0;
      axis--;
    }

    if (axis < 0) {
      return;
    }
  }
}


function createBoardShape(
  dimensions
) {
  const sizes =
    Object.freeze(
      validateDimensions(dimensions)
    );

  const bounded =
    sizes.every(
      size =>
        size !== null &&
        size !== Infinity
    );

  const shape = {
    dimensions: sizes,
    bounded,
    size:
      bounded
        ? sizes.reduce(
            (
              total,
              size
            ) =>
              total * size,
            1
          )
        : null,

    contains(coordinate) {
      return inBounds(
        coordinate,
        sizes
      );
    },

    key(coordinate) {
      if (
        !this.contains(
          coordinate
        )
      ) {
        throw new RangeError(
          "Coordinate is outside the board shape"
        );
      }

      return coordinateKey(
        coordinate,
        sizes.length
      );
    },

    coordinate(key) {
      const coordinate =
        coordinateFromKey(
          key,
          sizes.length
        );

      if (
        !this.contains(
          coordinate
        )
      ) {
        throw new RangeError(
          "Coordinate is outside the board shape"
        );
      }

      return coordinate;
    },

    coordinates() {
      return iterateCoordinates(
        sizes
      );
    }
  };

  return Object.freeze(shape);
}


class CoordinateMap {

  constructor(
    dimensions
  ) {
    this.shape =
      createBoardShape(
        dimensions
      );

    this.store =
      new Map();
  }


  get dimensions() {
    return this.shape
      .dimensions;
  }


  get size() {
    return this.store.size;
  }


  set(
    coordinate,
    value
  ) {
    this.store.set(
      this.shape.key(
        coordinate
      ),
      value
    );

    return this;
  }


  get(coordinate) {
    return this.store.get(
      this.shape.key(
        coordinate
      )
    );
  }


  has(coordinate) {
    return this.store.has(
      this.shape.key(
        coordinate
      )
    );
  }


  delete(coordinate) {
    return this.store.delete(
      this.shape.key(
        coordinate
      )
    );
  }


  clear() {
    this.store.clear();
  }


  *entries() {
    for (
      const [key, value]
      of this.store
    ) {
      yield [
        this.shape.coordinate(
          key
        ),
        value
      ];
    }
  }


  *keys() {
    for (
      const [coordinate]
      of this.entries()
    ) {
      yield coordinate;
    }
  }


  values() {
    return this.store
      .values();
  }


  [Symbol.iterator]() {
    return this.entries();
  }
}


function ray(
  origin,
  direction,
  options = {}
) {
  const start =
    validateCoordinate(origin);
  const vector =
    validateCoordinate(direction);

  assertSameDimension(start, vector);

  if (
    vector.every(
      value => value === 0
    )
  ) {
    throw new RangeError(
      "Ray direction cannot be zero"
    );
  }

  const bounds =
    options.bounds === undefined ||
    options.bounds === null
      ? null
      : validateDimensions(
          options.bounds,
          start.length
        );

  const maxSteps =
    options.maxSteps === undefined ||
    options.maxSteps === null
      ? null
      : options.maxSteps;

  if (
    maxSteps !== null &&
    (
      !Number.isInteger(maxSteps) ||
      maxSteps < 0
    )
  ) {
    throw new RangeError(
      "Ray maxSteps must be a non-negative integer"
    );
  }

  if (
    bounds === null &&
    maxSteps === null
  ) {
    throw new RangeError(
      "An unbounded ray requires maxSteps"
    );
  }

  if (
    bounds !== null &&
    maxSteps === null &&
    !bounds.some(
      (size, index) =>
        size !== null &&
        size !== Infinity &&
        vector[index] !== 0
    )
  ) {
    throw new RangeError(
      "Ray requires maxSteps along unbounded axes"
    );
  }

  const points = [];
  let current =
    options.includeOrigin
      ? start
      : step(start, vector);

  while (
    (
      maxSteps === null ||
      points.length < maxSteps
    ) &&
    (
      bounds === null ||
      inBounds(current, bounds)
    )
  ) {
    points.push(current);
    current =
      step(current, vector);
  }

  return points;
}


const Geometry = {
  validateCoordinate,
  validateDimensions,
  equals,
  add,
  difference,
  step,
  inBounds,
  coordinateKey,
  coordinateFromKey,
  iterateCoordinates,
  createBoardShape,
  CoordinateMap,
  ray
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    Geometry;
}


if (
  typeof window !==
    "undefined"
) {
  window.Geometry =
    Geometry;
}