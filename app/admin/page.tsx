import { createClient } from "@/lib/supabase/server"
import { Mountain, CalendarDays, Users, Mail, TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/format"
import Link from "next/link"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Fetch counts in parallel
  const [expRes, bookRes, leadRes, revenueRes] = await Promise.all([
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("total_cents")
      .in("status", ["confirmed", "completed"]),
  ])

  const totalExperiences = expRes.count ?? 0
  const totalBookings = bookRes.count ?? 0
  const totalLeads = leadRes.count ?? 0
  const totalRevenue =
    revenueRes.data?.reduce(
      (sum: number, b: { total_cents: number }) => sum + b.total_cents,
      0
    ) ?? 0

  // Recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, experiences(title, slug), profiles:user_id(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      label: "Experiencias",
      value: totalExperiences,
      icon: Mountain,
      href: "/admin/experiencias",
    },
    {
      label: "Reservas",
      value: totalBookings,
      icon: CalendarDays,
      href: "/admin/reservas",
    },
    {
      label: "Ingresos",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      href: "/admin/reservas",
    },
    {
      label: "Leads",
      value: totalLeads,
      icon: Mail,
      href: "/admin/leads",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Panel de administracion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista general de Wakalea.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Ultimas reservas
          </h2>
          <Link
            href="/admin/reservas"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Ver todas
          </Link>
        </div>

        {(!recentBookings || recentBookings.length === 0) ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No hay reservas todavia.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Experiencia
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Fecha
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
                {recentBookings.map((b: any) => (
                  <tr key={b.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {b.experiences?.title ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {b.guest_name ?? b.profiles?.first_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(b.booking_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatPrice(b.total_cents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusDot status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-500",
    confirmed: "bg-emerald-500",
    cancelled: "bg-red-500",
    completed: "bg-secondary-foreground",
  }
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${colors[status] ?? "bg-muted-foreground"}`} />
      {labels[status] ?? status}
    </span>
  )
}
