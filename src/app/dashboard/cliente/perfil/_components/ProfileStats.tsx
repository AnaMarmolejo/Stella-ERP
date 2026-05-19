"use client";

import { Package, CreditCard, Star, TrendingUp, ChevronRight } from "lucide-react";
import { UserStats } from "../type";
import Link from "next/link";

interface ProfileStatsProps {
  stats: UserStats;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const cards = [
    {
      label: "Pedidos Realizados",
      value: stats.pedidosTotales,
      icon: <Package size={20} />,
      color: "#b76e79",
      bg: "rgba(183,110,121,0.08)"
    },
    {
      label: "Monto Pendiente",
      value: `$${stats.montoPendiente.toLocaleString()}`,
      icon: <CreditCard size={20} />,
      color: "#4a5568",
      bg: "rgba(112,128,144,0.08)"
    },
    {
      label: "Puntos Stella",
      value: stats.puntosLealtad,
      icon: <Star size={20} />,
      color: "#8c9768",
      bg: "rgba(140,151,104,0.08)"
    },
    {
      label: "Estatus Cliente",
      value: "Premium",
      icon: <TrendingUp size={20} />,
      color: "#b76e79",
      bg: "rgba(183,110,121,0.08)"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-8">
      {/* Pedidos */}
      <div className="relative flex flex-col gap-4 bg-gradient-to-br from-[#b76e79] to-[#a45f69] p-5 sm:p-6 rounded-2xl shadow-md text-white overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="flex justify-between items-start z-10 relative">
          <p className="font-sans text-xs sm:text-sm font-medium text-white/90 m-0 leading-tight max-w-[80%] uppercase tracking-wider">
            Pedidos Realizados
          </p>
          <div className="bg-white/15 p-2 rounded-xl flex items-center justify-center shrink-0">
            <Package size={18} className="text-white" />
          </div>
        </div>
        <div className="z-10 relative mt-auto">
          <p className="font-serif text-3xl sm:text-4xl font-normal m-0 leading-none drop-shadow-sm">
            {stats.pedidosTotales}
          </p>
        </div>
        <div className="absolute -right-[10%] -bottom-[15%] opacity-10 -rotate-[15deg] pointer-events-none z-0">
          <Package size={100} className="text-white" />
        </div>
      </div>

      {/* Monto Pendiente */}
      <div className="relative flex flex-col gap-4 bg-gradient-to-br from-[#708090] to-[#5a6a7a] p-5 sm:p-6 rounded-2xl shadow-md text-white overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="flex justify-between items-start z-10 relative">
          <p className="font-sans text-xs sm:text-sm font-medium text-white/90 m-0 leading-tight max-w-[80%] uppercase tracking-wider">
            Monto Pendiente
          </p>
          <div className="bg-white/15 p-2 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-white" />
          </div>
        </div>
        <div className="z-10 relative mt-auto">
          <p className="font-serif text-3xl sm:text-4xl font-normal m-0 leading-none drop-shadow-sm">
            ${stats.montoPendiente.toLocaleString("es-MX")}
          </p>
        </div>
        <div className="absolute -right-[10%] -bottom-[15%] opacity-10 -rotate-[15deg] pointer-events-none z-0">
          <CreditCard size={100} className="text-white" />
        </div>
      </div>

      {/* Puntos Stella */}
      <div className="relative flex flex-col gap-4 bg-gradient-to-br from-[#2d3748] to-[#1a202c] p-5 sm:p-6 rounded-2xl shadow-md text-white overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="flex justify-between items-start z-10 relative">
          <p className="font-sans text-xs sm:text-sm font-medium text-white/90 m-0 leading-tight max-w-[80%] uppercase tracking-wider">
            Puntos Stella
          </p>
          <div className="bg-white/15 p-2 rounded-xl flex items-center justify-center shrink-0">
            <Star size={18} className="text-white fill-white/20" />
          </div>
        </div>
        <div className="z-10 relative mt-auto">
          <p className="font-serif text-3xl sm:text-4xl font-normal m-0 leading-none drop-shadow-sm">
            {stats.puntosLealtad.toLocaleString("es-MX")}
          </p>
        </div>
        <div className="absolute -right-[10%] -bottom-[15%] opacity-10 -rotate-[15deg] pointer-events-none z-0">
          <Star size={100} className="text-white" />
        </div>
      </div>

      {/* Estatus → Enlace a Lealtad */}
      <Link href="/dashboard/cliente/lealtad" className="no-underline">
        <div className="relative flex flex-col gap-4 bg-gradient-to-br from-[#e0e5da] to-[#cfd8c6] p-5 sm:p-6 rounded-2xl shadow-md text-[#2d3748] overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">
          <div className="flex justify-between items-start z-10 relative">
            <p className="font-sans text-xs sm:text-sm font-bold text-[#4a5568]/80 m-0 leading-tight max-w-[80%] uppercase tracking-wider">
              Estatus de Lealtad
            </p>
            <div className="bg-[#8c9768]/15 p-2 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-[#6b754f]" />
            </div>
          </div>
          <div className="z-10 relative mt-auto">
            <p className="font-serif text-3xl sm:text-4xl font-semibold m-0 leading-none text-[#4a5568] drop-shadow-sm italic">
              {stats.nivelLealtad}
            </p>
            <p className="font-sans text-[10px] text-[#6b754f] font-semibold mt-2 flex items-center gap-1 uppercase tracking-wider">
              Ver mis recompensas <ChevronRight size={12} />
            </p>
          </div>
          <div className="absolute -right-[10%] -bottom-[15%] opacity-[0.05] -rotate-[15deg] pointer-events-none z-0">
            <TrendingUp size={100} className="text-[#4a5568]" />
          </div>
        </div>
      </Link>
    </div>
  );
}
