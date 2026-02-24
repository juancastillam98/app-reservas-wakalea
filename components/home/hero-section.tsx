import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import type { Region } from "@/lib/types"

interface HeroSectionProps {
  regions: Region[]
}

export function HeroSection({ regions }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-home.jpg"
        alt="Costa del Pais Vasco al amanecer"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-8xl flex-col items-center px-4 py-24 text-center lg:px-8">
        <span className="mb-4 inline-block rounded-full border border-primary-foreground/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary-foreground/90">
          Ecoturismo en Espana
        </span>

        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Vive experiencias que conectan con la naturaleza
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 md:text-lg">
          Descubre los paisajes mas autenticos de Espana: Pais Vasco, Andalucia
          y Comunidad Valenciana. Reserva tu aventura sostenible.
        </p>

        {/* Search bar */}
        <div className="mt-10 w-full max-w-2xl">
          <div className="flex flex-col gap-3 rounded-2xl bg-card/95 p-3 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Busca kayak, senderismo, gastronomia..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Buscar experiencias"
              />
            </div>
            <select
              className="rounded-xl bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Seleccionar region"
              defaultValue=""
            >
              <option value="" disabled>
                Region
              </option>
              {regions.map((region) => (
                <option key={region.id} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
            <Link
              href="/experiencias"
              className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explorar
            </Link>
          </div>
        </div>

        {/* Trust numbers */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/80">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">+200</p>
            <p className="text-xs uppercase tracking-wider">Experiencias</p>
          </div>
          <div className="h-8 w-px bg-primary-foreground/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">100%</p>
            <p className="text-xs uppercase tracking-wider">Sostenible</p>
          </div>
          <div className="h-8 w-px bg-primary-foreground/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">4,8</p>
            <p className="text-xs uppercase tracking-wider">Valoracion media</p>
          </div>
        </div>
      </div>
    </section>
  )
}
