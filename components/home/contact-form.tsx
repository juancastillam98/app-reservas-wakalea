"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ContactForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const supabase = createClient()

        // 1. Save to leads table
        const { error: dbError } = await supabase.from("leads").insert({
            name,
            email,
            source: `contacto: ${message.slice(0, 100)}`,
        })

        if (dbError) {
            setError("Ha ocurrido un error. Inténtalo de nuevo.")
            setSubmitting(false)
            return
        }

        // 2. Send email via Resend
        try {
            await fetch("/api/send-contact-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            })
        } catch {
            // Email failure is non-blocking — lead already saved
            console.warn("Email send failed, but lead was saved")
        }

        setSent(true)
        setSubmitting(false)
    }

    const inputClass =
        "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"

    if (sent) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <div>
                    <p className="text-lg font-semibold text-foreground">¡Mensaje enviado!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Nos pondremos en contacto contigo en menos de 24 horas.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                        Nombre *
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className={inputClass}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                        Email *
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                    Mensaje *
                </label>
                <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {error && (
                <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
                {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    "Enviar mensaje"
                )}
            </button>
        </form>
    )
}
