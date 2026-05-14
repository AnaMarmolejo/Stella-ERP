"use client";

import { Package, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  asignados: number;
  vendidos: number;
  devueltos: number;
  ganancia: number;
}

export default function StatsCards(props: StatsCardsProps) {
  const stats = [
    { 
      label: "Productos Asignados", 
      value: props.asignados, 
      bg: "linear-gradient(135deg, #708090 0%, #4a5568 100%)", // Slate
    },
    { 
      label: "Cantidad Vendida", 
      value: props.vendidos, 
      bg: "linear-gradient(135deg, #B76E79 0%, #9d5a64 100%)", // Rose
    },
    { 
      label: "Cantidad Devuelta", 
      value: props.devueltos, 
      bg: "linear-gradient(135deg, #708090 0%, #4a5568 100%)", // Slate
    },
    { 
      label: "Ganancia Estimada", 
      value: `$${props.ganancia.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, 
      bg: "linear-gradient(135deg, #B76E79 0%, #9d5a64 100%)", // Rose
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full mb-8">
      {stats.map((item, idx) => {
        return (
          <div
            key={idx}
            className="rounded-[18px] p-4 sm:p-6 text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            style={{ background: item.bg }}
          >
            {/* Subtle Pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-10 text-white pointer-events-none">
               <Package size={80} strokeWidth={1} />
            </div>

            <div className="relative z-10">
              <h3 
                className="text-2xl sm:text-3xl font-normal mb-1 text-white" 
                style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)" }}
              >
                {item.value}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] sm:tracking-[0.12em] font-sans">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
