"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Experience, Region, Category } from "@/lib/types"
import { Save, Loader2, Plus, X } from "lucide-react"

interface ExperienceFormProps {
  regions: Region[]
  categories: Category[]
  experience?: Experience | null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ExperienceForm({
  regions,
  categories,
  experience,
}: ExperienceFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!experience

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Array fields state
  const [images, setImages] = useState<string[]>(experience?.images ?? [""])
  const [includes, setIncludes] = useState<string[]>(
    experience?.includes?.length ? experience.includes : [""]
  )
  const [excludes, setExcludes] = useState<string[]>(
    experience?.excludes?.length ? experience.excludes : [""]
  )
  const [highlights, setHighlights] = useState<string[]>(
    experience?.highlights?.length ? experience.highlights : [""]
  )

  function addToArray(
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter([...arr, ""])
  }

  function updateArray(
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) {
    const copy = [...arr]
    copy[index] = value
    setter(copy)
  }

  function removeFromArray(
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) {
    setter(arr.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    const title = form.get("title") as string
    const data = {
      title,
      slug: slugify(title),
      subtitle: (form.get("subtitle") as string) || null,
      description: form.get("description") as string,
      short_description: (form.get("short_description") as string) || null,
      region_id: form.get("region_id") as string,
      category_id: form.get("category_id") as string,
      price_cents: Math.round(parseFloat(form.get("price") as string) * 100),
      original_price_cents: form.get("original_price")
        ? Math.round(parseFloat(form.get("original_price") as string) * 100)
        : null,
      duration_hours: parseFloat(form.get("duration_hours") as string),
      max_guests: parseInt(form.get("max_guests") as string, 10),
      min_age: parseInt(form.get("min_age") as string, 10) || 0,
      location: (form.get("location") as string) || null,
      images: images.filter((v) => v.trim() !== ""),
      includes: includes.filter((v) => v.trim() !== ""),
      excludes: excludes.filter((v) => v.trim() !== ""),
      highlights: highlights.filter((v) => v.trim() !== ""),
      is_featured: form.get("is_featured") === "on",
      is_active: form.get("is_active") === "on",
    }

    let result
    if (isEditing) {
      result = await supabase
        .from("experiences")
        .update(data)
        .eq("id", experience.id)
    } else {
      result = await supabase.from("experiences").insert(data)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    router.push("/admin/experiencias")
    router.refresh()
  }

  const inputClass =
    "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
  const labelClass = "text-sm font-medium text-foreground"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Informacion basica
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelClass}>
              Titulo *
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={experience?.title ?? ""}
              placeholder="Ej: Flysch de Zumaia en Kayak"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="subtitle" className={labelClass}>
              Subtitulo
            </label>
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={experience?.subtitle ?? ""}
              placeholder="Frase corta que engancha"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="short_description" className={labelClass}>
              Descripcion corta
            </label>
            <input
              id="short_description"
              name="short_description"
              defaultValue={experience?.short_description ?? ""}
              placeholder="Una linea para la tarjeta"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelClass}>
              Descripcion completa *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={experience?.description ?? ""}
              placeholder="Descripcion detallada de la experiencia..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="region_id" className={labelClass}>
                Region *
              </label>
              <select
                id="region_id"
                name="region_id"
                required
                defaultValue={experience?.region_id ?? ""}
                className={inputClass}
              >
                <option value="">Seleccionar region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="category_id" className={labelClass}>
                Categoria *
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue={experience?.category_id ?? ""}
                className={inputClass}
              >
                <option value="">Seleccionar categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & logistics */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Precio y logistica
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className={labelClass}>
              Precio (EUR) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={
                experience ? (experience.price_cents / 100).toFixed(2) : ""
              }
              placeholder="75.00"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="original_price" className={labelClass}>
              Precio original (tachado)
            </label>
            <input
              id="original_price"
              name="original_price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={
                experience?.original_price_cents
                  ? (experience.original_price_cents / 100).toFixed(2)
                  : ""
              }
              placeholder="89.00"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="duration_hours" className={labelClass}>
              Duracion (horas) *
            </label>
            <input
              id="duration_hours"
              name="duration_hours"
              type="number"
              step="0.5"
              min="0.5"
              required
              defaultValue={experience?.duration_hours ?? ""}
              placeholder="4"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="max_guests" className={labelClass}>
              Max. personas *
            </label>
            <input
              id="max_guests"
              name="max_guests"
              type="number"
              min="1"
              required
              defaultValue={experience?.max_guests ?? 10}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="min_age" className={labelClass}>
              Edad minima
            </label>
            <input
              id="min_age"
              name="min_age"
              type="number"
              min="0"
              defaultValue={experience?.min_age ?? 0}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className={labelClass}>
              Ubicacion
            </label>
            <input
              id="location"
              name="location"
              defaultValue={experience?.location ?? ""}
              placeholder="Zumaia, Gipuzkoa"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Imagenes</h2>
          <button
            type="button"
            onClick={() => addToArray(images, setImages)}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            <Plus className="h-3.5 w-3.5" /> Anadir
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) =>
                  updateArray(images, setImages, i, e.target.value)
                }
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray(images, setImages, i)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Includes / Excludes / Highlights */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Detalles de la experiencia
        </h2>

        <div className="flex flex-col gap-6">
          <ArrayFieldEditor
            label="Que incluye"
            items={includes}
            setItems={setIncludes}
            placeholder="Ej: Guia certificado bilingue"
          />
          <ArrayFieldEditor
            label="Que NO incluye"
            items={excludes}
            setItems={setExcludes}
            placeholder="Ej: Transporte hasta el punto de encuentro"
          />
          <ArrayFieldEditor
            label="Highlights"
            items={highlights}
            setItems={setHighlights}
            placeholder="Ej: Acantilados de 60M de anos"
          />
        </div>
      </section>

      {/* Flags */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Visibilidad
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={experience?.is_active ?? true}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Experiencia activa (visible en el catalogo)
          </label>
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={experience?.is_featured ?? false}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Experiencia destacada (aparece en la Home)
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Guardar cambios" : "Crear experiencia"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function ArrayFieldEditor({
  label,
  items,
  setItems,
  placeholder,
}: {
  label: string
  items: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  placeholder: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <button
          type="button"
          onClick={() => setItems([...items, ""])}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          <Plus className="h-3.5 w-3.5" /> Anadir
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={val}
              onChange={(e) => {
                const copy = [...items]
                copy[i] = e.target.value
                setItems(copy)
              }}
              placeholder={placeholder}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
