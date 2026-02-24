"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Users, ShieldCheck } from "lucide-react"
import { formatPrice, getDiscountPercent } from "@/lib/format"
import type { Experience } from "@/lib/types"

interface BookingCardProps {
  experience: Experience
}

export function BookingCard({ experience }: BookingCardProps) {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [guests, setGuests] = useState(1)

  const hasDiscount =
    experience.original_price_cents !== null &&
    experience.original_price_cents > experience.price_cents

  const totalCents = experience.price_cents * guests

  function handleReserve() {
    const params = new URLSearchParams({
      experience: experience.slug,
      date,
      guests: guests.toString(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      {/* Price */}
      <div className="mb-5">
        {hasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(experience.original_price_cents!)}
            </span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              {`-${getDiscountPercent(experience.original_price_cents!, experience.price_cents)}%`}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(experience.price_cents)}
          </span>
          <span className="text-sm text-muted-foreground">/persona</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="booking-date"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Fecha
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="booking-guests"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Users className="h-3.5 w-3.5" />
            {`Personas (max ${experience.max_guests})`}
          </label>
          <select
            id="booking-guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Array.from({ length: experience.max_guests }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n === 1 ? "1 persona" : `${n} personas`}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-sm font-medium text-muted-foreground">Total</span>
        <span className="text-xl font-bold text-foreground">
          {formatPrice(totalCents)}
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={!date}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        Reservar ahora
      </button>

      {/* Trust */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Cancelacion gratuita hasta 48h antes</span>
      </div>
    </div>
  )
}
