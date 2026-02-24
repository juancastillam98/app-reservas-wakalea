import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarDays, Users, MapPin, Clock, ExternalLink } from "lucide-react"
import { formatPrice, formatDuration } from "@/lib/format"
import type { Booking } from "@/lib/types"

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-secondary text-secondary-foreground border-border",
  }
  const labels = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?redirect=/dashboard")

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, experiences(title, slug, location, duration_hours, images)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const typedBookings = (bookings ?? []) as (Booking & {
    experiences: {
      title: string
      slug: string
      location: string | null
      duration_hours: number
      images: string[]
    }
  })[]

  const activeBookings = typedBookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  )
  const pastBookings = typedBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Mis reservas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta el estado de tus reservas activas e historial.
        </p>
      </div>

      {/* Active bookings */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Reservas activas ({activeBookings.length})
        </h2>
        {activeBookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No tienes reservas activas.
            </p>
            <Link
              href="/experiencias"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explorar experiencias
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* Past bookings */}
      {pastBookings.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Historial ({pastBookings.length})
          </h2>
          <div className="flex flex-col gap-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function BookingCard({
  booking,
}: {
  booking: Booking & {
    experiences: {
      title: string
      slug: string
      location: string | null
      duration_hours: number
      images: string[]
    }
  }
}) {
  const exp = booking.experiences
  const image = exp?.images?.[0]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      {/* Image */}
      {image && (
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
          <img
            src={image}
            alt={exp?.title ?? "Experiencia"}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">
              {exp?.title ?? "Experiencia"}
            </h3>
            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(booking.booking_date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {booking.guests} {booking.guests === 1 ? "persona" : "personas"}
            </span>
            {exp?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {exp.location}
              </span>
            )}
            {exp?.duration_hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(exp.duration_hours)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-base font-bold text-foreground">
            {formatPrice(booking.total_cents)}
          </span>
          {exp?.slug && (
            <Link
              href={`/experiencias/${exp.slug}`}
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Ver experiencia
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
