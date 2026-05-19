"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HelpCircle, X } from "lucide-react";

interface HelpTooltipProps {
  title: string;
  message: string;
  tip?: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface SmartPos {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  transform?: string;
  arrowTop?: boolean;   // flecha apunta hacia arriba (tooltip está abajo)
  arrowBottom?: boolean;// flecha apunta hacia abajo  (tooltip está arriba)
  arrowRight?: boolean; // flecha está alineada a la derecha
  arrowCenter?: boolean;// flecha está centrada
  fixed?: boolean;      // en móvil: panel fijo centrado en la parte inferior
}

const TOOLTIP_W = 280;
const TOOLTIP_GAP = 10;

export default function HelpTooltip({
  title,
  message,
  tip,
  position = "bottom",
}: HelpTooltipProps) {
  const [isOpen, setIsOpen]     = useState(false);
  const [smartPos, setSmartPos] = useState<SmartPos>({});
  const btnRef  = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // ── Calcular posición inteligente ────────────────────────────
  const computePos = useCallback(() => {
    if (!btnRef.current) return;

    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const btn = btnRef.current.getBoundingClientRect();

    // En pantallas muy pequeñas → panel fijo centrado en la parte inferior
    if (vw < 420) {
      setSmartPos({ fixed: true });
      return;
    }

    // Estimamos altura del tooltip (sin poder medirla antes de renderizar)
    const estH = tip ? 180 : 120;

    // ¿Cabe arriba?
    const spaceTop    = btn.top;
    const spaceBottom = vh - btn.bottom;
    const spaceRight  = vw - btn.left;
    const spaceLeft   = btn.right;

    // Preferencia: bottom → top → right → left
    let chosen = position;
    if (chosen === "bottom" && spaceBottom < estH + TOOLTIP_GAP) chosen = "top";
    if (chosen === "top"    && spaceTop    < estH + TOOLTIP_GAP) chosen = "bottom";
    if (chosen === "right"  && spaceRight  < TOOLTIP_W + TOOLTIP_GAP) chosen = "left";
    if (chosen === "left"   && spaceLeft   < TOOLTIP_W + TOOLTIP_GAP) chosen = "right";

    // Posición horizontal: intentar alinear a la derecha del botón,
    // pero si se saldría de pantalla lo empujamos
    let rightOffset = 0;
    const leftIfRight0 = btn.right - TOOLTIP_W;
    if (leftIfRight0 < 8) {
      // empujar a la derecha para que no salga del borde izquierdo
      rightOffset = -(btn.right - TOOLTIP_W - 8) * -1;
    }

    if (chosen === "bottom") {
      setSmartPos({
        top: btn.bottom + TOOLTIP_GAP + window.scrollY,
        right: Math.max(8, vw - btn.right - rightOffset),
        arrowTop: true,
        arrowRight: true,
      });
    } else if (chosen === "top") {
      setSmartPos({
        bottom: vh - btn.top + TOOLTIP_GAP - window.scrollY,
        right: Math.max(8, vw - btn.right - rightOffset),
        arrowBottom: true,
        arrowRight: true,
      });
    } else if (chosen === "left") {
      setSmartPos({
        top: btn.top + window.scrollY - estH / 2,
        right: vw - btn.left + TOOLTIP_GAP,
        arrowCenter: true,
      });
    } else {
      setSmartPos({
        top: btn.top + window.scrollY - estH / 2,
        left: btn.right + TOOLTIP_GAP,
        arrowCenter: true,
      });
    }
  }, [position, tip]);

  // Recalcular al abrir y al resize/scroll
  useEffect(() => {
    if (!isOpen) return;
    computePos();
    window.addEventListener("resize",  computePos);
    window.addEventListener("scroll",  computePos, true);
    return () => {
      window.removeEventListener("resize",  computePos);
      window.removeEventListener("scroll",  computePos, true);
    };
  }, [isOpen, computePos]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapRef.current && !wrapRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Estilos del portal tooltip
  const tooltipStyles: React.CSSProperties = smartPos.fixed
    ? {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100vw - 32px)",
        maxWidth: 380,
        zIndex: 99999,
      }
    : {
        position: "fixed",
        width: TOOLTIP_W,
        zIndex: 99999,
        top:    smartPos.top    !== undefined ? smartPos.top    : undefined,
        bottom: smartPos.bottom !== undefined ? smartPos.bottom : undefined,
        left:   smartPos.left   !== undefined ? smartPos.left   : undefined,
        right:  smartPos.right  !== undefined ? smartPos.right  : undefined,
      };

  return (
    <>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);   }
        }
        @keyframes tooltipInFixed {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0   rgba(183,110,121,0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(183,110,121,0);    }
          100% { box-shadow: 0 0 0 0   rgba(183,110,121,0);    }
        }
        .help-btn-pulse { animation: pulseRing 2.2s cubic-bezier(0.66,0,0,1) infinite; }
        .help-btn-pulse:hover,
        .help-btn-pulse:focus  { animation: none; outline: none; }
      `}</style>

      {/* Botón "?" — siempre inline */}
      <button
        ref={btnRef}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Cerrar ayuda" : "Ver ayuda"}
        aria-expanded={isOpen}
        className="help-btn-pulse"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: isOpen
            ? "linear-gradient(135deg,#b76e79,#a45f69)"
            : "linear-gradient(135deg,rgba(183,110,121,0.8),rgba(183,110,121,0.55))",
          border: "2px solid #b76e79",
          color: "#fff",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          flexShrink: 0,
          backdropFilter: "blur(4px)",
        }}
      >
        {isOpen
          ? <X size={13} strokeWidth={2.5} />
          : <HelpCircle size={13} strokeWidth={2.5} />}
      </button>

      {/* Burbuja — renderizada via portal-like fixed positioning */}
      {isOpen && (
        <div
          ref={wrapRef}
          style={{
            ...tooltipStyles,
            background: "linear-gradient(145deg,#2d3748,#1a202c)",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow:
              "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(183,110,121,0.25)",
            animation: smartPos.fixed
              ? "tooltipInFixed 0.22s ease forwards"
              : "tooltipIn 0.22s ease forwards",
          }}
        >
          {/* Flecha — solo si no es panel fijo */}
          {!smartPos.fixed && (
            <div
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                background: "#2d3748",
                borderRadius: 2,
                transform: "rotate(45deg)",
                right: smartPos.arrowRight ? 10 : undefined,
                left: smartPos.arrowCenter ? "50%" : undefined,
                top: smartPos.arrowTop ? -5 : undefined,
                bottom: smartPos.arrowBottom ? -5 : undefined,
                boxShadow: "1px 1px 0 rgba(183,110,121,0.2)",
              }}
            />
          )}

          {/* Cabecera: título + botón cerrar en móvil */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#b76e79",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: 0,
            }}>
              {title}
            </p>
            {smartPos.fixed && (
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(246,244,239,0.7)",
                  flexShrink: 0,
                }}
                aria-label="Cerrar"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mensaje */}
          <p style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "0.83rem",
            color: "rgba(246,244,239,0.9)",
            lineHeight: 1.55,
            margin: 0,
          }}>
            {message}
          </p>

          {/* Tip */}
          {tip && (
            <div style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "rgba(183,110,121,0.15)",
              borderLeft: "3px solid #b76e79",
              borderRadius: "0 8px 8px 0",
            }}>
              <p style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.75rem",
                color: "rgba(246,244,239,0.75)",
                margin: 0,
                lineHeight: 1.5,
              }}>
                💡 {tip}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
