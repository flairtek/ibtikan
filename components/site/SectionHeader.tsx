export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div
      className={`mb-10 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={`font-serif text-3xl leading-tight sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-4 leading-relaxed ${light ? "text-white/75" : "text-muted"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
