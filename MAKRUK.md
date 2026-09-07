# Makruk — Thai Chess

Chess Atlas implements the core standard Makruk move rules as a playable historical/regional chess-family profile.

## Implemented

- 8×8 board.
- Pawns (bia) begin on each player's third rank and move one square forward, capturing one square diagonally forward; no initial double-step or en passant.
- Met (seed) moves one square diagonally, equivalent to the shatranj ferz.
- Khon (nobleman) moves one square diagonally or one square straight forward, equivalent in movement to a shogi silver general.
- Ma (horse) moves as the chess knight.
- Ruea (boat) moves as the chess rook.
- Khun (lord) moves as the chess king; checkmate wins and stalemate is a draw.
- Pawns promote on reaching the sixth rank to met/bia-ngai.
- Standard starting formation keeps each player's met on the lord's right, so the two lords begin on different files.

## Not yet enforced

Formal Makruk endgame counting rules are deliberately not approximated in this first core implementation. The profile records that boundary explicitly rather than inventing a simplified count. Sutra/free-move variants are also excluded from the standard profile.

## Research references

- H. J. R. Murray, *A History of Chess* (1913), historical discussion of Southeast Asian chess-family development.
- Makruk overview and rule summary: https://en.wikipedia.org/wiki/Makruk
- Historical Chess Variants reference compilation: https://www.chessvariants.com/books.dir/HistoricalChessVariants.pdf

The Atlas should keep the date of a rules reconstruction or software implementation distinct from claims about the game's historical origin.
