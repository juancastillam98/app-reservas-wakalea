import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Region } from "@/lib/types"

interface RegionsSectionProps {
  regions: Region[]
}

export function RegionsSection({ regions }: RegionsSectionProps) {
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Explora por region
        </h2>
        <p className="mt-3 text-pretty text-base text-muted-foreground md:text-lg">
          Tres destinos unicos con paisajes, cultura y gastronomia inigualables.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {regions.map((region) => (
          <Link
            key={region.id}
            href={`/experiencias?region=${region.slug}`}
            className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl md:aspect-[4/5]"
          >
            <Image
              src={region.image_url || "/placeholder.jpg"}
              alt={region.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="relative z-10 mt-auto flex w-full items-end justify-between p-6">
              <div>
                <h3 className="text-xl font-bold text-primary-foreground">
                  {region.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-primary-foreground/80">
                  {region.description}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm transition-colors group-hover:bg-primary">
                <ArrowRight className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
