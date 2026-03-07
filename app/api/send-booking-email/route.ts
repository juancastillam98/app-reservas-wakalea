import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

const EXPERIENCES_EMAIL_TO = "reservas@wakalea.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      experienceId,
      experienceTitle,
      experienceSlug,
      date,
      time,
      adults,
      children_0_5,
      children_6_12,
      children_13_17,
      totalGuests,
      totalCents,
      guestName,
      guestEmail,
      guestPhone,
      howFound,
    } = body

    // ── 1. Save booking in Supabase ─────────────────────────
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabaseAdmin.from("bookings").insert({
      experience_id: experienceId,
      booking_date: date,
      booking_time: time,
      guests: totalGuests,
      adults,
      children_0_5: children_0_5 || 0,
      children_6_12: children_6_12 || 0,
      children_13_17: children_13_17 || 0,
      total_cents: totalCents,
      status: "pending",
      customer_name: guestName,
      customer_email: guestEmail,
      customer_phone: guestPhone,
      how_found: howFound,
    })

    if (dbError) {
      console.error("[booking] DB error:", dbError)
      // Continue with email even if DB fails (non-blocking)
    }

    // ── 2. Send email via Resend ────────────────────────────
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === "re_your_api_key_here") {
      console.warn("[booking] RESEND_API_KEY not configured — skipping email")
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Booking saved. Email skipped (no API key).",
      })
    }

    const resend = new Resend(apiKey)

    const formattedDate = new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    const totalFormatted = (totalCents / 100).toFixed(2) + " €"

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #2d5a3d; color: white; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🌿 Nueva Reserva de Experiencia</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Wakalea — Reservas</p>
        </div>
        
        <div style="padding: 24px 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #2d5a3d;">${experienceTitle}</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;">📅 Fecha:</td>
              <td style="padding: 8px 0; font-weight: 600;">${formattedDate}</td>
            </tr>
            ${time ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">🕐 Hora:</td>
              <td style="padding: 8px 0; font-weight: 600;">${time}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;">👥 Adultos:</td>
              <td style="padding: 8px 0; font-weight: 600;">${adults}</td>
            </tr>
            ${children_0_5 ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">👶 Niños (0-5):</td>
              <td style="padding: 8px 0; font-weight: 600;">${children_0_5}</td>
            </tr>` : ""}
            ${children_6_12 ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">🧒 Niños (6-12):</td>
              <td style="padding: 8px 0; font-weight: 600;">${children_6_12}</td>
            </tr>` : ""}
            ${children_13_17 ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">🧑 Jóvenes (13-17):</td>
              <td style="padding: 8px 0; font-weight: 600;">${children_13_17}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;">👤 Total personas:</td>
              <td style="padding: 8px 0; font-weight: 600;">${totalGuests}</td>
            </tr>
            <tr style="border-top: 1px solid #eee;">
              <td style="padding: 12px 0 8px; color: #666;">💰 Total:</td>
              <td style="padding: 12px 0 8px; font-weight: 700; font-size: 16px; color: #2d5a3d;">${totalFormatted}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

          <h3 style="margin: 0 0 12px; font-size: 15px; color: #2d5a3d;">Datos del cliente</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #666; width: 140px;">Nombre:</td>
              <td style="padding: 6px 0; font-weight: 600;">${guestName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${guestEmail}" style="color: #2d5a3d;">${guestEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Teléfono:</td>
              <td style="padding: 6px 0;"><a href="tel:${guestPhone}" style="color: #2d5a3d;">${guestPhone}</a></td>
            </tr>
            ${howFound ? `
            <tr>
              <td style="padding: 6px 0; color: #666;">¿Cómo nos conoció?</td>
              <td style="padding: 6px 0;">${howFound}</td>
            </tr>` : ""}
          </table>
        </div>
      </div>
    `

    const { error: emailError } = await resend.emails.send({
      from: "Wakalea Reservas <onboarding@resend.dev>",
      to: [EXPERIENCES_EMAIL_TO],
      subject: `Nueva reserva: ${experienceTitle} — ${formattedDate}`,
      html: htmlContent,
    })

    if (emailError) {
      console.error("[booking] Resend error:", emailError)
      return NextResponse.json(
        { success: true, emailSent: false, message: "Booking saved but email failed." },
        { status: 200 }
      )
    }

    return NextResponse.json({ success: true, emailSent: true })
  } catch (err) {
    console.error("[booking] Unexpected error:", err)
    return NextResponse.json(
      { error: "Error al procesar la reserva" },
      { status: 500 }
    )
  }
}
