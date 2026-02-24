import Link from "next/link"
import { CheckCircle2, CalendarDays, Users, Download } from "lucide-react"
import { formatPrice } from "@/lib/format"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reserva confirmada — Wakalea",
}

interface PageProps {
  searchParams: Promise<{
    title?: string
    date?: string
    guests?: string
    total?: string
    name?: string
    experience?: string
  }>
}

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const params = await searchParams

  const title = params.title || "Tu experiencia"
  const date = params.date || ""
  const guests = parseInt(params.guests || "1")
  const total = parseInt(params.total || "0")
  const name = params.name || "Viajero"
  const experienceSlug = params.experience || ""

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center lg:py-24">
      {/* Success icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
        Reserva confirmada
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {`Gracias, ${name}. Tu aventura esta asegurada.`}
      </p>

      {/* Booking details card */}
      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 text-left shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Fecha
            </span>
            <span className="font-medium text-foreground">
              {date
                ? new Date(date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Por confirmar"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              Personas
            </span>
            <span className="font-medium text-foreground">{guests}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-semibold text-foreground">Total pagado</span>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <p className="mt-6 text-sm text-muted-foreground">
        Hemos enviado los detalles de la reserva a tu email. Tambien puedes
        acceder a toda la informacion desde tu panel de usuario.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={experienceSlug ? `/experiencias/${experienceSlug}` : "/experiencias"}
          className="flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Ver experiencia
        </Link>
        <Link
          href="/experiencias"
          className="flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explorar mas experiencias
        </Link>
      </div>

      {/* Mock download */}
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
      >
        <Download className="h-4 w-4" />
        Descargar confirmacion (PDF)
      </button>
    </div>
  )
}
