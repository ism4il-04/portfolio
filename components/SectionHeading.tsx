import { Reveal } from "./Reveal";

export function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="mb-10 flex items-center gap-4">
        <span className="font-mono text-sm text-accent">{index}</span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <span className="font-mono text-muted">{"// "}</span>
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-line-2 to-transparent" />
      </div>
    </Reveal>
  );
}
