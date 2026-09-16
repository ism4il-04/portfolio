"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);

    // IntersectionObserver never calls back in a document that isn't being
    // rendered — a background tab, or the headless screenshotters behind link
    // previews — which would leave the hero blank. Content already on screen at
    // mount is revealed by a timer instead; below-the-fold content still waits
    // for a scroll. (requestAnimationFrame would be paused there too.)
    const rect = element.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
    const timer = onScreen ? window.setTimeout(() => setVisible(true), 60) : 0;

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={
        { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
