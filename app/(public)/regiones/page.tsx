import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Sparkles } from "lucide-react"
import type { Region, Experience } from "@/lib/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Explora nuestras regiones — Wakalea",
    description: "Descubre experiencias únicas en las regiones más hermosas. Cultura, naturaleza y aventura en cada destino.",
}

export default async function RegionesPage() {
    const supabase = await createClient()

    // Fetch regions with experience counts
    const { data: regions } = await supabase
        .from("regions")
        .select(`
            *,
            experiences (id)
        `)
        .order("name")

    const typedRegions = (regions ?? []) as (Region & { experiences: any[] })[]

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section with Ambient Background */}
            <div className="relative overflow-hidden bg-slate-50 border-b border-border/40">
                <div className="absolute inset-x-0 bottom-0 top-0 hidden sm:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-muted)_0%,transparent_40%)] opacity-30" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--accent-muted)_0%,transparent_40%)] opacity-20" />
                </div>

                <div className="mx-auto max-w-8xl px-4 py-20 lg:px-8 lg:py-32 relative z-10">
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm border border-primary/5">
                            <Sparkles className="h-4 w-4" />
                            Explora destinos mágicos
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8 leading-[1.1]">
                            Nuestras <span className="text-primary italic">Regiones</span>
                        </h1>
                        <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl font-medium">
                            Desde las cumbres nevadas de Sierra Nevada hasta las calas turquesas del Mediterráneo. Descubre los rincones donde Wakalea trasforma el turismo en <span className="text-foreground font-bold">experiencias de vida</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-8xl px-4 py-16 lg:px-8">
                {/* Stats / Value Props Row */}
                <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-border/60 pb-16">
                    <div className="flex flex-col gap-3">
                        <div className="text-primary font-bold text-3xl">Local.</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">Conocimiento profundo de cada terreno para ofrecerte lo que nadie más ve.</p>
                    </div>
                    <div className="flex flex-col gap-3 border-l-0 md:border-l border-border/60 md:pl-12">
                        <div className="text-primary font-bold text-3xl">Auténtico.</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">Sin trampas de turistas. Solo la verdadera esencia de cada cultura regional.</p>
                    </div>
                    <div className="flex flex-col gap-3 border-l-0 md:border-l border-border/60 md:pl-12">
                        <div className="text-primary font-bold text-3xl">Exclusivo.</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">Grupos reducidos y accesos privilegiados en los destinos más demandados.</p>
                    </div>
                </div>

                {/* Region Grid */}
                <div className="mb-12 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Selecciona tu destino</h2>
                    <div className="h-px flex-1 bg-border/60 mx-8 hidden sm:block" />
                    <span className="text-sm font-semibold text-muted-foreground uppercase">{typedRegions.length} Regiones activas</span>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {typedRegions.map((region, i) => (
                        <Link
                            key={region.id}
                            href={`/experiencias?region=${region.slug}`}
                            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-card transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ring-1 ring-border/40"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={region.image_url || "/placeholder.jpg"}
                                    alt={region.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Overlay Gradients - More intense at bottom for readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Badge */}
                                <div className="absolute left-6 top-6 transition-transform duration-500 group-hover:translate-x-1">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl border border-white/20 shadow-xl">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        {region.experiences.length} {region.experiences.length === 1 ? 'experiencia' : 'experiencias'}
                                    </span>
                                </div>

                                {/* Content Info */}
                                <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                                    <h3 className="text-4xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
                                        {region.name}
                                    </h3>
                                    <p className="text-base text-white/70 leading-relaxed line-clamp-2 max-w-xs transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                                        {region.description || "Explora la belleza oculta de este destino con guías locales certificados."}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Arrow Button - Placed more prominently */}
                            <div className="absolute bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl transition-all duration-500 rotate-[-10deg] group-hover:rotate-0 group-hover:scale-110">
                                <ArrowRight className="h-7 w-7 transition-transform duration-500 group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Newsletter or Lead section to close the page with value */}
            <div className="bg-secondary/30 py-24 mb-12 border-y border-border/40">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Diseñamos expediciones a medida en cualquiera de nuestras regiones para grupos de más de 10 personas.</p>
                    <Link
                        href="/contacto"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-10 text-sm font-bold text-background transition-all hover:bg-foreground/90 hover:scale-105 active:scale-95 shadow-xl"
                    >
                        Contactar ahora
                    </Link>
                </div>
            </div>
        </div>
    )
}
