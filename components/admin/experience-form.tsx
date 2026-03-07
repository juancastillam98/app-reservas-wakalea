"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Experience, Region, Category, ExperienceSchedule, TimeSlot, DaySchedule } from "@/lib/types"
import { Save, Loader2, Plus, X, Clock } from "lucide-react"
import { ImageDropzone } from "./image-dropzone"

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

const DAY_LABELS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
]

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

  // ── Array fields ──────────────────────────────────────────
  const [includes, setIncludes] = useState<string[]>(
    experience?.includes?.length ? experience.includes : [""]
  )
  const [excludes, setExcludes] = useState<string[]>(
    experience?.excludes?.length ? experience.excludes : [""]
  )
  const [highlights, setHighlights] = useState<string[]>(
    experience?.highlights?.length ? experience.highlights : [""]
  )

  // ── Images (new Supabase Storage) ─────────────────────────
  const [mainImage, setMainImage] = useState<string[]>(
    experience?.main_image_url ? [experience.main_image_url] : []
  )
  const [galleryImages, setGalleryImages] = useState<string[]>(
    experience?.gallery_urls?.length ? experience.gallery_urls : []
  )

  // ── Schedule ──────────────────────────────────────────────
  const [scheduleDays, setScheduleDays] = useState<DaySchedule>(
    experience?.schedule?.days ?? {}
  )
  const [selectedDayAdmin, setSelectedDayAdmin] = useState<number>(1) // Default Lunes

  // ── Helpers ───────────────────────────────────────────────
  function updateTimeSlot(index: number, field: keyof TimeSlot, value: any) {
    setScheduleDays((prev) => {
      const daySlots = prev[selectedDayAdmin] ? [...prev[selectedDayAdmin]] : []
      if (daySlots[index]) {
        daySlots[index] = { ...daySlots[index], [field]: value }
      }
      return { ...prev, [selectedDayAdmin]: daySlots }
    })
  }

  function addTimeSlot() {
    setScheduleDays((prev) => {
      const daySlots = prev[selectedDayAdmin] ? [...prev[selectedDayAdmin]] : []
      daySlots.push({ start: "", reserved: false })
      return { ...prev, [selectedDayAdmin]: daySlots }
    })
  }

  function removeTimeSlot(index: number) {
    setScheduleDays((prev) => {
      const daySlots = prev[selectedDayAdmin] ? [...prev[selectedDayAdmin]] : []
      daySlots.splice(index, 1)
      return { ...prev, [selectedDayAdmin]: daySlots }
    })
  }

  // ── Submit ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    const title = form.get("title") as string

    // Build schedule object
    const finalDays: DaySchedule = {}
    let hasAnySlots = false

    for (const [day, slots] of Object.entries(scheduleDays)) {
      const validSlots = slots.filter((s) => s.start)
      if (validSlots.length > 0) {
        finalDays[Number(day)] = validSlots
        hasAnySlots = true
      }
    }

    const schedule: ExperienceSchedule | null = hasAnySlots ? { days: finalDays } : null

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
      // Images — new system
      main_image_url: mainImage[0] || null,
      gallery_urls: galleryImages,
      // Legacy compatibility — keep images array in sync
      images: [
        ...(mainImage.length > 0 ? mainImage : []),
        ...galleryImages,
      ],
      // Schedule
      schedule,
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
          Información básica
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelClass}>
              Título *
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
              Subtítulo
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
              Descripción corta
            </label>
            <input
              id="short_description"
              name="short_description"
              defaultValue={experience?.short_description ?? ""}
              placeholder="Una línea para la tarjeta"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelClass}>
              Descripción completa *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={experience?.description ?? ""}
              placeholder="Descripción detallada de la experiencia..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="region_id" className={labelClass}>
                Región *
              </label>
              <select
                id="region_id"
                name="region_id"
                required
                defaultValue={experience?.region_id ?? ""}
                className={inputClass}
              >
                <option value="">Seleccionar región</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="category_id" className={labelClass}>
                Categoría *
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue={experience?.category_id ?? ""}
                className={inputClass}
              >
                <option value="">Seleccionar categoría</option>
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
          Precio y logística
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
              Duración (horas) *
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
              Edad mínima
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
              Ubicación
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

      {/* ── Images (Drag & Drop) ─────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Imágenes
        </h2>
        <div className="flex flex-col gap-6">
          <ImageDropzone
            label="Imagen principal"
            value={mainImage}
            onChange={setMainImage}
            single
          />
          <ImageDropzone
            label="Galería"
            value={galleryImages}
            onChange={setGalleryImages}
            maxFiles={10}
          />
        </div>
      </section>

      {/* ── Schedule / Disponibilidad ────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Disponibilidad Específica por Día
        </h2>

        {/* Days of the week */}
        <div className="mb-6">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Selecciona un día para editar sus horarios
          </span>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map(({ value, label }) => {
              const isActive = selectedDayAdmin === value
              const hasSlots = scheduleDays[value] && scheduleDays[value].length > 0
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedDayAdmin(value)}
                  className={`relative flex h-10 w-14 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                >
                  {label}
                  {hasSlots && !isActive && (
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary" />
                  )}
                  {hasSlots && isActive && (
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Horarios para {DAY_LABELS.find((d) => d.value === selectedDayAdmin)?.label}
              </span>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={!!(scheduleDays[selectedDayAdmin] && scheduleDays[selectedDayAdmin].length > 0)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setScheduleDays((prev) => ({
                        ...prev,
                        [selectedDayAdmin]: [{ start: "", reserved: false }],
                      }))
                    } else {
                      setScheduleDays((prev) => {
                        const copy = { ...prev }
                        delete copy[selectedDayAdmin]
                        return copy
                      })
                    }
                  }}
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                />
                Día habilitado
              </label>
            </div>

            {(scheduleDays[selectedDayAdmin] && scheduleDays[selectedDayAdmin].length > 0) && (
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Añadir hora
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {(!scheduleDays[selectedDayAdmin] || scheduleDays[selectedDayAdmin].length === 0) ? (
              <p className="text-sm text-muted-foreground italic">No hay horarios configurados para este día.</p>
            ) : (
              scheduleDays[selectedDayAdmin].map((slot, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1">
                    <Clock className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => updateTimeSlot(i, "start", e.target.value)}
                      className="h-8 bg-transparent px-1 text-sm text-foreground focus:outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={!!slot.reserved}
                      onChange={(e) => updateTimeSlot(i, "reserved", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    Reservado
                  </label>
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(i)}
                    className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Includes / Excludes / Highlights */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          Detalles de la experiencia
        </h2>

        <div className="flex flex-col gap-6">
          <ArrayFieldEditor
            label="Qué incluye"
            items={includes}
            setItems={setIncludes}
            placeholder="Ej: Guía certificado bilingüe"
          />
          <ArrayFieldEditor
            label="Qué <bNO incluye"
            items={excludes}
            setItems={setExcludes}
            placeholder="Ej: Transporte hasta el punto de encuentro"
          />
          <ArrayFieldEditor
            label="Highlights"
            items={highlights}
            setItems={setHighlights}
            placeholder="Ej: Acantilados de 60M de años"
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
            Experiencia activa (visible en el catálogo)
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
          <Plus className="h-3.5 w-3.5" /> Añadir
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
