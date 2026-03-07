import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Plus, Globe, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { CreateRegionForm } from "@/components/admin/create-region-form"
import { DeleteButton } from "@/components/admin/delete-button"
import type { Region } from "@/lib/types"

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
                <CreateRegionForm />
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
                                <th className="w-16 px-4 py-3 text-left font-medium text-muted-foreground">
                                    Foto
                                </th>
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
                                    <td className="px-4 py-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-secondary/30">
                                            {region.image_url ? (
                                                <Image
                                                    src={region.image_url}
                                                    alt={region.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {region.name}
                                    </td>
                                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                                        {region.slug}
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                        <p className="line-clamp-1 max-w-xs">{region.description ?? "—"}</p>
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
