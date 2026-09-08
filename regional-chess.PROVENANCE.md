# Regional chess provenance

This file records chronology evidence separately from engine support. A game being implemented by Fairy-Stockfish proves that a rules engine exists; it does **not** prove when or where the game originated.

## Courier Chess

**Atlas anchor:** c. 1202 CE  
**Confidence:** high for existence by the early 13th century; lower for exact origin date.

Wirnt von Gravenberg's *Wigalois*, generally dated c. 1202–1205, mentions the courier game in a way that assumes readers already know it. Fourteenth-century references by Heinrich von Beringen and Kunrat von Ammenhausen provide further medieval evidence. Gustavus Selenus later published a detailed rules account in 1616.

Sources:
- https://en.wikipedia.org/wiki/Courier_chess
- https://www.courierchess.com/thehistory.htm
- H. J. R. Murray, *A History of Chess* (1913), used as a secondary historical reference.

**Atlas policy:** 1202 is an evidence anchor, not an invention claim.

## Sittuyin

**Atlas catalogue anchor:** 1795 CE  
**Timeline eligibility:** withheld pending stronger earlier dated evidence.  
**Confidence:** high that the game is traditional Burmese chess; high uncertainty for its origin date.

Murray states that Burmese chess is of high antiquity but that no historical tradition of its origin had been recorded. He identifies the earliest detailed Western accounts as Michael Symes's embassy account from 1795 (published 1800) and Hiram Cox's description written in 1799 and published in 1801.

Source:
- H. J. R. Murray, *A History of Chess* (1913), chapter on chess in Further India; digitised copy: https://upload.wikimedia.org/wikipedia/commons/d/db/A_History_of_Chess_HJR_Murray.pdf

**Atlas policy:** do not convert the often-repeated “8th century” derivation narrative into a firm timeline date without direct evidence.

## Ouk Chatrang

**Atlas catalogue anchor:** 1687 CE, regional documentary context only  
**Timeline eligibility:** withheld.  
**Confidence:** high that Ouk/Ouk Chatrang is a Cambodian member of the Makruk-related chess family; high uncertainty for early chronology.

Reliefs at Angkor Wat, Preah Khan and Bayon are sometimes cited as 12th–13th-century evidence, but the depicted boards and pieces do not securely identify the modern game. They should therefore be treated as suggestive iconography, not as proof of Ouk Chatrang's rules or invention date. A reliable late-17th-century description by Simon de La Loubère concerns chess in Siam and provides regional context, not direct proof that Cambodian Ouk had its modern form in 1687.

Sources:
- https://de.wikipedia.org/wiki/Ouk_Chatrang (use as a pointer to the relief and La Loubère evidence; verify against primary/academic material before stronger claims)
- H. J. R. Murray, *A History of Chess* (1913), discussion of Southeast Asian chess families.

**Atlas policy:** no “Angkor invented Ouk” claim. Keep archaeological imagery and game-rule history as separate evidence layers.

## Shatar

**Atlas catalogue position:** modern documentary placeholder only  
**Timeline eligibility:** withheld.  
**Confidence:** high that Shatar is a traditional Mongolian chess game; insufficient evidence in this pass for a precise early date.

Murray includes Mongol *shatara* among the Asian chess-family games and notes its likely linguistic relationship to Sanskrit *chaturanga*, but this does not itself establish a date of origin. The present Atlas pass did not locate a sufficiently strong dated early source to justify a medieval timeline node.

Sources:
- H. J. R. Murray, *A History of Chess* (1913)
- Fairy-Stockfish's supported-games list confirms engine support, not chronology: https://github.com/fairy-stockfish/Fairy-Stockfish

**Atlas policy:** keep Shatar in the registry and engine inventory, but off the dated historical map until a defensible evidence anchor is attached.

## Engine implementation

Fairy-Stockfish lists Sittuyin, Shatar, Ouk Chatrang and Courier Chess among its regional/historical games and provides a browser-capable WebAssembly port. These implementations may be used for legality, AI opposition and analysis after the Atlas rules profile is checked against historical evidence.

Upstream:
- https://github.com/fairy-stockfish/Fairy-Stockfish
- https://github.com/fairy-stockfish/fairy-stockfish.wasm

## General rule

**Historical position, rules reconstruction, and software implementation are three different claims.**

A dated Atlas node must state which one it represents. Where chronology is weak, the game can exist in the registry and remain playable without being assigned a false ancient date on the civilisation map.
