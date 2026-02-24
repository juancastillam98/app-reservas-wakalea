import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Tag, Plus } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import type { Category } from "@/lib/types"

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

async function createCategory(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const name = formData.get("name") as string
    const icon = (formData.get("icon") as string) || null
    if (!name) return
    await supabase.from("categories").insert({
        name,
        slug: slugify(name),
        icon,
    })
    revalidatePath("/admin/categorias")
}

async function deleteCategory(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const id = formData.get("id") as string
    await supabase.from("categories").delete().eq("id", id)
    revalidatePath("/admin/categorias")
}

export default async function AdminCategoriasPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("name")

    const typedCategories = (categories ?? []) as Category[]

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Categorías
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gestiona las categorías disponibles para las experiencias.
                </p>
            </div>

            {/* Create form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-foreground">
                    Nueva categoría
                </h2>
                <form action={createCategory} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label htmlFor="cat-name" className="text-sm font-medium text-foreground">
                            Nombre *
                        </label>
                        <input
                            id="cat-name"
                            name="name"
                            required
                            placeholder="Ej: Senderismo"
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label htmlFor="cat-icon" className="text-sm font-medium text-foreground">
                            Icono (emoji o código)
                        </label>
                        <input
                            id="cat-icon"
                            name="icon"
                            placeholder="Ej: 🥾"
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Crear categoría
                    </button>
                </form>
            </div>

            {/* Categories list */}
            {typedCategories.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                    <Tag className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        No hay categorías creadas todavía.
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
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                                    Icono
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {typedCategories.map((cat) => (
                                <tr key={cat.id} className="border-b border-border/60 last:border-0">
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {cat.name}
                                    </td>
                                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                                        {cat.slug}
                                    </td>
                                    <td className="px-4 py-3 text-center text-lg">
                                        {cat.icon ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DeleteButton
                                            id={cat.id}
                                            label={`Eliminar ${cat.name}`}
                                            action={deleteCategory}
                                            confirmMessage={`¿Eliminar "${cat.name}"? Las experiencias asociadas quedarán sin categoría.`}
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
