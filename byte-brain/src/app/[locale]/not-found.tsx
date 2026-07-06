import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("nav");
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        A página que procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
      >
        {t("cta")} →
      </Link>
    </div>
  );
}
