"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { CatalogFilters } from "./catalog-filters"
import type { Region, Category } from "@/lib/types"

interface MobileFiltersProps {
  regions: Region[]
  categories: Category[]
}

export function MobileFilters({ regions, categories }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                aria-label="Cerrar filtros"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <CatalogFilters regions={regions} categories={categories} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </>
  )
}
