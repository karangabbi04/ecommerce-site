// components/home/why-choose-us/section-heading.tsx

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeading({
  badge,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
        {badge}
      </p>

      <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-zinc-600">
        {description}
      </p>
    </div>
  );
}