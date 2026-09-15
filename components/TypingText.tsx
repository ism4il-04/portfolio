"use client";

import { useEffect, useState } from "react";

export function TypingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    setCount(0);
    const id = setInterval(() => {
      setCount((value) => {
        if (value >= text.length) {
          clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, 26);

    return () => clearInterval(id);
  }, [text]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <span className="animate-blink text-accent" aria-hidden="true">
        ▌
      </span>
    </span>
  );
}
