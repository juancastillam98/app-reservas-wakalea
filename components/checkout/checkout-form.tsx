"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/format"
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  CalendarDays,
  Users,
} from "lucide-react"
import type { Experience } from "@/lib/types"

export function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const experienceSlug = searchParams.get("experience") || ""
  const dateParam = searchParams.get("date") || ""
  const guestsParam = parseInt(searchParams.get("guests") || "1")

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Guest info
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  // Mock card (visual only - prepared for Redsys)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  useEffect(() => {
    async function loadExperience() {
      if (!experienceSlug) return
      const { data } = await supabase
        .from("experiences")
        .select("*, regions(*), categories(*)")
        .eq("slug", experienceSlug)
        .single()

      if (data) setExperience(data as Experience)
      setLoading(false)
    }
    loadExperience()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceSlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!experience) return
    setSubmitting(true)

    // In production, this would redirect to Redsys TPV
    // For now, simulate a successful payment
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to confirmation with mock data
    const params = new URLSearchParams({
      experience: experience.slug,
      title: experience.title,
      date: dateParam,
      guests: guestsParam.toString(),
      total: (experience.price_cents * guestsParam).toString(),
      name: guestName,
    })
    router.push(`/checkout/confirmacion?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
        <p className="text-foreground">No se encontro la experiencia.</p>
      </div>
    )
  }

  const totalCents = experience.price_cents * guestsParam

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left — Form fields */}
        <div className="flex-1 space-y-6">
          {/* Guest details */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Datos del viajero
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="guest-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Nombre completo
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="guest-email"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guest-phone"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Telefono
                  </label>
                  <input
                    id="guest-phone"
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment mock (prepared for Redsys) */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Datos de pago
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Pago seguro
              </div>
            </div>
            <p className="mb-4 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
              Entorno de prueba. En produccion, este paso redirigira al TPV de
              Redsys para un pago seguro.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="card-number"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Numero de tarjeta
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="card-number"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="card-expiry"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Caducidad
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    placeholder="MM/AA"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-cvc"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    CVC
                  </label>
                  <input
                    id="card-cvc"
                    type="text"
                    placeholder="123"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength={4}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit button (mobile) */}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 lg:hidden"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Pagar ${formatPrice(totalCents)}`
            )}
          </button>
        </div>

        {/* Right — Order summary */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Resumen
            </h2>

            <div className="mb-4 rounded-xl bg-secondary/50 p-4">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                {experience.title}
              </h3>
              {experience.regions && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {experience.regions.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Fecha
                </span>
                <span className="font-medium text-foreground">
                  {dateParam
                    ? new Date(dateParam).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Sin fecha"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  Personas
                </span>
                <span className="font-medium text-foreground">
                  {guestsParam}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Precio unitario</span>
                <span className="text-foreground">
                  {formatPrice(experience.price_cents)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-base font-semibold text-foreground">
                Total
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatPrice(totalCents)}
              </span>
            </div>

            {/* Submit button (desktop) */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 hidden h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 lg:flex"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Pagar ${formatPrice(totalCents)}`
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cancelacion gratuita hasta 48h antes
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
