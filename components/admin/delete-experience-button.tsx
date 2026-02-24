"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function DeleteExperienceButton({
  experienceId,
  experienceTitle,
}: {
  experienceId: string
  experienceTitle: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", experienceId)

    if (!error) {
      router.refresh()
    }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-8 items-center gap-1 rounded-lg bg-destructive/10 px-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Eliminar"
          )}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="flex h-8 items-center rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      aria-label={`Eliminar ${experienceTitle}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  )
}
