"use client"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2, ImagePlus, GripVertical } from "lucide-react"

interface ImageDropzoneProps {
    /** Current URLs (already uploaded) */
    value: string[]
    /** Called whenever the URL list changes */
    onChange: (urls: string[]) => void
    /** Max files allowed */
    maxFiles?: number
    /** Label shown above the dropzone */
    label?: string
    /** If true, only one image allowed (main image mode) */
    single?: boolean
}

interface UploadingFile {
    id: string
    file: File
    preview: string
    progress: "uploading" | "done" | "error"
    url?: string
    error?: string
}

export function ImageDropzone({
    value,
    onChange,
    maxFiles = 10,
    label = "Imágenes",
    single = false,
}: ImageDropzoneProps) {
    const [uploading, setUploading] = useState<UploadingFile[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const effectiveMax = single ? 1 : maxFiles

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files).filter((f) =>
                f.type.startsWith("image/")
            )

            if (fileArray.length === 0) return

            // Limit the number of files
            const remaining = effectiveMax - value.length
            const toUpload = fileArray.slice(0, Math.max(0, remaining))

            if (toUpload.length === 0) return

            // Create upload entries
            const entries: UploadingFile[] = toUpload.map((file) => ({
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                file,
                preview: URL.createObjectURL(file),
                progress: "uploading" as const,
            }))

            setUploading((prev) => [...prev, ...entries])

            // Upload each file
            const results = await Promise.allSettled(
                entries.map(async (entry) => {
                    const formData = new FormData()
                    formData.append("file", entry.file)

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    })

                    if (!res.ok) {
                        const data = await res.json()
                        throw new Error(data.error || "Upload failed")
                    }

                    const data = await res.json()
                    return { id: entry.id, url: data.url as string }
                })
            )

            // Process results
            const newUrls: string[] = []
            const updatedEntries: Record<string, Partial<UploadingFile>> = {}

            for (const result of results) {
                if (result.status === "fulfilled") {
                    newUrls.push(result.value.url)
                    updatedEntries[result.value.id] = {
                        progress: "done",
                        url: result.value.url,
                    }
                } else {
                    // Find the entry by order
                    const failedEntry = entries.find(
                        (e) => !updatedEntries[e.id]
                    )
                    if (failedEntry) {
                        updatedEntries[failedEntry.id] = {
                            progress: "error",
                            error: result.reason?.message || "Error",
                        }
                    }
                }
            }

            setUploading((prev) =>
                prev.map((entry) =>
                    updatedEntries[entry.id]
                        ? { ...entry, ...updatedEntries[entry.id] }
                        : entry
                )
            )

            // Update parent with new URLs
            if (newUrls.length > 0) {
                if (single) {
                    onChange(newUrls.slice(0, 1))
                } else {
                    onChange([...value, ...newUrls])
                }
            }

            // Clean up completed uploads after a delay
            setTimeout(() => {
                setUploading((prev) =>
                    prev.filter((entry) => entry.progress === "uploading")
                )
            }, 2000)
        },
        [value, onChange, effectiveMax, single]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragOver(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false)
    }, [])

    const removeUrl = useCallback(
        (index: number) => {
            const updated = value.filter((_, i) => i !== index)
            onChange(updated)
        },
        [value, onChange]
    )

    const isAtMax = value.length >= effectiveMax

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">
                    {value.length}/{effectiveMax}
                </span>
            </div>

            {/* Uploaded images grid */}
            {value.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {value.map((url, i) => (
                        <div
                            key={url}
                            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary/30"
                        >
                            <Image
                                src={url}
                                alt={`Imagen ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="200px"
                            />
                            {i === 0 && !single && (
                                <span className="absolute left-2 top-2 rounded-md bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                    Principal
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => removeUrl(i)}
                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Uploading previews */}
            {uploading.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {uploading.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary/30"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={entry.preview}
                                alt="Subiendo..."
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                {entry.progress === "uploading" && (
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                )}
                                {entry.progress === "done" && (
                                    <div className="rounded-full bg-emerald-500 p-1">
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                                {entry.progress === "error" && (
                                    <span className="rounded-md bg-destructive px-2 py-1 text-xs font-medium text-white">
                                        {entry.error}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop zone */}
            {!isAtMax && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`
            flex cursor-pointer flex-col items-center justify-center gap-2
            rounded-xl border-2 border-dashed px-4 py-8 text-center
            transition-colors
            ${isDragOver
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:bg-secondary/30"
                        }
          `}
                >
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDragOver ? "bg-primary/10" : "bg-secondary"
                            }`}
                    >
                        {isDragOver ? (
                            <Upload className="h-5 w-5" />
                        ) : (
                            <ImagePlus className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragOver
                                ? "Suelta la imagen aquí"
                                : "Arrastra imágenes o haz clic para seleccionar"}
                        </p>
                        <p className="mt-1 text-xs">
                            JPG, PNG, WebP • Max {single ? "1 imagen" : `${effectiveMax} imágenes`} • Se optimizarán automáticamente
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple={!single}
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) handleFiles(e.target.files)
                            e.target.value = ""
                        }}
                    />
                </div>
            )}
        </div>
    )
}
