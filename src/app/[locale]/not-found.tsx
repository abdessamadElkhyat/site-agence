import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <Container className="py-40">
      <p className="text-xs tracking-[0.2em] text-brass uppercase">404</p>
      <h1 className="mt-4 font-serif text-5xl">Cette page n&apos;existe pas.</h1>
      <Link href="/" className="mt-6 inline-block text-accent">Retour à l&apos;accueil</Link>
    </Container>
  );
}
