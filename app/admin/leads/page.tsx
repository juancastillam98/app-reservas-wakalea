import { createClient } from "@/lib/supabase/server"
import { Mail } from "lucide-react"

export default async function AdminLeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  const typedLeads = leads ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {typedLeads.length} suscriptores al newsletter.
        </p>
      </div>

      {typedLeads.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">
            No hay leads todavia.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                  Nombre
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Fuente
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {typedLeads.map((lead: any) => (
                <tr
                  key={lead.id}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {lead.email}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {lead.name ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
