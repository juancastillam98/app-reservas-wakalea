import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ExperienceCard } from "@/components/experience-card"
import type { Experience } from "@/lib/types"

interface FeaturedSectionProps {
  experiences: Experience[]
}

export function FeaturedSection({ experiences }: FeaturedSectionProps) {
  return (
    <section className="bg-secondary/30 py-16 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Experiencias destacadas
            </h2>
            <p className="mt-3 text-pretty text-base text-muted-foreground md:text-lg">
              Las mas valoradas por nuestros viajeros esta temporada.
            </p>
          </div>
          <Link
            href="/experiencias"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  )
}
