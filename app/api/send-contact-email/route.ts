import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const CONTACT_EMAIL_TO = "contacto@wakalea.com"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === "re_your_api_key_here") {
      console.warn("[contact] RESEND_API_KEY not configured — skipping email")
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Lead saved. Email skipped (no API key).",
      })
    }

    const resend = new Resend(apiKey)

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #2d5a3d; color: white; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">📬 Nuevo mensaje de contacto</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Wakalea — Formulario de contacto</p>
        </div>
        
        <div style="padding: 24px 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px; vertical-align: top;">Nombre:</td>
              <td style="padding: 8px 0; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${email}" style="color: #2d5a3d; font-weight: 600;">${email}</a>
              </td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

          <h3 style="margin: 0 0 8px; font-size: 14px; color: #666;">Mensaje:</h3>
          <div style="background: #f8f8f8; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `

    const { error: emailError } = await resend.emails.send({
      from: "Wakalea Contacto <onboarding@resend.dev>",
      to: [CONTACT_EMAIL_TO],
      replyTo: email,
      subject: `Mensaje de contacto de ${name}`,
      html: htmlContent,
    })

    if (emailError) {
      console.error("[contact] Resend error:", emailError)
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailSent: true })
  } catch (err) {
    console.error("[contact] Unexpected error:", err)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
