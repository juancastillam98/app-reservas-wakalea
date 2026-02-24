"use client"

import { Download } from "lucide-react"

interface DownloadBookingPdfProps {
    title: string
    name: string
    date: string
    guests: number
    total: string // formatted string e.g. "45,00 €"
    experience: string
}

export function DownloadBookingPdf({
    title,
    name,
    date,
    guests,
    total,
    experience,
}: DownloadBookingPdfProps) {
    function handleDownload() {
        const formattedDate = date
            ? new Date(date).toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "Por confirmar"

        const bookingRef = `WAK-${Date.now().toString(36).toUpperCase()}`
        const now = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Confirmación de reserva — Wakalea</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 48px;
      max-width: 680px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 22px;
      font-weight: 800;
      color: #2d6a4f;
      letter-spacing: -0.5px;
    }
    .logo span {
      font-size: 11px;
      font-weight: 500;
      color: #6b7280;
      display: block;
      letter-spacing: 0;
    }
    .badge {
      background: #d1fae5;
      color: #065f46;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .title-block {
      margin-bottom: 32px;
    }
    .title-block h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .title-block p {
      font-size: 14px;
      color: #6b7280;
    }
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .card-header {
      background: #f9fafb;
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }
    .card-header h2 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }
    .card-body {
      padding: 24px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
    }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b7280; }
    .row .value { font-weight: 600; color: #111827; text-align: right; max-width: 60%; }
    .row.total {
      border-top: 2px solid #e5e7eb;
      border-bottom: none;
      margin-top: 8px;
      padding-top: 16px;
      font-size: 16px;
    }
    .row.total .label { font-weight: 700; color: #111827; }
    .row.total .value { color: #2d6a4f; font-size: 20px; }
    .ref-block {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 16px 24px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #065f46;
    }
    .ref-block strong { font-size: 16px; font-family: monospace; display: block; margin-top: 4px; }
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
      text-align: center;
      line-height: 1.8;
    }
    @media print {
      body { padding: 32px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      Wakalea
      <span>Ecoturismo con alma</span>
    </div>
    <span class="badge">✓ Confirmada</span>
  </div>

  <div class="title-block">
    <h1>Confirmación de reserva</h1>
    <p>Emitido el ${now}</p>
  </div>

  <div class="ref-block">
    Número de reserva
    <strong>${bookingRef}</strong>
  </div>

  <div class="card">
    <div class="card-header"><h2>Datos del viajero</h2></div>
    <div class="card-body">
      <div class="row">
        <span class="label">Nombre</span>
        <span class="value">${name}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><h2>Detalles de la experiencia</h2></div>
    <div class="card-body">
      <div class="row">
        <span class="label">Experiencia</span>
        <span class="value">${title}</span>
      </div>
      <div class="row">
        <span class="label">Fecha</span>
        <span class="value">${formattedDate}</span>
      </div>
      <div class="row">
        <span class="label">Número de personas</span>
        <span class="value">${guests} ${guests === 1 ? "persona" : "personas"}</span>
      </div>
      <div class="row total">
        <span class="label">Total pagado</span>
        <span class="value">${total}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Wakalea</strong> — wakalea.com</p>
    <p>Para cualquier consulta sobre tu reserva, contacta con nosotros en hola@wakalea.com</p>
    <p>Cancelación gratuita hasta 48 horas antes de la experiencia.</p>
    <p style="margin-top: 12px; font-size:11px;">Este documento es tu comprobante de reserva. Consérvalo para el día de la experiencia.</p>
  </div>
</body>
</html>`

        const win = window.open("", "_blank")
        if (!win) return
        win.document.write(html)
        win.document.close()
        win.focus()
        setTimeout(() => {
            win.print()
        }, 300)
    }

    return (
        <button
            type="button"
            onClick={handleDownload}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
        >
            <Download className="h-4 w-4" />
            Descargar confirmación (PDF)
        </button>
    )
}
