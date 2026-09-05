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