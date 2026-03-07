import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ImageGallery } from "@/components/product/image-gallery"
import { BookingCard } from "@/components/product/booking-card"
import { IncludesList } from "@/components/product/includes-list"
import { SocialProof } from "@/components/product/social-proof"
import { ExperienceCard } from "@/components/experience-card"
import { formatDuration, formatRating } from "@/lib/format"
import {
  Clock,
  MapPin,
  Star,
  Users,
  CalendarDays,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import type { Experience } from "@/lib/types"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("experiences")
    .select("title, short_description")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "No encontrado — Wakalea" }

  return {
    title: `${data.title} — Wakalea`,
    description: data.short_description || undefined,
  }
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch experience with relations
  const { data: experience } = await supabase
    .from("experiences")
    .select("*, regions(*), categories(*)")
    .eq("slug", slug)
    .single()

  if (!experience) notFound()

  const exp = experience as Experience

  // Fetch related experiences (same region, different slug)
  const { data: related } = await supabase
    .from("experiences")
    .select("*, regions(*), categories(*)")
    .eq("region_id", exp.region_id)
    .neq("slug", slug)
    .limit(3)

  return (
    <div className="mx-auto max-w-8xl px-4 py-6 lg:px-8 lg:py-10">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/experiencias" className="hover:text-foreground">
          Experiencias
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{exp.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Left column — Main content */}
        <div className="flex-1">
          {/* Gallery */}
          <ImageGallery images={exp.images} title={exp.title} />

          {/* Title block */}
          <div className="mt-6">
            {exp.categories && (
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                {exp.categories.name}
              </span>
            )}
            <h1 className="mt-1 text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {exp.title}
            </h1>
            {exp.subtitle && (
              <p className="mt-1.5 text-pretty text-base text-muted-foreground">
                {exp.subtitle}
              </p>
            )}

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <strong className="font-semibold text-foreground">
                  {formatRating(exp.rating)}
                </strong>
                {`(${exp.review_count} opiniones)`}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(exp.duration_hours)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {`Max ${exp.max_guests} personas`}
              </span>
              {exp.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {exp.location}
                </span>
              )}
              {exp.min_age > 0 && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {`Edad min: ${exp.min_age} anos`}
                </span>
              )}
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-6">
            <SocialProof />
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              Sobre esta experiencia
            </h2>
            <div className="prose-sm max-w-none leading-relaxed text-foreground/80">
              <p>{exp.description}</p>
            </div>
          </div>

          {/* Highlights */}
          {exp.highlights.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Lo mas destacado
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {exp.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Includes / Excludes */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              Que esta incluido
            </h2>
            <IncludesList includes={exp.includes} excludes={exp.excludes} />
          </div>

          {/* Itinerary */}
          {exp.itinerary && exp.itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Itinerario
              </h2>
              <div className="flex flex-col gap-4">
                {exp.itinerary.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {step.time}
                      </div>
                      {i < exp.itinerary.length - 1 && (
                        <div className="mt-1 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-4">
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — Booking card (sticky) */}
        <aside className="w-full shrink-0 lg:w-80 xl:w-96">
          <div className="sticky top-20">
            <BookingCard experience={exp} />
          </div>
        </aside>
      </div>

      {/* Related experiences */}
      {related && (related as Experience[]).length > 0 && (
        <section className="mt-16 border-t border-border/60 pt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
            Experiencias relacionadas
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(related as Experience[]).map((r) => (
              <ExperienceCard key={r.id} experience={r} />
            ))}
          </div>
        </section>
      )}


    </div>
  )
}
