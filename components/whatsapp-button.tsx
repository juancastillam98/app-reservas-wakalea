"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "34663172809";
const WHATSAPP_MESSAGE = "Tengo una duda acerca de Wakalea";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// WhatsApp logo SVG
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.004 0C7.164 0 0 7.164 0 16.004c0 2.822.736 5.476 2.027 7.79L.07 31.93l8.327-1.933A15.927 15.927 0 0016.004 32C24.836 32 32 24.836 32 16.004 32 7.164 24.836 0 16.004 0zm0 29.268a13.21 13.21 0 01-6.742-1.844l-.484-.288-5.006 1.163 1.182-4.877-.316-.504A13.21 13.21 0 012.73 16.004C2.73 8.665 8.665 2.73 16.004 2.73c7.338 0 13.266 5.935 13.266 13.274 0 7.338-5.928 13.264-13.266 13.264zm7.275-9.93c-.397-.2-2.355-1.163-2.72-1.295-.364-.132-.63-.2-.895.199-.265.397-1.030 1.295-1.263 1.56-.232.265-.464.298-.862.1-.397-.2-1.677-.617-3.193-1.97-1.18-1.052-1.977-2.352-2.21-2.749-.233-.397-.025-.612.175-.81.18-.178.397-.464.596-.695.199-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.2-.895-2.155-1.227-2.95-.323-.773-.65-.668-.895-.68-.231-.012-.497-.015-.762-.015-.265 0-.695.1-1.06.497-.364.397-1.39 1.36-1.39 3.315 0 1.955 1.423 3.843 1.622 4.108.199.265 2.8 4.275 6.784 5.993.948.41 1.688.655 2.265.838.952.303 1.818.26 2.502.158.763-.114 2.355-.963 2.687-1.894.332-.93.332-1.727.232-1.894-.1-.166-.364-.265-.762-.464z" />
    </svg>
);

export const WhatsAppButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPulse, setShowPulse] = useState(true);

    // Hide pulse dot after first open
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    // Format current time
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* POPUP */}
            {isOpen && (
                <div
                    className="w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-black/10 origin-bottom-right transition-all duration-300 ease-out"
                >
                    {/* Header */}
                    <div className="bg-[#075E54] px-4 py-4 flex items-center gap-3 relative">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="relative w-12 h-12 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 flex items-center justify-center text-white">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#075E54] rounded-full" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base leading-tight">Wakalea</h3>
                            <p className="text-white/80 text-xs leading-tight mt-0.5">Normalmente respondemos en unas horas</p>
                        </div>
                        {/* Close */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat body */}
                    <div
                        className="px-4 py-6 relative min-h-[180px] flex flex-col justify-end"
                        style={{
                            backgroundColor: "#ECE5DD",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    >
                        {/* Time */}
                        <p className="text-center text-xs text-[#999] mb-3">{timeStr}</p>

                        {/* Message bubble */}
                        <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%] relative">
                            {/* Tail */}
                            <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent" />
                            <p className="text-[#111] text-sm leading-relaxed">
                                ¡Hola! 👋 ¿En qué te podemos ayudar?
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="bg-white px-4 py-4">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20BC5A] text-white font-bold text-base py-3.5 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <WhatsAppIcon className="w-6 h-6 fill-white" />
                            Hablar por WhatsApp
                        </a>
                    </div>
                </div>
            )}

            {/* FLOATING TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex items-center gap-2.5 bg-white text-[#25D366] font-bold text-sm px-5 py-3 rounded-full shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
                {/* Pulse notification dot */}
                {showPulse && (
                    <span className="absolute -top-1 -right-1">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
                        </span>
                    </span>
                )}
                <WhatsAppIcon className="w-6 h-6 fill-[#25D366]" />
                <span>¿Alguna duda?</span>
            </button>
        </div>
    );
};
