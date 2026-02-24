import Link from "next/link"

const footerLinks = {
  experiencias: [
    { href: "/experiencias?region=pais-vasco", label: "Pais Vasco" },
    { href: "/experiencias?region=andalucia", label: "Andalucia" },
    { href: "/experiencias?region=comunidad-valenciana", label: "C. Valenciana" },
    { href: "/experiencias", label: "Todas las experiencias" },
  ],
  categorias: [
    { href: "/experiencias?category=senderismo", label: "Senderismo" },
    { href: "/experiencias?category=kayak-y-agua", label: "Kayak y Agua" },
    { href: "/experiencias?category=agroturismo", label: "Agroturismo" },
    { href: "/experiencias?category=gastronomia-rural", label: "Gastronomia Rural" },
  ],
  empresa: [
    { href: "/sobre-nosotros", label: "Sobre Wakalea" },
    { href: "/contacto", label: "Contacto" },
    { href: "/blog", label: "Blog" },
    { href: "/sostenibilidad", label: "Sostenibilidad" },
  ],
  legal: [
    { href: "/legal/privacidad", label: "Politica de privacidad" },
    { href: "/legal/terminos", label: "Terminos y condiciones" },
    { href: "/legal/cookies", label: "Politica de cookies" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/50">
      <div className="mx-auto max-w-8xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Regiones */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Regiones
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.experiencias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Categorias
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.categorias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Empresa
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">Wakalea</span>
            <span className="text-sm text-muted-foreground">
              {'Ecoturismo con alma'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {'© 2026 Wakalea. Todos los derechos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
