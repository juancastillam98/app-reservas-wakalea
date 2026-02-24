import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ExperienceCard } from "@/components/experience-card"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { MobileFilters } from "@/components/catalog/mobile-filters"
import type { Region, Category, Experience } from "@/lib/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experiencias — Wakalea",
  description:
    "Explora todas nuestras experiencias de ecoturismo, agroturismo y turismo activo en Espana.",
}

interface PageProps {
  searchParams: Promise<{
    region?: string
    category?: string
    sort?: string
    price_max?: string
    q?: string
  }>
}

export default async function ExperienciasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch filter data
  const [{ data: regions }, { data: categories }] = await Promise.all([
    supabase.from("regions").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ])

  // Build query
  let query = supabase
    .from("experiences")
    .select("*, regions(*), categories(*)")

  // Apply filters
  if (params.region) {
    const region = (regions as Region[])?.find(
      (r) => r.slug === params.region
    )
    if (region) query = query.eq("region_id", region.id)
  }

  if (params.category) {
    const category = (categories as Category[])?.find(
      (c) => c.slug === params.category
    )
    if (category) query = query.eq("category_id", category.id)
  }

  if (params.price_max) {
    query = query.lte("price_cents", parseInt(params.price_max))
  }

  // Sort
  switch (params.sort) {
    case "price_asc":
      query = query.order("price_cents", { ascending: true })
      break
    case "price_desc":
      query = query.order("price_cents", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("rating", { ascending: false })
  }

  const { data: experiences } = await query

  const resultCount = (experiences as Experience[])?.length || 0

  return (
    <div className="mx-auto max-w-8xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Experiencias
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {resultCount === 1
            ? "1 experiencia encontrada"
            : `${resultCount} experiencias encontradas`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <Suspense fallback={null}>
              <CatalogFilters
                regions={(regions as Region[]) || []}
                categories={(categories as Category[]) || []}
              />
            </Suspense>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile filter trigger */}
          <div className="mb-6 lg:hidden">
            <Suspense fallback={null}>
              <MobileFilters
                regions={(regions as Region[]) || []}
                categories={(categories as Category[]) || []}
              />
            </Suspense>
          </div>

          {/* Results grid */}
          {resultCount > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(experiences as Experience[]).map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
              <p className="text-lg font-medium text-foreground">
                No se encontraron experiencias
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba a cambiar los filtros o explora todas las experiencias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
