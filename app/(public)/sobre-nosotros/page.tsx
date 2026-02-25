import type { Metadata } from "next"
import Link from "next/link"
import {
    Leaf,
    HeartHandshake,
    Mountain,
    Users,
    Star,
    ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
    title: "Sobre nosotros — Wakalea",
    description:
        "Wakalea nació con una misión: conectar a las personas con la naturaleza a través de experiencias de ecoturismo auténticas y responsables en España.",
}

const values = [
    {
        icon: Leaf,
        title: "Sostenibilidad ante todo",
        description:
            "Cada experiencia que ofrecemos está diseñada para tener el mínimo impacto ambiental posible. Trabajamos con guías locales y seguimos prácticas de turismo responsable.",
    },
    {
        icon: HeartHandshake,
        title: "Comunidad local",
        description:
            "Colaboramos exclusivamente con guías y empresas locales. El dinero que gastas en Wakalea permanece en las comunidades que visitas.",
    },
    {
        icon: Mountain,
        title: "Autenticidad",
        description:
            "Nada de experiencias fabricadas para turistas. Seleccionamos rutas y actividades que los propios habitantes disfrutan en su tierra.",
    },
    {
        icon: Star,
        title: "Calidad garantizada",
        description:
            "Cada experiencia pasa por un proceso de validación antes de aparecer en la plataforma. Solo publicamos lo que nosotros mismos recomendaríamos.",
    },
]

const team = [
    {
        name: "Ane Etxebarria",
        role: "Fundadora & CEO",
        bio: "Bióloga de formación, lleva 10 años organizando salidas en el Parque Natural de Gorbeia. Fundó Wakalea para democratizar el acceso al ecoturismo.",
        initials: "AE",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        name: "Jon Arrizabalaga",
        role: "Head of Experiences",
        bio: "Guía de montaña y buceador certificado. Es el responsable de seleccionar y validar cada experiencia que aparece en la plataforma.",
        initials: "JA",
        color: "bg-amber-100 text-amber-700",
    },
    {
        name: "Miren Goikoetxea",
        role: "Comunidad & Marketing",
        bio: "Periodista ambiental y fotógrafa de naturaleza. Se encarga de que la voz de Wakalea llegue a quienes más la necesitan.",
        initials: "MG",
        color: "bg-sky-100 text-sky-700",
    },
]

const milestones = [
    { year: "2021", text: "Lanzamiento de Wakalea con 15 experiencias en el País Vasco" },
    { year: "2022", text: "Expansión a Andalucía y más de 1.000 reservas" },
    { year: "2023", text: "Certificación de turismo sostenible y llegada a la Comunidad Valenciana" },
    { year: "2024", text: "Supera las 5.000 aventuras y lanza la app móvil" },
    { year: "2025", text: "+200 experiencias en catálogo y nueva plataforma de reservas" },
]

export default function SobreNosotrosPage() {
    return (
        <div>
            {/* Hero */}
            <section className="border-b border-border/60 bg-secondary/40 px-4 py-16 lg:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        Sobre nosotros
                    </span>
                    <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                        Ecoturismo con alma
                    </h1>
                    <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                        Somos Wakalea, una plataforma de ecoturismo nacida en el País Vasco con la
                        misión de conectar a las personas con la naturaleza a través de experiencias
                        auténticas, sostenibles y transformadoras.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Nuestra misión
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            Wakalea nació de una convicción sencilla: la naturaleza mueve personas.
                            No hablamos de fotografías en Instagram, sino de esa sensación visceral
                            de escalar un acantilado de 60 millones de años, remar entre ballenas
                            o catar vinos a pie de viñedo con quien los elabora.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            Creemos que el turismo puede ser una fuerza positiva: para el viajero,
                            para los guías locales y para los ecosistemas que visitamos. Por eso
                            cada experiencia de Wakalea sigue criterios estrictos de sostenibilidad
                            y apoya directamente a las comunidades rurales de España.
                        </p>
                        <Link
                            href="/experiencias"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            Ver todas las experiencias
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: "+200", label: "Experiencias curadas" },
                            { value: "+5.000", label: "Aventuras completadas" },
                            { value: "3", label: "Comunidades autónomas" },
                            { value: "100%", label: "Guías locales certificados" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
                            >
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-secondary/40 px-4 py-16 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Lo que nos mueve
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Los cuatro principios que guían cada decisión en Wakalea.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((v) => (
                            <div
                                key={v.title}
                                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <v.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    {v.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {v.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        El equipo
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Personas que aman la naturaleza y creen que el turismo puede hacerse mejor.
                    </p>
                </div>
                <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
                        >
                            <div
                                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${member.color}`}
                            >
                                {member.initials}
                            </div>
                            <h3 className="text-base font-semibold text-foreground">
                                {member.name}
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-primary">
                                {member.role}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline */}
            <section className="border-t border-border/60 bg-secondary/40 px-4 py-16 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        Nuestra historia
                    </h2>
                    <div className="relative flex flex-col gap-0">
                        {/* Vertical line */}
                        <div className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-border" />
                        {milestones.map((m, i) => (
                            <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
                                    {m.year.slice(2)}
                                </div>
                                <div className="pt-1.5">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                                        {m.year}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {m.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-16 text-center lg:py-20">
                <div className="mx-auto max-w-2xl">
                    <Users className="mx-auto mb-4 h-10 w-10 text-primary/60" />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        ¿Quieres colaborar con Wakalea?
                    </h2>
                    <p className="mt-3 text-base text-muted-foreground">
                        Si eres guía, empresa de actividades o tienes una experiencia que crees
                        que encaja con nuestra filosofía, queremos conocerte.
                    </p>
                    <Link
                        href="/contacto"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Contacta con nosotros
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
