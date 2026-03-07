"use client"

import { Minus, Plus } from "lucide-react"

export interface GuestCounts {
    adults: number
    children_0_5: number
    children_6_12: number
    children_13_17: number
}

interface GuestSelectorProps {
    value: GuestCounts
    onChange: (counts: GuestCounts) => void
    maxGuests: number
}

interface GuestRowProps {
    label: string
    subtitle: string
    count: number
    onIncrement: () => void
    onDecrement: () => void
    min: number
    disableIncrement: boolean
}

function GuestRow({
    label,
    subtitle,
    count,
    onIncrement,
    onDecrement,
    min,
    disableIncrement,
}: GuestRowProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <span className="text-sm font-medium text-foreground">{label}</span>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onDecrement}
                    disabled={count <= min}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Reducir ${label}`}
                >
                    <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-foreground">
                    {count}
                </span>
                <button
                    type="button"
                    onClick={onIncrement}
                    disabled={disableIncrement}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Aumentar ${label}`}
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}

export function GuestSelector({ value, onChange, maxGuests }: GuestSelectorProps) {
    const totalGuests =
        value.adults + value.children_0_5 + value.children_6_12 + value.children_13_17
    const atMax = totalGuests >= maxGuests

    function update(field: keyof GuestCounts, delta: number) {
        const updated = { ...value, [field]: value[field] + delta }
        onChange(updated)
    }

    return (
        <div className="divide-y divide-border/60">
            <GuestRow
                label="Adultos"
                subtitle="18+ años"
                count={value.adults}
                onIncrement={() => update("adults", 1)}
                onDecrement={() => update("adults", -1)}
                min={1}
                disableIncrement={atMax}
            />
            <GuestRow
                label="Niños (0–5 años)"
                subtitle="Hasta 5 años"
                count={value.children_0_5}
                onIncrement={() => update("children_0_5", 1)}
                onDecrement={() => update("children_0_5", -1)}
                min={0}
                disableIncrement={atMax}
            />
            <GuestRow
                label="Niños (6–12 años)"
                subtitle="De 6 a 12 años"
                count={value.children_6_12}
                onIncrement={() => update("children_6_12", 1)}
                onDecrement={() => update("children_6_12", -1)}
                min={0}
                disableIncrement={atMax}
            />
            <GuestRow
                label="Jóvenes (13–17 años)"
                subtitle="De 13 a 17 años"
                count={value.children_13_17}
                onIncrement={() => update("children_13_17", 1)}
                onDecrement={() => update("children_13_17", -1)}
                min={0}
                disableIncrement={atMax}
            />
            <div className="pt-3">
                <p className="text-xs text-muted-foreground">
                    Total: <strong>{totalGuests}</strong> / {maxGuests} personas
                </p>
                {value.adults < 1 && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        Se requiere al menos 1 adulto
                    </p>
                )}
            </div>
        </div>
    )
}
