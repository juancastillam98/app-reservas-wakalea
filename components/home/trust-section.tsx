import { Shield, Leaf, Headphones, Award } from "lucide-react"

const trustItems = [
  {
    icon: Leaf,
    title: "100% Sostenible",
    description:
      "Todas nuestras experiencias siguen protocolos de turismo responsable y respeto al medio ambiente.",
  },
  {
    icon: Shield,
    title: "Reserva segura",
    description:
      "Pago protegido, cancelacion flexible y seguro de actividad incluido en cada experiencia.",
  },
  {
    icon: Award,
    title: "Guias expertos",
    description:
      "Guias locales certificados que conocen cada rincón del territorio y su cultura.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description:
      "Atencion personalizada antes, durante y despues de tu experiencia. Siempre disponibles.",
  },
]

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Por que reservar con Wakalea
        </h2>
        <p className="mt-3 text-pretty text-base text-muted-foreground md:text-lg">
          Cada detalle esta pensado para que solo te preocupes de disfrutar.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
