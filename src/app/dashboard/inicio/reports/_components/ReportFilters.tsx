"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

export type PeriodoTab = "DIARIO" | "SEMANAL" | "MENSUAL" | "ANUAL";

interface ReportFiltersProps {
  activeTab: PeriodoTab;
  onTabChange: (t: PeriodoTab) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
  onExport?: () => void;
}

export default function ReportFilters({
  activeTab,
  onTabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: ReportFiltersProps) {
  const TABS: PeriodoTab[] = ["DIARIO", "SEMANAL", "MENSUAL", "ANUAL"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        marginTop: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap" /* 🔥 Permite que el botón baje de línea */,
          width: "100%" /* 🔥 Ocupa el ancho disponible */,
          justifyContent: "flex-end" /* Mantiene todo a la derecha en PC */,
        }}
      >
        <div style={{ display: "flex", gap: 10, flex: "1 1 auto" }}>
          <input
            type="date"
            value={startDate}
            onChange={e => onStartDateChange(e.target.value)}
            style={{
              flex: 1 /* 🔥 Hace que las fechas se repartan el espacio equitativamente */,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontFamily: "var(--font-poppins)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#4A5568",
              outline: "none",
              cursor: "pointer",
              background: "#fff",
              minWidth: 120 /* Evita que el input se haga microscópico */,
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={e => onEndDateChange(e.target.value)}
            style={{
              flex: 1 /* 🔥 Hace que las fechas se repartan el espacio equitativamente */,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontFamily: "var(--font-poppins)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#4A5568",
              outline: "none",
              cursor: "pointer",
              background: "#fff",
              minWidth: 120 /* Evita que el input se haga microscópico */,
            }}
          />
        </div>

        {onExport && (
          <button
            onClick={onExport}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 10,
              background: "#2d3748",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              flex: "1 1 100%" /* 🔥 En móvil, esto obliga al botón a ocupar su propia fila del 100% */,
              maxWidth: "100%",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#000")}
            onMouseOut={e => (e.currentTarget.style.background = "#2d3748")}
          >
            <Download size={16} />
            EXCEL CONTABLE
          </button>
        )}

        {/* CSS Mágico para escritorio: Desactiva el ancho 100% del botón en pantallas grandes */}
        <style>{`
          @media (min-width: 640px) {
            button {
              flex: 0 1 auto !important; /* El botón vuelve a su tamaño pequeño en PC */
            }
            .acciones-container {
              width: auto !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
