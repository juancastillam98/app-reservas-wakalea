import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Star, Users } from "lucide-react"
import { formatPrice, formatDuration, formatRating, getDiscountPercent } from "@/lib/format"
import type { Experience } from "@/lib/types"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const hasDiscount =
    experience.original_price_cents !== null &&
    experience.original_price_cents > experience.price_cents

  return (
    <Link
      href={`/experiencias/${experience.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={experience.images[0] || "/placeholder.jpg"}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {experience.is_featured && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              Destacado
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              {`-${getDiscountPercent(experience.original_price_cents!, experience.price_cents)}%`}
            </span>
          )}
        </div>
        {/* Region badge */}
        {experience.regions && (
          <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {experience.regions.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {experience.categories && (
          <span className="mb-1.5 text-xs font-medium uppercase tracking-wider text-primary">
            {experience.categories.name}
          </span>
        )}

        <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2 text-balance">
          {experience.title}
        </h3>

        {experience.short_description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {experience.short_description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(experience.duration_hours)}
          </span>
          {experience.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {experience.location.split(",")[0]}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {`Max ${experience.max_guests}`}
          </span>
        </div>

        {/* Price + Rating */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">
              {formatRating(experience.rating)}
            </span>
            <span className="text-xs text-muted-foreground">
              {`(${experience.review_count})`}
            </span>
          </div>
          <div className="text-right">
            {hasDiscount && (
              <span className="block text-xs text-muted-foreground line-through">
                {formatPrice(experience.original_price_cents!)}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              {formatPrice(experience.price_cents)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">/persona</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
