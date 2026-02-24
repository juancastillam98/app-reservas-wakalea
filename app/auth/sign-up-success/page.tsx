import { Leaf, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Revisa tu email
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Te hemos enviado un enlace de confirmacion. Haz clic en el para
            activar tu cuenta y empezar a reservar experiencias.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al login
          </Link>
        </div>
      </div>
    </div>
  )
}
