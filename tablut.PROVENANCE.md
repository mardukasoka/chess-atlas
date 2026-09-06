# Tablut provenance

## Historical anchor

**Game:** Tablut, a Sámi tafl game recorded by Carl Linnaeus during his Lapland journey in 1732.

**Primary historical witness:** Linnaeus, *Iter Lapponicum* (1732 manuscript). The nineteenth-century English publication/translation introduced errors, so this implementation uses the corrected translation by Finnish linguist Olli Salmi (2013; updated 2015) as its interpretive basis.

## Implemented profile

Profile id: `tablut-linnaeus-1732-salmi`

The implementation models:

- a 9×9 board;
- 16 Muscovite attackers;
- 8 Swedish defenders plus one king;
- attackers moving first;
- orthogonal rook-like movement without jumping;
- the central royal fort / throne (`konakis` / `gånågis`) as a restricted square;
- custodial capture of ordinary soldiers;
- defender victory when the king escapes to the board edge;
- attacker victory by capturing the king;
- stronger king-capture conditions on or beside the throne.

## Reconstruction boundary

Linnaeus's short account does not resolve every implementation detail with modern rules-engine precision. In particular, later tafl reconstructions differ over the throne's treatment after the king leaves it and over some king-capture/custodial-capture edge cases. This profile therefore records its interpretation explicitly rather than presenting it as a universal Hnefatafl/Tafl ruleset.

The engine treats the vacated throne as a blocked royal fort and as hostile support for custodial capture. The king may not re-enter it in this profile. Older medieval Hnefatafl variants should be represented by separate named reconstruction profiles rather than silently inheriting these rules.

## Sources

- Carl Linnaeus, *Iter Lapponicum* (1732), Tablut notes.
- Olli Salmi, "Tablut: Translation of Linnaeus's rules for the Saami game" (2013; updated 18 June 2015), https://www.tsalo.fi/Tablut.html
- Aage Nielsen, comparative translations of Linnaeus's Tablut description, https://aagenielsen.dk/tablut_translations.php

Historical date and provenance describe the documented game tradition; they do not imply that every engine-level ambiguity was explicitly specified by Linnaeus.