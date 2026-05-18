"use client";

import { IConsignacion, EstadoConsignacion } from "@lib/models";
import { Package, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BADGE: Record<EstadoConsignacion, { bg: string; color: string; label: string; Icon: React.ElementType }> = {
  activa: { bg: "rgba(183,110,121,0.1)", color: "#B76E79", label: "Activa", Icon: CheckCircle },
  finalizada: { bg: "rgba(112,128,144,0.1)", color: "#708090", label: "Finalizada", Icon: Clock },
  cancelada: { bg: "rgba(192,133,109,0.1)", color: "#c0856d", label: "Cancelada", Icon: XCircle },
};

function fmt(date: string) {
  // Asegurarse de que date solo tenga YYYY-MM-DD
  const rawDate = date.split('T')[0];
  // Anexamos mediodia UTC para forzar que sea el mismo día sin importar la zona local (-6 horas)
  return new Date(rawDate + "T12:00:00Z").toLocaleDateString("es-MX", { 
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Mexico_City"
  });
}

interface MayoristaViewProps {
  consignaciones: IConsignacion[];
  loading: boolean;
  stats: { asignados: number; vendidos: number; devueltos: number; ganancia: number };
  nombre: string;
  isTourOpen?: boolean;
}

export default function MayoristaView({ consignaciones, loading, stats, nombre, isTourOpen }: MayoristaViewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#8C9796" }}>
        <div style={{ fontSize: "2rem", marginBottom: 10 }}>⏳</div>
        Cargando tus consignaciones...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Overview Header - Inspired by Image 2 */}
      <div className="space-y-3">
        <AnimatePresence>
          {isTourOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">1</div>
                <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Tu Nivel y Estado</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-slate-600 mb-0 mt-0 font-sans">Consulta aquí tu nivel actual como mayorista, los beneficios que tienes aplicados y asegúrate de que tu cuenta esté activa.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Welcome Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #708090 0%, #4a5568 100%)",
            borderRadius: 24,
            padding: "20px 24px sm:32px", // Responsivo manual
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(112, 128, 144, 0.15)",
          }}
          className="p-5 sm:p-8" // Usando Tailwind para paddings responsivos
        >
          {/* Decorative Icon */}
          <div style={{ position: "absolute", bottom: -10, right: -10, opacity: 0.1, color: "white" }}>
             <Package className="w-24 h-24 sm:w-32 sm:h-32" strokeWidth={1} />
          </div>
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
              Portal Mayorista
            </p>
            <h2 
              style={{ fontWeight: 400, color: "#fff", margin: 0, fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)" }}
              className="text-2xl sm:text-4xl"
            >
              Bienvenida, <em style={{ fontStyle: "italic", color: "#B76E79" }}>{nombre}</em>
            </h2>
            <div className="mt-4 sm:mt-6">
               <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <p style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0, marginRight: 8 }}>Estado:</p>
                  <p style={{ fontSize: "0.75rem", color: "#fff", margin: 0, fontWeight: 500 }}>Activo</p>
               </div>
            </div>
          </div>
        </div>

        {/* Level Card - Inspired by Image 2 */}
        <div
          style={{
            background: "linear-gradient(135deg, #B76E79 0%, #9d5a64 100%)",
            borderRadius: 24,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(183, 110, 121, 0.15)",
          }}
          className="p-5 sm:p-8"
        >
          <div style={{ position: "absolute", bottom: -10, right: -10, opacity: 0.1, color: "white" }}>
             <CheckCircle className="w-24 h-24 sm:w-32 sm:h-32" strokeWidth={1} />
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
              Mi Nivel Stella
            </p>
            <h2 
              style={{ fontWeight: 400, color: "#fff", margin: 0, fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)" }}
              className="text-2xl sm:text-4xl"
            >
              Mayorista <em style={{ fontStyle: "italic" }}>Gold</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 8 }} className="text-xs sm:text-sm">
              25% de descuento aplicado en todas tus compras.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Mini stats - Colored Backgrounds */}
      <div className="space-y-3">
        <AnimatePresence>
          {isTourOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">2</div>
                <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Métricas de Consignación</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-slate-600 mb-0 mt-0 font-sans">Visualiza rápidamente el resumen numérico de todo el inventario que la empresa te ha facilitado y tu margen de ganancia estimado.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Productos Asignados", value: stats.asignados, bg: "linear-gradient(135deg, #708090 0%, #4a5568 100%)" },
          { label: "Cantidad Vendida", value: stats.vendidos, bg: "linear-gradient(135deg, #B76E79 0%, #9d5a64 100%)" },
          { label: "Cantidad Devuelta", value: stats.devueltos, bg: "linear-gradient(135deg, #708090 0%, #4a5568 100%)" },
          { label: "Ganancia Estimada", value: `$${stats.ganancia.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, bg: "linear-gradient(135deg, #B76E79 0%, #9d5a64 100%)" },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
             <div style={{ position: "absolute", bottom: -10, right: -10, opacity: 0.1, color: "white" }}>
                <Package size={60} strokeWidth={1} />
             </div>

            <p 
              style={{ 
                fontSize: "2rem", 
                fontWeight: 400, 
                color: "#fff", 
                margin: 0, 
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                position: "relative",
                zIndex: 2
              }}
            >
              {s.value}
            </p>
            <p 
              style={{ 
                fontSize: "0.65rem", 
                color: "rgba(255,255,255,0.7)", 
                marginTop: 4, 
                textTransform: "uppercase", 
                letterSpacing: "0.1em", 
                fontWeight: 700,
                lineHeight: 1.2,
                position: "relative",
                zIndex: 2
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
      </div>

      {/* Consignaciones */}
      <div className="space-y-3">
        <AnimatePresence>
          {isTourOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">3</div>
                <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Detalle de Consignaciones</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-slate-600 mb-2 mt-0 font-sans">Aquí puedes expandir cada bloque para monitorear qué productos tienes asignados, la cantidad vendida y la fecha límite para reportarlos.</p>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-200 flex gap-2 items-start">
                  <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-slate-600 m-0 leading-tight font-sans"><strong>Recuerda:</strong> Esta vista es de <strong>solo lectura</strong> para ti. Para modificar estos estados o reportar ventas, dirígete al módulo de "Pedidos".</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1C1C1C", marginBottom: 12, fontFamily: "var(--font-marcellus)" }}>
          Mis Consignaciones
        </h3>

        {consignaciones.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(112,128,144,0.12)",
            }}
          >
            <Package size={36} style={{ color: "#ccc", marginBottom: 12 }} />
            <p style={{ color: "#8C9796", fontSize: "0.88rem", fontFamily: "var(--font-sans)" }}>
              Aún no tienes consignaciones asignadas
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {consignaciones.map(c => {
              const badge = BADGE[c.estado] ?? BADGE.activa;
              const diasRestantes = Math.ceil(
                (new Date(c.fecha_fin).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const totalItems = c.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0;
              const valTotal = c.detalles?.reduce((acc, d) => acc + (d.cantidad * (d.precio_mayorista || 0)), 0) || 0;
              
              const isExpanded = expanded === c.id;

              return (
                <div
                  key={c.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "18px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
                    border: "1px solid rgba(112,128,144,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: "linear-gradient(135deg,#B76E79,#9d5a64)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        <Package size={20} style={{ color: "#fff" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 400, fontSize: "1.1rem", color: "#1C1C1C", margin: 0, fontFamily: "var(--font-marcellus)" }}>
                          Asignación #{c.id}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "#708090", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
                          {totalItems} items en {c.detalles?.length || 0} productos
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.7rem", color: "#8C9796", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>Total a Pagar</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1C1C1C", fontFamily: "var(--font-marcellus)" }}>${valTotal.toLocaleString()}</span>
                      </div>
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          fontFamily: "var(--font-marcellus)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          alignSelf: "center",
                        }}
                      >
                        <badge.Icon size={12} />
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "#FAFAF8",
                      borderRadius: 10,
                      padding: "12px 16px",
                      marginTop: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "120px" }}>
                      <p style={{ fontSize: "0.68rem", color: "#8C9796", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "var(--font-sans)" }}>Período</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1C1C1C", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
                        {fmt(c.fecha_inicio)} → {fmt(c.fecha_fin)}
                      </p>
                    </div>

                    {c.estado === "activa" && (
                      <div style={{ flex: 1, minWidth: "120px", display: "flex", justifyContent: "flex-end" }}>
                        <div
                          style={{
                            background: diasRestantes < 0 ? "rgba(239,68,68,0.08)" : diasRestantes < 7 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: diasRestantes < 0 ? "#ef4444" : diasRestantes < 7 ? "#f59e0b" : "#10b981",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            fontFamily: "var(--font-sans)"
                          }}
                        >
                          {diasRestantes < 0
                            ? `Vencida hace ${Math.abs(diasRestantes)} días`
                            : diasRestantes === 0
                            ? "Vence hoy"
                            : `${diasRestantes} días restantes para rendir.`}
                        </div>
                      </div>
                    )}
                  </div>

                  {c.notas && (
                    <p style={{ fontSize: "0.8rem", color: "#4a5568", margin: "4px 0 0", padding: "0 4px", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
                      <span style={{ fontWeight: 600, fontStyle: "normal" }}>Nota Admin: </span> {c.notas}
                    </p>
                  )}

                  <div style={{ marginTop: 8, borderTop: "1px dashed #CBD5E1", paddingTop: 16 }}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#B76E79",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: 0,
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? "Ocultar Productos" : "Ver Productos Asignados"}
                    </button>

                    {isExpanded && c.detalles && c.detalles.length > 0 && (
                      <div style={{ marginTop: 16, overflowX: "auto" }}>
                        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B", textAlign: "left" }}>
                              <th style={{ padding: "8px 12px", fontWeight: 600 }}>Producto</th>
                              <th style={{ padding: "8px 12px", fontWeight: 600 }}>Cant.</th>
                              <th style={{ padding: "8px 12px", fontWeight: 600 }}>Vendidas</th>
                              <th style={{ padding: "8px 12px", fontWeight: 600 }}>Precio May.</th>
                              <th style={{ padding: "8px 12px", fontWeight: 600 }}>P. Sugerido</th>
                            </tr>
                          </thead>
                          <tbody>
                            {c.detalles.map(d => (
                              <tr key={d.id_producto} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                <td style={{ padding: "10px 12px", fontWeight: 400, color: "#334155", fontFamily: "var(--font-marcellus)", fontSize: "0.9rem" }}>
                                  {d.producto?.nombre}
                                </td>
                                <td style={{ padding: "10px 12px" }}>{d.cantidad}</td>
                                <td style={{ padding: "10px 12px", color: (d.cantidad_vendida || 0) > 0 ? "#10B981" : "inherit" }}>
                                  {d.cantidad_vendida || 0}
                                </td>
                                <td style={{ padding: "10px 12px", color: "#B76E79", fontWeight: 600 }}>
                                  ${(d.precio_mayorista || 0).toFixed(2)}
                                </td>
                                <td style={{ padding: "10px 12px", color: "#64748B" }}>
                                  ${(d.precio_venta || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
