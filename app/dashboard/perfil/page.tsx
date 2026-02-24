"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email ?? "")

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<Profile>()

      if (data) setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setSaved(false)

    const formData = new FormData(e.currentTarget)
    const updates = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setProfile({ ...profile, ...updates })
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza tus datos personales.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5">
          {/* Email (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="h-10 rounded-xl border border-border bg-muted px-3 text-sm text-muted-foreground"
            />
          </div>

          {/* First name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="first_name" className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              defaultValue={profile?.first_name ?? ""}
              placeholder="Tu nombre"
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Last name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="last_name" className="text-sm font-medium text-foreground">
              Apellidos
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              defaultValue={profile?.last_name ?? ""}
              placeholder="Tus apellidos"
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Telefono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder="+34 600 000 000"
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar cambios
          </button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600">
              Guardado correctamente
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
