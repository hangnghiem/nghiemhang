"use client";

export function InstrumentVisual({
  glyph,
  silhouette = false,
  size = "xl",
}: {
  glyph: string;
  silhouette?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const sizes = {
    md: "text-5xl h-24",
    lg: "text-7xl h-36",
    xl: "text-8xl h-48",
  };
  return (
    <div
      className={`flex items-center justify-center w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 ${sizes[size]}`}
    >
      <span className={`select-none animate-float ${silhouette ? "silhouette" : ""}`}>
        {glyph}
      </span>
    </div>
  );
}
