import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Mountain,
  CalendarDays,
  Mail,
  UserCircle,
  LogOut,
  Plus,
  Globe,
  Tag,
} from "lucide-react"
import type { Profile } from "@/lib/types"

const sidebarLinks = [
  { href: "/admin", label: "Vista general", icon: LayoutDashboard },
  { href: "/admin/experiencias", label: "Experiencias", icon: Mountain },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/leads", label: "Leads", icon: Mail },
  { href: "/admin/regiones", label: "Regiones", icon: Globe },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?redirect=/admin")

  // Double-check admin role from DB
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>()

  console.log("[v0] Admin layout - user:", user.id, "profile:", profile, "profileError:", profileError)

  if (profile?.role !== "admin") redirect("/")

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            Wakalea
          </Link>
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          <div className="my-3 border-t border-border" />

          <Link
            href="/admin/experiencias/nueva"
            className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nueva experiencia
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {profile?.first_name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Cerrar sesion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            Wakalea
          </Link>
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Admin
          </span>
          <nav className="ml-auto flex items-center gap-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
