import { createClient } from "@/lib/supabase/server"
import { ExperienceForm } from "@/components/admin/experience-form"
import type { Region, Category } from "@/lib/types"

export default async function NuevaExperienciaPage() {
  const supabase = await createClient()

  const [regionsRes, categoriesRes] = await Promise.all([
    supabase.from("regions").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nueva experiencia
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rellena los datos para crear una nueva experiencia en el catalogo.
        </p>
      </div>

      <ExperienceForm
        regions={(regionsRes.data ?? []) as Region[]}
        categories={(categoriesRes.data ?? []) as Category[]}
      />
    </div>
  )
}
