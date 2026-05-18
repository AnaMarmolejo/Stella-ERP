"use client";
import { Package, Clock, Wrench } from "lucide-react";
import { Pedido } from "../type";

type Props = {
  pedidos: Pedido[];
};

export default function PedidosStats({ pedidos }: Props) {
  const enProduccion = pedidos.filter(
    p => p.estado === "EN_PRODUCCION"
  ).length;

  const pendientes = pedidos.filter(
    p => p.estado === "PENDIENTE"
  ).length;

  const items = [
    { label: "Total Proyectos", value: pedidos.length, bgStart: "#758390", bgEnd: "#657582", icon: Package },
    { label: "En producción", value: enProduccion, bgStart: "#C07E88", bgEnd: "#B76E79", icon: Wrench },
    { label: "Pendientes", value: pendientes, bgStart: "#758390", bgEnd: "#657582", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 w-full">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="relative flex flex-col items-center sm:items-start gap-1 sm:gap-3 p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md text-white overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              background: `linear-gradient(to bottom right, ${item.bgStart}, ${item.bgEnd})`,
            }}
          >
            <div className="flex w-full justify-center sm:justify-between items-start z-10 relative">
              <p className="font-sans text-[8px] sm:text-xs lg:text-sm font-semibold sm:font-medium text-white/90 m-0 leading-tight uppercase tracking-wider text-center sm:text-left w-full sm:w-[70%]">
                {item.label}
              </p>
              <div className="hidden sm:flex bg-white/15 p-2 rounded-xl items-center justify-center shrink-0">
                <Icon size={18} className="text-white" />
              </div>
            </div>
            
            <div className="z-10 relative mt-0.5 sm:mt-auto sm:pt-4 w-full text-center sm:text-left">
              <p className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal m-0 leading-none drop-shadow-sm">
                {item.value}
              </p>
            </div>
            
            <div className="hidden sm:block absolute -right-[10%] -bottom-[15%] opacity-10 -rotate-[15deg] pointer-events-none z-0 transition-transform duration-500 group-hover:scale-110">
                <Icon size={100} className="text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}