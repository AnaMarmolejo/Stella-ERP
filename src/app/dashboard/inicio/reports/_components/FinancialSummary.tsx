"use client";

import { Wallet, TrendingUp, CreditCard, ShoppingBag } from "lucide-react";

interface FinancialSummaryProps {
  productos: any[];
}

export default function FinancialSummary({ productos }: FinancialSummaryProps) {
  // Cálculos basados únicamente en el inventario actual
  const inversionStock = productos.reduce((acc, p) => acc + ((p.stock_actual || 0) * (p.costo || 0)), 0);
  const valorVentaTotal = productos.reduce((acc, p) => acc + ((p.stock_actual || 0) * (p.precio || 0)), 0);
  const gananciaProyectada = valorVentaTotal - inversionStock;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      border: "1px solid rgba(112, 128, 144, 0.08)",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <style>{`
        .kpi-card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        @media (min-width: 768px) {
          .kpi-card-hover:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ background: "rgba(183, 110, 121, 0.1)", padding: 8, borderRadius: 12 }}>
          <Wallet size={20} color="#b76e79" />
        </div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-marcellus)", fontSize: "1.1rem", color: "#2d3748" }}>
          Potencial del Inventario Actual
        </h3>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 20 
      }}>
        {/* Inversión en Stock (Pink Theme) */}
        <div className="kpi-card-hover" style={{
          background: "linear-gradient(to bottom right, #b76e79, #a45f69)",
          borderRadius: 16,
          padding: "clamp(14px, 3.5vw, 24px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          gap: 16,
          minHeight: "clamp(110px, 15vw, 130px)",
          cursor: "default"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", fontWeight: 500, color: "rgba(255, 255, 255, 0.95)", margin: 0, lineHeight: 1.2, maxWidth: "80%" }}>
              Inversión Total en Inventario
            </p>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "clamp(4px, 1.5vw, 8px)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CreditCard size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>
          <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
            <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.3rem, 4vw, 2.2rem)", fontWeight: 400, margin: 0, lineHeight: 1, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              ${inversionStock.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.8)", marginTop: 4, fontFamily: "var(--font-sans)" }}>Capital invertido en mercancía actual</p>
          </div>
          <div style={{ position: "absolute", right: "-10%", bottom: "-15%", opacity: 0.1, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 1 }}>
            <CreditCard size={100} color="#FFFFFF" />
          </div>
        </div>

        {/* Valor de Venta Estimado (Slate Theme) */}
        <div className="kpi-card-hover" style={{
          background: "linear-gradient(to bottom right, #708090, #5a6a7a)",
          borderRadius: 16,
          padding: "clamp(14px, 3.5vw, 24px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          gap: 16,
          minHeight: "clamp(110px, 15vw, 130px)",
          cursor: "default"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", fontWeight: 500, color: "rgba(255, 255, 255, 0.95)", margin: 0, lineHeight: 1.2, maxWidth: "80%" }}>
              Valor de Venta (Público)
            </p>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "clamp(4px, 1.5vw, 8px)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShoppingBag size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>
          <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
            <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.3rem, 4vw, 2.2rem)", fontWeight: 400, margin: 0, lineHeight: 1, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              ${valorVentaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.8)", marginTop: 4, fontFamily: "var(--font-sans)" }}>Ingreso bruto si se vende todo hoy</p>
          </div>
          <div style={{ position: "absolute", right: "-10%", bottom: "-15%", opacity: 0.1, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 1 }}>
            <ShoppingBag size={100} color="#FFFFFF" />
          </div>
        </div>

        {/* Ganancia Proyectada (Dark Slate Theme) */}
        <div className="kpi-card-hover" style={{
          background: "linear-gradient(to bottom right, #2d3748, #1a202c)",
          borderRadius: 16,
          padding: "clamp(14px, 3.5vw, 24px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          gap: 16,
          minHeight: "clamp(110px, 15vw, 130px)",
          cursor: "default"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2, position: "relative" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", fontWeight: 500, color: "rgba(255, 255, 255, 0.95)", margin: 0, lineHeight: 1.2, maxWidth: "80%" }}>
              Ganancia Proyectada
            </p>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "clamp(4px, 1.5vw, 8px)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>
          <div style={{ zIndex: 2, position: "relative", marginTop: "auto" }}>
            <p style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(1.3rem, 4vw, 2.2rem)", fontWeight: 400, margin: 0, lineHeight: 1, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              ${gananciaProyectada.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.8)", marginTop: 4, fontFamily: "var(--font-sans)" }}>Utilidad neta estimada del stock actual</p>
          </div>
          <div style={{ position: "absolute", right: "-10%", bottom: "-15%", opacity: 0.1, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 1 }}>
            <TrendingUp size={100} color="#FFFFFF" />
          </div>
        </div>
      </div>
    </div>
  );
}
