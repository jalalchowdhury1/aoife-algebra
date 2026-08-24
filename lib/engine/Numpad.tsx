"use client";

interface NumpadProps {
  value: string;
  onDigit: (d: string) => void;
  onSign: () => void; // toggle leading minus — negatives exist from World 3 on
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Numpad({ value, onDigit, onSign, onClear, onSubmit, disabled }: NumpadProps) {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto w-full">
      {DIGITS.map((d) => (
        <button
          key={d}
          type="button"
          className="btn-numpad h-16"
          onClick={() => onDigit(d)}
          disabled={disabled}
        >
          {d}
        </button>
      ))}
      <button
        type="button"
        className="btn-numpad btn-numpad-sign h-16 text-2xl"
        onClick={onSign}
        disabled={disabled}
        aria-label="minus sign"
      >
        −
      </button>
      <button
        type="button"
        className="btn-numpad h-16"
        onClick={() => onDigit("0")}
        disabled={disabled}
      >
        0
      </button>
      <button
        type="button"
        className="btn-numpad btn-numpad-clear h-16 text-xl"
        onClick={onClear}
        disabled={disabled}
      >
        C
      </button>
      <button
        type="button"
        className="btn-numpad btn-numpad-submit h-16 col-span-3"
        onClick={onSubmit}
        disabled={disabled || value.length === 0 || value === "-"}
        aria-label="submit"
      >
        ✔︎
      </button>
    </div>
  );
}
