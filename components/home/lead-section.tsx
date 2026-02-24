"use client"

import { useState } from "react"
import { Send, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function LeadSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    const supabase = createClient()
    const { error } = await supabase
      .from("leads")
      .insert({ email, source: "homepage" })

    if (error) {
      // Duplicate email is also fine — treat as success
      if (error.code === "23505") {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } else {
      setStatus("success")
    }
  }

  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Descubre ofertas exclusivas
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-base leading-relaxed text-primary-foreground/80">
          Suscribete y recibe antes que nadie nuestras experiencias de temporada,
          descuentos especiales y guias de viaje gratuitas.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="flex-1 rounded-xl bg-primary-foreground/15 px-5 py-3.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            aria-label="Direccion de email"
            disabled={status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90 disabled:opacity-70"
          >
            {status === "success" ? (
              <>
                <Check className="h-4 w-4" />
                Suscrito
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Suscribirme
              </>
            )}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-3 text-sm text-primary-foreground/70">
            Ha ocurrido un error. Intentalo de nuevo.
          </p>
        )}

        <p className="mt-4 text-xs text-primary-foreground/50">
          Sin spam. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </section>
  )
}
