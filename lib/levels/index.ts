import type { Framework } from "../types";
import { FAM } from "./shared";
import { whatsInTheBox } from "./whats-in-the-box";
import { boxGetsAName } from "./box-gets-a-name";
import { sameLetterSameNumber } from "./same-letter-same-number";
import { wordsToCode } from "./words-to-code";
import { theHiddenTimes } from "./the-hidden-times";
import { belowZero } from "./below-zero";
import { hopPastZero } from "./hop-past-zero";
import { addingCold } from "./adding-cold";
import { theDoubleFlip } from "./the-double-flip";
import { coldTimes } from "./cold-times";
import { feedTheBox } from "./feed-the-box";
import { matchingPieces } from "./matching-pieces";
import { shareItOut } from "./share-it-out";
import { packTheBags } from "./pack-the-bags";
import { keepItLevel } from "./keep-it-level";
import { undoTheTimes } from "./undo-the-times";
import { twoLocks } from "./two-locks";
import { crackTheBag } from "./crack-the-bag";
import { theMachine } from "./the-machine";
import { findTheRule } from "./find-the-rule";
import { detectiveCases } from "./detective-cases";

// Ladder order — Level 1..21, concrete first, one new idea per level.
// The home page rings the first level without a solo pass. Nothing is locked.
//
// Adding or removing a level means updating THIS array and the count assertion
// in levels.test.ts together — LEVEL_NUM and "start here" both come from
// array position.
export const LEVELS: Framework[] = [
  whatsInTheBox,
  boxGetsAName,
  sameLetterSameNumber,
  wordsToCode,
  theHiddenTimes,
  belowZero,
  hopPastZero,
  addingCold,
  theDoubleFlip,
  coldTimes,
  feedTheBox,
  matchingPieces,
  shareItOut,
  packTheBags,
  keepItLevel,
  undoTheTimes,
  twoLocks,
  crackTheBag,
  theMachine,
  findTheRule,
  detectiveCases,
];

export const FAMILIES = [FAM.box, FAM.code, FAM.zero, FAM.shop, FAM.crack, FAM.machine];

export const LEVEL_NUM: Record<string, number> = Object.fromEntries(
  LEVELS.map((f, i) => [f.id, i + 1]),
);

export const byId = (id: string) => LEVELS.find((f) => f.id === id);
