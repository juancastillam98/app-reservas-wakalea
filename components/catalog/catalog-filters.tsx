"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import type { Region, Category } from "@/lib/types"

interface CatalogFiltersProps {
  regions: Region[]
  categories: Category[]
}

export function CatalogFilters({ regions, categories }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeRegion = searchParams.get("region") || ""
  const activeCategory = searchParams.get("category") || ""
  const activeSort = searchParams.get("sort") || "rating"
  const activePriceMax = searchParams.get("price_max") || ""

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 on filter change
      params.delete("page")
      router.push(`/experiencias?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = useCallback(() => {
    router.push("/experiencias")
  }, [router])

  const hasFilters = activeRegion || activeCategory || activePriceMax

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Region */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Region
        </legend>
        <div className="flex flex-col gap-1.5">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() =>
                updateFilter(
                  "region",
                  activeRegion === region.slug ? "" : region.slug
                )
              }
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeRegion === region.slug
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Category */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categoria
        </legend>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                updateFilter(
                  "category",
                  activeCategory === cat.slug ? "" : cat.slug
                )
              }
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Price range */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Precio maximo
        </legend>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "Hasta 50 EUR", value: "5000" },
            { label: "Hasta 75 EUR", value: "7500" },
            { label: "Hasta 100 EUR", value: "10000" },
            { label: "Sin limite", value: "" },
          ].map((opt) => (
            <button
              key={opt.value || "none"}
              type="button"
              onClick={() => updateFilter("price_max", opt.value)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activePriceMax === opt.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Sort */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ordenar por
        </legend>
        <select
          value={activeSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Ordenar resultados"
        >
          <option value="rating">Mejor valorados</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="newest">Mas recientes</option>
        </select>
      </fieldset>
    </div>
  )
}
