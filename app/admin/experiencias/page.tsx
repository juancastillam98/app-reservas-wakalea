import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"
import { formatPrice, formatDuration, formatRating } from "@/lib/format"
import type { Experience, Region, Category } from "@/lib/types"
import { DeleteExperienceButton } from "@/components/admin/delete-experience-button"

export default async function AdminExperienciasPage() {
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*, regions(name), categories(name)")
    .order("created_at", { ascending: false })

  const typedExperiences = (experiences ?? []) as (Experience & {
    regions: { name: string }
    categories: { name: string }
  })[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Experiencias
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {typedExperiences.length} experiencias en el catalogo.
          </p>
        </div>
        <Link
          href="/admin/experiencias/nueva"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva experiencia
        </Link>
      </div>

      {typedExperiences.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No hay experiencias creadas.</p>
          <Link
            href="/admin/experiencias/nueva"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Crear primera experiencia
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Experiencia
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                    Region
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Precio
                  </th>
                  <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground sm:table-cell">
                    Duracion
                  </th>
                  <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground sm:table-cell">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedExperiences.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {exp.images?.[0] && (
                          <img
                            src={exp.images[0]}
                            alt=""
                            className="h-10 w-14 shrink-0 rounded-lg object-cover"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {exp.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {exp.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {exp.regions?.name}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {exp.categories?.name}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatPrice(exp.price_cents)}
                    </td>
                    <td className="hidden px-4 py-3 text-center text-muted-foreground sm:table-cell">
                      {formatDuration(exp.duration_hours)}
                    </td>
                    <td className="hidden px-4 py-3 text-center text-muted-foreground sm:table-cell">
                      {formatRating(exp.rating)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {exp.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <Eye className="h-3 w-3" /> Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> Oculta
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/experiencias/${exp.id}/editar`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          aria-label={`Editar ${exp.title}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <DeleteExperienceButton
                          experienceId={exp.id}
                          experienceTitle={exp.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
