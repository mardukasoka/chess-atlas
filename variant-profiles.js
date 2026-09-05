"use strict";

const VariantRulesApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;


const reference4D =
  Object.freeze({
    id: "reference-4d",
    name: "4D rule reference",
    playable: false,
    dimensions:
      Object.freeze(
        [4, 4, 2, 2]
      ),
    pieces:
      Object.freeze({
        rook:
          VariantRulesApi.slide(
            VariantRulesApi
              .vectors.rook(4)
          ),
        bishop:
          VariantRulesApi.slide(
            VariantRulesApi
              .vectors.bishop(4)
          ),
        queen:
          VariantRulesApi.slide(
            VariantRulesApi
              .vectors.queen(4)
          ),
        king:
          VariantRulesApi.step(
            VariantRulesApi
              .vectors.king(4)
          ),
        knight:
          VariantRulesApi.jump(
            VariantRulesApi
              .vectors.knight(4)
          )
      }),
    startingState:
      Object.freeze([
        Object.freeze({
          coordinate:
            Object.freeze(
              [0, 0, 0, 0]
            ),
          piece:
            Object.freeze({
              side: "white",
              type: "king"
            })
        }),
        Object.freeze({
          coordinate:
            Object.freeze(
              [3, 3, 1, 1]
            ),
          piece:
            Object.freeze({
              side: "black",
              type: "king"
            })
        })
      ]),
    specialRules:
      Object.freeze([])
  });


const VariantProfiles = {
  reference4D
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    VariantProfiles;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasVariantProfiles =
    VariantProfiles;
}