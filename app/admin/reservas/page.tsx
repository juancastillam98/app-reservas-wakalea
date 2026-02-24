import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { CalendarDays } from "lucide-react"

export default async function AdminReservasPage() {
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "*, experiences(title, slug)"
    )
    .order("created_at", { ascending: false })

  console.log("[v0] Admin reservas - bookings:", bookings, "error:", error)

  const typedBookings = bookings ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reservas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {typedBookings.length} reservas en total.
        </p>
      </div>

      {typedBookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">
            No hay reservas todavia.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Experiencia
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Cliente
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Personas
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedBookings.map((b: any) => (
                  <tr
                    key={b.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {b.experiences?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {b.guest_name || "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {b.guest_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(b.booking_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {b.guests}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatPrice(b.total_cents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-secondary text-secondary-foreground border-border",
  }
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ""}`}
    >
      {labels[status] ?? status}
    </span>
  )
}
