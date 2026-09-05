"use strict";

const GeometryApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./geometry.js")
    : window.Geometry;


const vectorCache =
  new Map();


function validateDimension(
  dimension
) {
  if (
    !Number.isInteger(dimension) ||
    dimension < 1
  ) {
    throw new RangeError(
      "Vector dimension must be a positive integer"
    );
  }

  return dimension;
}


function cacheVectors(
  name,
  dimension,
  build
) {
  const size =
    validateDimension(dimension);
  const key =
    `${name}:${size}`;

  if (
    !vectorCache.has(key)
  ) {
    const vectors =
      build(size).map(
        vector =>
          Object.freeze(
            [...vector]
          )
      );

    vectorCache.set(
      key,
      Object.freeze(vectors)
    );
  }

  return vectorCache.get(key);
}


function axisVectors(
  dimension
) {
  return cacheVectors(
    "axis",
    dimension,
    size => {
      const vectors = [];

      for (
        let axis = 0;
        axis < size;
        axis++
      ) {
        for (
          const sign of [-1, 1]
        ) {
          const vector =
            Array(size).fill(0);
          vector[axis] =
            sign;
          vectors.push(vector);
        }
      }

      return vectors;
    }
  );
}


function diagonalVectors(
  dimension
) {
  return cacheVectors(
    "diagonal",
    dimension,
    size => {
      const vectors = [];

      for (
        let first = 0;
        first < size;
        first++
      ) {
        for (
          let second = first + 1;
          second < size;
          second++
        ) {
          for (
            const firstSign of [-1, 1]
          ) {
            for (
              const secondSign of [-1, 1]
            ) {
              const vector =
                Array(size).fill(0);
              vector[first] =
                firstSign;
              vector[second] =
                secondSign;
              vectors.push(vector);
            }
          }
        }
      }

      return vectors;
    }
  );
}


function queenVectors(
  dimension
) {
  return cacheVectors(
    "queen",
    dimension,
    size => {
      const vectors = [];
      const total =
        (3 ** size) - 1;

      for (
        let encoded = 1;
        encoded <= total;
        encoded++
      ) {
        let value =
          encoded;
        const vector =
          [];

        for (
          let axis = 0;
          axis < size;
          axis++
        ) {
          const digit =
            value % 3;
          value =
            Math.floor(
              value / 3
            );

          vector.push(
            digit === 0
              ? 0
              : digit === 1
                ? -1
                : 1
          );
        }

        vectors.push(vector);
      }

      return vectors;
    }
  );
}


function knightVectors(
  dimension
) {
  return cacheVectors(
    "knight",
    dimension,
    size => {
      const vectors = [];

      for (
        let major = 0;
        major < size;
        major++
      ) {
        for (
          let minor = 0;
          minor < size;
          minor++
        ) {
          if (major === minor) {
            continue;
          }

          for (
            const majorSign of [-1, 1]
          ) {
            for (
              const minorSign of [-1, 1]
            ) {
              const vector =
                Array(size).fill(0);
              vector[major] =
                2 * majorSign;
              vector[minor] =
                minorSign;
              vectors.push(vector);
            }
          }
        }
      }

      return vectors;
    }
  );
}


function movement(
  kind,
  vectors,
  options = {}
) {
  if (
    !Array.isArray(vectors) ||
    vectors.length === 0
  ) {
    throw new TypeError(
      "Movement vectors must be a non-empty array"
    );
  }

  const normalized =
    vectors.map(
      vector => {
        const value =
          GeometryApi
            .validateCoordinate(
              vector
            );

        if (
          value.every(
            component =>
              component === 0
          )
        ) {
          throw new RangeError(
            "Movement vectors cannot be zero"
          );
        }

        return Object.freeze(
          value
        );
      }
    );

  const captureMode =
    options.captureMode ||
    "any";

  if (
    ![
      "any",
      "only",
      "none"
    ].includes(captureMode)
  ) {
    throw new RangeError(
      "Invalid capture mode"
    );
  }

  return Object.freeze({
    kind,
    vectors:
      Object.freeze(
        normalized
      ),
    captureMode,
    maxSteps:
      options.maxSteps ===
        undefined
        ? null
        : options.maxSteps
  });
}


function pawn(
  options = {}
) {
  const {
    forwardAxis = 0,
    forwardDirection = 1,
    startingRank,
    startingCoordinate,
    oneStep = 1,
    multiStep = null,
    captureAxes = [],
    captureVectors = null,
    promotionBoundary
  } = options;

  if (
    !Number.isInteger(
      forwardAxis
    ) ||
    forwardAxis < 0
  ) {
    throw new RangeError(
      "Pawn forwardAxis must be a non-negative integer"
    );
  }

  if (
    ![
      -1,
      1
    ].includes(
      forwardDirection
    )
  ) {
    throw new RangeError(
      "Pawn forwardDirection must be -1 or 1"
    );
  }

  if (
    !Number.isInteger(oneStep) ||
    oneStep <= 0
  ) {
    throw new RangeError(
      "Pawn oneStep must be positive"
    );
  }

  if (
    multiStep !== null &&
    (
      !Number.isInteger(
        multiStep
      ) ||
      multiStep <= oneStep
    )
  ) {
    throw new RangeError(
      "Pawn multiStep must exceed oneStep"
    );
  }

  if (
    captureVectors !== null &&
    !Array.isArray(captureVectors)
  ) {
    throw new TypeError(
      "Pawn captureVectors must be an array"
    );
  }

  return Object.freeze({
    kind: "pawn",
    forwardAxis,
    forwardDirection,
    startingRank,
    startingCoordinate,
    oneStep,
    multiStep,
    captureAxes:
      Object.freeze(
        [...captureAxes]
      ),
    captureVectors:
      captureVectors === null
        ? null
        : Object.freeze(
            captureVectors.map(
              vector =>
                Object.freeze(
                  GeometryApi
                    .validateCoordinate(
                      vector
                    )
                )
            )
          ),
    promotionBoundary
  });
}


function step(
  vectors,
  options
) {
  return movement(
    "step",
    vectors,
    options
  );
}


function slide(
  vectors,
  options
) {
  return movement(
    "slide",
    vectors,
    options
  );
}


function jump(
  vectors,
  options
) {
  return movement(
    "jump",
    vectors,
    options
  );
}


function combine(
  ...movements
) {
  if (
    movements.some(
      value =>
        !value ||
        typeof value.kind !==
          "string"
    )
  ) {
    throw new TypeError(
      "combine expects movement definitions"
    );
  }

  return movements;
}


function shapeFor(
  shape,
  dimensions
) {
  if (
    shape &&
    typeof shape.contains ===
      "function"
  ) {
    return shape;
  }

  if (
    dimensions !== undefined
  ) {
    return GeometryApi
      .createBoardShape(
        dimensions
      );
  }

  throw new TypeError(
    "Move generation requires a board shape"
  );
}


function sideOf(
  piece
) {
  if (
    piece &&
    typeof piece ===
      "object"
  ) {
    return (
      piece.side ??
      piece.owner ??
      null
    );
  }

  if (
    typeof piece === "string" &&
    piece.length > 0
  ) {
    return piece[0];
  }

  return null;
}


function occupancyAt(
  occupancy,
  coordinate
) {
  if (
    !occupancy ||
    typeof occupancy.get !==
      "function"
  ) {
    throw new TypeError(
      "Occupancy must provide get(coordinate)"
    );
  }

  return occupancy.get(
    coordinate
  );
}


function canAdd(
  captureMode,
  occupied,
  friendly
) {
  if (friendly) {
    return false;
  }

  if (
    captureMode === "only"
  ) {
    return occupied;
  }

  if (
    captureMode === "none"
  ) {
    return !occupied;
  }

  return true;
}


function moveRecord(
  origin,
  destination,
  occupant,
  kind,
  promotion
) {
  return {
    from: [...origin],
    to: [...destination],
    kind,
    capture:
      Boolean(occupant),
    captured:
      occupant || null,
    promotion:
      Boolean(promotion)
  };
}


function generateStepLike(
  shape,
  origin,
  movementDefinition,
  occupancy,
  movingSide,
  sideReader
) {
  const moves = [];

  for (
    const vector
    of movementDefinition.vectors
  ) {
    const destination =
      GeometryApi.add(
        origin,
        vector
      );

    if (
      !shape.contains(
        destination
      )
    ) {
      continue;
    }

    const occupant =
      occupancyAt(
        occupancy,
        destination
      );
    const friendly =
      occupant !== undefined &&
      occupant !== null &&
      sideReader(occupant) ===
        movingSide;

    if (
      !canAdd(
        movementDefinition
          .captureMode,
        Boolean(occupant),
        friendly
      )
    ) {
      continue;
    }

    moves.push(
      moveRecord(
        origin,
        destination,
        occupant,
        movementDefinition.kind,
        false
      )
    );
  }

  return moves;
}


function generateSlide(
  shape,
  origin,
  movementDefinition,
  occupancy,
  movingSide,
  sideReader
) {
  if (
    !shape.bounded &&
    movementDefinition.maxSteps ===
      null
  ) {
    throw new RangeError(
      "Unbounded sliding movement requires maxSteps"
    );
  }

  const moves = [];

  for (
    const vector
    of movementDefinition.vectors
  ) {
    let destination =
      GeometryApi.step(
        origin,
        vector
      );
    let steps = 0;

    while (
      shape.contains(
        destination
      ) &&
      (
        movementDefinition
          .maxSteps === null ||
        steps <
          movementDefinition
            .maxSteps
      )
    ) {
      const occupant =
        occupancyAt(
          occupancy,
          destination
        );
      const occupied =
        occupant !== undefined &&
        occupant !== null;
      const friendly =
        occupied &&
        sideReader(occupant) ===
          movingSide;

      if (
        canAdd(
          movementDefinition
            .captureMode,
          occupied,
          friendly
        )
      ) {
        moves.push(
          moveRecord(
            origin,
            destination,
            occupant,
            "slide",
            false
          )
        );
      }

      if (occupied) {
        break;
      }

      destination =
        GeometryApi.step(
          destination,
          vector
        );
      steps++;
    }
  }

  return moves;
}


function matchesStartingPoint(
  origin,
  definition
) {
  if (
    Array.isArray(
      definition.startingCoordinate
    )
  ) {
    return GeometryApi.equals(
      origin,
      definition.startingCoordinate
    );
  }

  const rank =
    definition.startingRank ??
    definition.startingCoordinate;

  return (
    rank !== undefined &&
    origin[
      definition.forwardAxis
    ] === rank
  );
}


function generatePawn(
  shape,
  origin,
  definition,
  occupancy,
  movingSide,
  sideReader
) {
  const moves = [];
  const forward =
    Array(
      origin.length
    ).fill(0);
  forward[
    definition.forwardAxis
  ] =
    definition.forwardDirection;

  const addForward =
    distance => {
      const vector =
        forward.map(
          component =>
            component * distance
        );
      const destination =
        GeometryApi.add(
          origin,
          vector
        );

      if (
        !shape.contains(
          destination
        )
      ) {
        return false;
      }

      const occupant =
        occupancyAt(
          occupancy,
          destination
        );

      if (
        occupant !== undefined &&
        occupant !== null
      ) {
        return false;
      }

      moves.push(
        moveRecord(
          origin,
          destination,
          null,
          "pawn",
          definition.promotionBoundary !==
            undefined &&
            destination[
              definition.forwardAxis
            ] ===
              definition.promotionBoundary
        )
      );

      return true;
    };

  if (
    addForward(
      definition.oneStep
    ) &&
    definition.multiStep !==
      null &&
    matchesStartingPoint(
      origin,
      definition
    )
  ) {
    addForward(
      definition.multiStep
    );
  }

  const captureVectors =
    definition.captureVectors ||
    definition.captureAxes.flatMap(
      axis => {
        const vectors = [];

        for (
          const sign of [-1, 1]
        ) {
          const vector =
            [...forward];
          vector[
            axis
          ] += sign;
          vectors.push(vector);
        }

        return vectors;
      }
    );

  for (
    const vector of captureVectors
  ) {
    const destination =
      GeometryApi.add(
        origin,
        vector
      );

    if (
      !shape.contains(
        destination
      )
    ) {
      continue;
    }

    const occupant =
      occupancyAt(
        occupancy,
        destination
      );
    const occupied =
      occupant !== undefined &&
      occupant !== null;
    const friendly =
      occupied &&
      sideReader(occupant) ===
        movingSide;

    if (
      !occupied ||
      friendly
    ) {
      continue;
    }

    moves.push(
      moveRecord(
        origin,
        destination,
        occupant,
        "pawn",
        definition.promotionBoundary !==
          undefined &&
          destination[
            definition.forwardAxis
          ] ===
            definition.promotionBoundary
      )
    );
  }

  return moves;
}


function generateMoves({
  shape,
  dimensions,
  origin,
  movement: movementDefinitions,
  occupancy,
  side,
  piece,
  sideOf: customSideOf
}) {
  const boardShape =
    shapeFor(
      shape,
      dimensions
    );
  const start =
    GeometryApi.validateCoordinate(
      origin,
      boardShape.dimensions.length
    );

  if (
    !boardShape.contains(start)
  ) {
    throw new RangeError(
      "Origin is outside the board shape"
    );
  }

  const definitions =
    Array.isArray(
      movementDefinitions
    )
      ? movementDefinitions
      : [movementDefinitions];
  const sideReader =
    customSideOf ||
    sideOf;
  const movingSide =
    side ??
    sideReader(piece);

  if (
    movingSide === null ||
    movingSide === undefined
  ) {
    throw new TypeError(
      "Move generation requires a moving side"
    );
  }

  return definitions.flatMap(
    definition => {
      if (
        !definition ||
        typeof definition.kind !==
          "string"
      ) {
        throw new TypeError(
          "Invalid movement definition"
        );
      }

      if (
        definition.kind ===
        "pawn"
      ) {
        return generatePawn(
          boardShape,
          start,
          definition,
          occupancy,
          movingSide,
          sideReader
        );
      }

      if (
        definition.kind ===
        "slide"
      ) {
        return generateSlide(
          boardShape,
          start,
          definition,
          occupancy,
          movingSide,
          sideReader
        );
      }

      if (
        definition.kind ===
          "step" ||
        definition.kind ===
          "jump"
      ) {
        return generateStepLike(
          boardShape,
          start,
          definition,
          occupancy,
          movingSide,
          sideReader
        );
      }

      throw new RangeError(
        `Unknown movement kind: ${definition.kind}`
      );
    }
  );
}


const vectors = {
  rook: axisVectors,
  bishop: diagonalVectors,
  queen: queenVectors,
  king: dimension =>
    cacheVectors(
      "king",
      dimension,
      size => {
        const all =
          queenVectors(size);
        return all.filter(
          vector =>
            vector.every(
              component =>
                Math.abs(
                  component
                ) <= 1
            )
        );
      }
    ),
  knight: knightVectors
};


const RuleKernel = {
  vectors,
  step,
  slide,
  jump,
  pawn,
  combine,
  generateMoves
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    RuleKernel;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasRules =
    RuleKernel;
}