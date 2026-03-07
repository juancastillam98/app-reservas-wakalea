"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Plus, Loader2 } from "lucide-react"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import { createClient } from "@/lib/supabase/client"

export function CreateRegionForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState<string[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || isLoading) return

        setIsLoading(true)
        try {
            const supabase = createClient()

            const slug = name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")

            const { error } = await supabase.from("regions").insert({
                name,
                slug,
                description: description || null,
                image_url: imageUrl[0] || null,
            })

            if (error) throw error

            setName("")
            setDescription("")
            setImageUrl([])
            router.refresh()
        } catch (err) {
            console.error("Error creating region:", err)
            alert("Error al crear la región")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="region-name" className="text-sm font-medium text-foreground">
                        Nombre *
                    </label>
                    <input
                        id="region-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Ej: Cataluña"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="region-description" className="text-sm font-medium text-foreground">
                        Descripción
                    </label>
                    <textarea
                        id="region-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Breve descripción opcional sobre los atractivos de la región"
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <ImageDropzone
                        label="Imagen de portada"
                        value={imageUrl}
                        onChange={setImageUrl}
                        single
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !name}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    Crear región
                </button>
            </div>
        </form>
    )
}
