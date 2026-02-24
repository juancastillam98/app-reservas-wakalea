import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      {/* Logo mark */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          Wakalea
        </span>
      </div>

      {/* Headline */}
      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Vive la naturaleza, reserva tu aventura
        </h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          Experiencias de ecoturismo, agroturismo y turismo activo en los
          paisajes mas autenticos de Espana.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="rounded-xl px-8 text-base">
          Explorar experiencias
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl px-8 text-base"
        >
          Saber mas
        </Button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
        <span>Pais Vasco</span>
        <span className="hidden sm:inline" aria-hidden="true">
          |
        </span>
        <span>Andalucia</span>
        <span className="hidden sm:inline" aria-hidden="true">
          |
        </span>
        <span>Comunidad Valenciana</span>
      </div>
    </main>
  )
}
