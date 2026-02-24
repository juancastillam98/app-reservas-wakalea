import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ExperienceForm } from "@/components/admin/experience-form"
import type { Experience, Region, Category } from "@/lib/types"

export default async function EditarExperienciaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [expRes, regionsRes, categoriesRes] = await Promise.all([
    supabase.from("experiences").select("*").eq("id", id).single(),
    supabase.from("regions").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ])

  if (!expRes.data) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Editar experiencia
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {expRes.data.title}
        </p>
      </div>

      <ExperienceForm
        regions={(regionsRes.data ?? []) as Region[]}
        categories={(categoriesRes.data ?? []) as Category[]}
        experience={expRes.data as Experience}
      />
    </div>
  )
}
