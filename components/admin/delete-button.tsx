"use client"

import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
    id: string
    label: string
    action: (formData: FormData) => Promise<void>
    confirmMessage: string
}

export function DeleteButton({ id, label, action, confirmMessage }: DeleteButtonProps) {
    return (
        <form action={action}>
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ml-auto"
                aria-label={label}
                onClick={(e) => {
                    if (!confirm(confirmMessage)) e.preventDefault()
                }}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </form>
    )
}
