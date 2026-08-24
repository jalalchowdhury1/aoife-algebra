import type { ReactNode } from "react";

// Display seam shared by every engine call site. This app uses it to make sure
// a negative number is always SHOWN with a proper minus sign (−3, not -3),
// wherever it came from — authored text or String(step.answer).
export function renderRich(text: string): ReactNode {
  return text.replace(/-(?=\d)/g, "−");
}
