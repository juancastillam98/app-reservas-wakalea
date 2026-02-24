import Link from "next/link"
import { ArrowRight, Sun } from "lucide-react"

export function SeasonalBanner() {
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 py-12 md:px-12 md:py-16">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-primary-foreground/5" />

        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary-foreground/80" />
              <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
                Primavera 2026
              </span>
            </div>
            <h2 className="text-balance text-2xl font-bold text-primary-foreground md:text-3xl">
              Ofertas de temporada: hasta un 15% de descuento
            </h2>
            <p className="mt-2 max-w-lg text-pretty text-sm text-primary-foreground/70">
              Reserva ahora las mejores experiencias de primavera en Pais Vasco,
              Andalucia y Comunidad Valenciana.
            </p>
          </div>
          <Link
            href="/experiencias"
            className="flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Ver ofertas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
