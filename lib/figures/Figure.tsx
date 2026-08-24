import type { FigureSpec } from "../types";
import { Boxes } from "./Boxes";
import { NumberLine } from "./NumberLine";
import { Balance } from "./Balance";
import { Machine } from "./Machine";
import { AlgLine } from "./AlgLine";

export function Figure({ spec }: { spec?: FigureSpec }) {
  if (!spec) return null;
  switch (spec.kind) {
    case "boxes":
      return <Boxes spec={spec} />;
    case "numline":
      return <NumberLine spec={spec} />;
    case "balance":
      return <Balance spec={spec} />;
    case "machine":
      return <Machine spec={spec} />;
    case "line":
      return <AlgLine spec={spec} />;
    default:
      return null;
  }
}
