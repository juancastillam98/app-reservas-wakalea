import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, CalendarDays, UserCircle, LogOut } from "lucide-react"
import type { Profile } from "@/lib/types"

const sidebarLinks = [
  { href: "/dashboard", label: "Mis reservas", icon: CalendarDays },
  { href: "/dashboard/perfil", label: "Mi perfil", icon: UserCircle },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?redirect=/dashboard")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>()

  const displayName =
    profile?.first_name || user.email?.split("@")[0] || "Usuario"

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-primary">
              Wakalea
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              / Mi cuenta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Cerrar sesion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <nav className="flex gap-1 lg:flex-col">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
