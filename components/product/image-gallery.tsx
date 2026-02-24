"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src={images[activeIndex]}
          alt={`${title} - Imagen ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === activeIndex
                  ? "border-primary shadow-sm"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
