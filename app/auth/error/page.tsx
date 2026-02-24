import { Leaf, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Error de autenticacion
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Ha ocurrido un error durante el proceso de autenticacion. Por
            favor, intentalo de nuevo.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
