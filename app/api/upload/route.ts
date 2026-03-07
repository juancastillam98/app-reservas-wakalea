import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_INPUT_SIZE = 10 * 1024 * 1024 // 10 MB input
const MAX_OUTPUT_SIZE = 1 * 1024 * 1024 // 1 MB output
const MAX_WIDTH = 1920

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate size
    if (file.size > MAX_INPUT_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10 MB)" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Optimize with sharp: resize + convert to WebP
    let quality = 82
    let optimized: Buffer

    // First pass
    optimized = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()

    // If still too large, reduce quality iteratively
    while (optimized.length > MAX_OUTPUT_SIZE && quality > 30) {
      quality -= 10
      optimized = await sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()
    }

    // If still too large after quality reduction, resize further
    if (optimized.length > MAX_OUTPUT_SIZE) {
      optimized = await sharp(buffer)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 40 })
        .toBuffer()
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}_${random}.webp`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("experiences_images")
      .upload(fileName, optimized, {
        contentType: "image/webp",
        upsert: false,
      })

    if (error) {
      console.error("[upload] Supabase storage error:", error)
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("experiences_images")
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      size: optimized.length,
      path: data.path,
    })
  } catch (err) {
    console.error("[upload] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
