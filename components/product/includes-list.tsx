import { Check, X } from "lucide-react"

interface IncludesListProps {
  includes: string[]
  excludes: string[]
}

export function IncludesList({ includes, excludes }: IncludesListProps) {
  if (!includes.length && !excludes.length) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Includes */}
      {includes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Que incluye
          </h3>
          <ul className="flex flex-col gap-2">
            {includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Excludes */}
      {excludes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            No incluye
          </h3>
          <ul className="flex flex-col gap-2">
            {excludes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
