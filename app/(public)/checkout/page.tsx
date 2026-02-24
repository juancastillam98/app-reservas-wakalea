import { Suspense } from "react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout — Wakalea",
  description: "Completa tu reserva de experiencia de ecoturismo.",
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Completar reserva
      </h1>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Cargando...
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
