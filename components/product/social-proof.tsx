"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function SocialProof() {
  const [viewers, setViewers] = useState(0)

  useEffect(() => {
    // Simulate a realistic viewer count between 3-12
    setViewers(Math.floor(Math.random() * 10) + 3)
  }, [])

  if (!viewers) return null

  return (
    <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2.5">
      <Eye className="h-4 w-4 text-accent" />
      <span className="text-sm text-foreground/80">
        <strong className="font-semibold">{viewers} viajeros</strong>
        {" estan mirando esta experiencia ahora"}
      </span>
    </div>
  )
}
