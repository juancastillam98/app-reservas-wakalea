import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Globe, Plus } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import type { Region } from "@/lib/types"

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

async function createRegion(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || null
    if (!name) return
    await supabase.from("regions").insert({
        name,
        slug: slugify(name),
        description,
    })
    revalidatePath("/admin/regiones")
}

async function deleteRegion(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const id = formData.get("id") as string
    await supabase.from("regions").delete().eq("id", id)
    revalidatePath("/admin/regiones")
}

export default async function AdminRegionesPage() {
    const supabase = await createClient()
    const { data: regions } = await supabase
        .from("regions")
        .select("*")
        .order("name")

    const typedRegions = (regions ?? []) as Region[]

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Regiones
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gestiona las regiones disponibles para las experiencias.
                </p>
            </div>

            {/* Create form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-foreground">
                    Nueva región
                </h2>
                <form action={createRegion} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label htmlFor="region-name" className="text-sm font-medium text-foreground">
                            Nombre *
                        </label>
                        <input
                            id="region-name"
                            name="name"
                            required
                            placeholder="Ej: Cataluña"
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label htmlFor="region-description" className="text-sm font-medium text-foreground">
                            Descripción
                        </label>
                        <input
                            id="region-description"
                            name="description"
                            placeholder="Breve descripción opcional"
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Crear región
                    </button>
                </form>
            </div>

            {/* Regions list */}
            {typedRegions.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                    <Globe className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        No hay regiones creadas todavía.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Nombre
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                                    Slug
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                                    Descripción
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {typedRegions.map((region) => (
                                <tr key={region.id} className="border-b border-border/60 last:border-0">
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {region.name}
                                    </td>
                                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                                        {region.slug}
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                        {region.description ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DeleteButton
                                            id={region.id}
                                            label={`Eliminar ${region.name}`}
                                            action={deleteRegion}
                                            confirmMessage={`¿Eliminar "${region.name}"? Las experiencias asociadas quedarán sin región.`}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
