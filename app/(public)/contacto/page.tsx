import type { Metadata } from "next"
import { ContactForm } from "@/components/home/contact-form"
import { Mail, Phone, MapPin, Clock, Instagram, Linkedin } from "lucide-react"

export const metadata: Metadata = {
    title: "Contacto — Wakalea",
    description:
        "¿Tienes alguna pregunta sobre nuestras experiencias de ecoturismo? Escríbenos y te responderemos en menos de 24 horas.",
}

const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "hola@wakalea.com",
        href: "mailto:hola@wakalea.com",
    },
    {
        icon: Phone,
        label: "Teléfono",
        value: "+34 600 000 000",
        href: "tel:+34600000000",
    },
    {
        icon: MapPin,
        label: "Ubicación",
        value: "País Vasco, España",
        href: null,
    },
    {
        icon: Clock,
        label: "Horario de atención",
        value: "Lun–Vie, 9:00–18:00",
        href: null,
    },
]

const faqs = [
    {
        q: "¿Puedo cancelar una reserva?",
        a: "Sí. Ofrecemos cancelación gratuita hasta 48 horas antes de la experiencia. Pasado ese plazo, la reserva no es reembolsable.",
    },
    {
        q: "¿Las experiencias son aptas para niños?",
        a: "Depende de cada experiencia. Cada ficha indica la edad mínima. Si tienes dudas, escríbenos y te recomendamos las más adecuadas.",
    },
    {
        q: "¿Organizáis experiencias privadas para grupos?",
        a: "Sí, trabajamos con grupos privados (empresas, familias, eventos). Contáctanos y te preparamos un presupuesto a medida.",
    },
    {
        q: "¿Está incluido el transporte en las experiencias?",
        a: "En la mayoría de experiencias el transportedesde el punto de encuentro no está incluido, pero indicamos exactamente el punto de inicio en cada ficha.",
    },
]

export default function ContactoPage() {
    return (
        <div>
            {/* Hero */}
            <section className="border-b border-border/60 bg-secondary/40 px-4 py-16 text-center lg:py-20">
                <div className="mx-auto max-w-2xl">
                    <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        Contacto
                    </span>
                    <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        ¿En qué podemos ayudarte?
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        Estamos aquí para resolvertodas tus dudas sobre nuestras experiencias.
                        Respondemos en menos de 24 horas.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">

                    {/* Form — takes 3 columns */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm lg:p-8">
                            <h2 className="mb-6 text-xl font-semibold text-foreground">
                                Envíanos un mensaje
                            </h2>
                            <ContactForm />
                        </div>
                    </div>

                    {/* Sidebar info — takes 2 columns */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        {/* Contact data */}
                        <div>
                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                Información de contacto
                            </h2>
                            <ul className="flex flex-col gap-4">
                                {contactInfo.map((item) => (
                                    <li key={item.label} className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                {item.label}
                                            </p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-sm font-medium text-foreground">
                                                    {item.value}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Síguenos
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href="https://instagram.com/wakalea"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                                    aria-label="Instagram de Wakalea"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://linkedin.com/company/wakalea"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                                    aria-label="LinkedIn de Wakalea"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <section className="mt-20 border-t border-border/60 pt-16">
                    <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-foreground">
                        Preguntas frecuentes
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
                        {faqs.map((faq) => (
                            <div
                                key={faq.q}
                                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
                            >
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    {faq.q}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
