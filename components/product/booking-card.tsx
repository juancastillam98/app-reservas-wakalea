"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  ShieldCheck,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { formatPrice, getDiscountPercent } from "@/lib/format"
import { GuestSelector, type GuestCounts } from "./guest-selector"
import type { Experience, TimeSlot } from "@/lib/types"

interface BookingCardProps {
  experience: Experience
}

const HOW_FOUND_OPTIONS = [
  "Buscador (Google)",
  "Redes sociales",
  "Recomendación de un amigo",
  "Blog / artículo",
  "Evento o feria",
  "Otro",
]

export function BookingCard({ experience }: BookingCardProps) {
  // ── State ─────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 1,
    children_0_5: 0,
    children_6_12: 0,
    children_13_17: 0,
  })
  const [showGuests, setShowGuests] = useState(false)

  // Form fields
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [howFound, setHowFound] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // ── Computed ───────────────────────────────────────────────
  const schedule = experience.schedule
  const hasSchedule = schedule && schedule.days && Object.keys(schedule.days).length > 0

  const totalGuests =
    guestCounts.adults +
    guestCounts.children_0_5 +
    guestCounts.children_6_12 +
    guestCounts.children_13_17

  const hasDiscount =
    experience.original_price_cents !== null &&
    experience.original_price_cents > experience.price_cents

  const totalCents = experience.price_cents * totalGuests

  // Disabled days — block dates without available slots + past dates
  const disabledDays = useMemo(() => {
    const matchers: any[] = [{ before: new Date() }]

    if (hasSchedule) {
      // Disable days whose weekday has no slots, or all slots are reserved
      matchers.push((date: Date) => {
        const day = date.getDay() // 0=Sunday..6=Saturday
        const daySlots = schedule!.days[day]
        if (!daySlots || daySlots.length === 0) return true // Disable if no slots configured

        // Disable if all slots for this day are reserved
        const hasAvailableSlots = daySlots.some(slot => !slot.reserved)
        return !hasAvailableSlots
      })
    }

    return matchers
  }, [hasSchedule, schedule])

  const isFormComplete =
    selectedDate &&
    (hasSchedule ? selectedTime !== null : true) &&
    guestCounts.adults >= 1 &&
    guestName.trim() &&
    guestEmail.trim() &&
    guestPhone.trim()

  // ── Submit ────────────────────────────────────────────────
  async function handleReserve() {
    if (!isFormComplete) return
    setSubmitting(true)
    setSubmitError(null)

    const bookingData = {
      experienceId: experience.id,
      experienceTitle: experience.title,
      experienceSlug: experience.slug,
      date: selectedDate!.toISOString().split("T")[0],
      time: selectedTime?.start || null,
      adults: guestCounts.adults,
      children_0_5: guestCounts.children_0_5,
      children_6_12: guestCounts.children_6_12,
      children_13_17: guestCounts.children_13_17,
      totalGuests,
      totalCents,
      guestName,
      guestEmail,
      guestPhone,
      howFound: howFound || null,
    }

    try {
      const emailRes = await fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      if (!emailRes.ok) {
        const data = await emailRes.json()
        throw new Error(data.error || "Error al enviar la reserva")
      }

      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Error inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success state ─────────────────────────────────────────
  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
        <CardContent className="p-0">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            ¡Reserva enviada!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hemos recibido tu solicitud. Te confirmaremos la reserva por email en breve.
          </p>
        </CardContent>
      </Card>
    )
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-0">
        {/* ── Price ───────────────────────────────────────── */}
        <div className="p-6 pb-4">
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

        {/* ── Calendar (shadcn booked-dates style) ───────── */}
        <div className="border-t border-border/60 px-2 py-2">
          <Calendar
            className="w-full"
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date ?? undefined)
              setSelectedTime(null)
            }}
            disabled={disabledDays}
          />
        </div>

        {/* ── Time Slots (revealed after selecting a day) ── */}
        {selectedDate && hasSchedule && schedule!.days[selectedDate.getDay()]?.some(s => !s.reserved) && (
          <div className="border-t border-border/60 px-6 py-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Horario disponible
            </div>
            <div className="flex flex-wrap gap-2">
              {schedule!.days[selectedDate.getDay()]
                .filter((slot) => !slot.reserved)
                .map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selectedTime?.start === slot.start
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary/50"
                      }`}
                  >
                    {slot.start}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── Guests ─────────────────────────────────────── */}
        <div className="border-t border-border/60 px-6 py-4">
          <button
            type="button"
            onClick={() => setShowGuests(!showGuests)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {totalGuests === 1 ? "1 persona" : `${totalGuests} personas`}
            </span>
            {showGuests ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {showGuests && (
            <div className="mt-2 rounded-xl border border-border bg-background px-4 py-2">
              <GuestSelector
                value={guestCounts}
                onChange={setGuestCounts}
                maxGuests={experience.max_guests}
              />
            </div>
          )}
        </div>

        {/* ── Contact Form ───────────────────────────────── */}
        <div className="border-t border-border/60 px-6 py-4">
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="booking-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Nombre *
              </label>
              <input
                id="booking-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Tu nombre completo"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="booking-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email *
              </label>
              <input
                id="booking-email"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="booking-phone" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Teléfono *
              </label>
              <input
                id="booking-phone"
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="booking-how-found" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                ¿Cómo nos has conocido?
              </label>
              <select
                id="booking-how-found"
                value={howFound}
                onChange={(e) => setHowFound(e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                {HOW_FOUND_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Total + CTA ────────────────────────────────── */}
        <div className="border-t border-border/60 px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">
              {formatPrice(totalCents)}
            </span>
          </div>

          {submitError && (
            <p className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <button
            type="button"
            onClick={handleReserve}
            disabled={!isFormComplete || submitting}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Solicitar información"
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cancelación gratuita hasta 48h antes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
