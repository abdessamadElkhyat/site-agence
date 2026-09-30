import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <section className="bg-ink pb-16 pt-32 text-ivory md:pb-24 md:pt-40">
      <Container>
        <p className="text-xs tracking-[0.2em] text-brass uppercase">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95]">{title}</h1>
        {text ? <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/75">{text}</p> : null}
      </Container>
    </section>
  );
}
