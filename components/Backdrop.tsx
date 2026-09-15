// Fixed values rather than random, so server and client markup match and the
// rhythm stays deliberate.
const STREAMS = [
  { left: "6%", delay: "0s", duration: "10s", height: "26vh", color: "var(--color-accent)" },
  { left: "15%", delay: "-7s", duration: "15s", height: "18vh", color: "var(--color-violet)" },
  { left: "27%", delay: "-3s", duration: "12s", height: "30vh", color: "var(--color-accent)" },
  { left: "38%", delay: "-11s", duration: "9s", height: "20vh", color: "var(--color-term)" },
  { left: "49%", delay: "-5s", duration: "17s", height: "24vh", color: "var(--color-violet)" },
  { left: "61%", delay: "-1s", duration: "11s", height: "28vh", color: "var(--color-accent)" },
  { left: "72%", delay: "-9s", duration: "14s", height: "16vh", color: "var(--color-term)" },
  { left: "83%", delay: "-4s", duration: "10s", height: "32vh", color: "var(--color-accent)" },
  { left: "93%", delay: "-13s", duration: "16s", height: "22vh", color: "var(--color-violet)" },
];

const GLYPHS = [
  { char: "{ }", left: "11%", delay: "0s", duration: "26s", size: "1.4rem" },
  { char: "</>", left: "24%", delay: "-9s", duration: "31s", size: "1.8rem" },
  { char: "=>", left: "35%", delay: "-17s", duration: "24s", size: "1.2rem" },
  { char: "01", left: "46%", delay: "-4s", duration: "29s", size: "1.5rem" },
  { char: "[ ]", left: "57%", delay: "-22s", duration: "27s", size: "1.3rem" },
  { char: "&&", left: "66%", delay: "-12s", duration: "33s", size: "1.6rem" },
  { char: "();", left: "78%", delay: "-6s", duration: "25s", size: "1.4rem" },
  { char: "/*", left: "88%", delay: "-19s", duration: "30s", size: "1.7rem" },
];

export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Oversized so the panning grid never exposes an edge. */}
      <div className="absolute -inset-16 bg-grid opacity-50 animate-grid-pan [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_78%)]" />

      <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-accent/15 blur-[120px] animate-orbit" />
      <div className="absolute top-1/3 -right-40 size-[30rem] rounded-full bg-violet/15 blur-[120px] animate-orbit [animation-delay:-7s]" />
      <div className="absolute -bottom-32 left-1/4 size-[26rem] rounded-full bg-term/10 blur-[120px] animate-orbit [animation-delay:-13s]" />

      {STREAMS.map((stream) => (
        <span
          key={stream.left}
          className="absolute top-0 w-px animate-stream"
          style={{
            left: stream.left,
            height: stream.height,
            animationDelay: stream.delay,
            animationDuration: stream.duration,
            background: `linear-gradient(to bottom, transparent, ${stream.color}, transparent)`,
            boxShadow: `0 0 6px ${stream.color}`,
          }}
        />
      ))}

      {GLYPHS.map((glyph) => (
        <span
          key={glyph.char + glyph.left}
          className="absolute bottom-0 font-mono text-accent/25 animate-glyph select-none"
          style={{
            left: glyph.left,
            fontSize: glyph.size,
            animationDelay: glyph.delay,
            animationDuration: glyph.duration,
          }}
        >
          {glyph.char}
        </span>
      ))}

      {/* Slow sweep across the whole page, like a terminal refresh. */}
      <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
    </div>
  );
}
