"use client";

import Link from "next/link";
import { 
  BookOpen, 
  Package, 
  Handshake, 
  CreditCard, 
  BarChart3, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function FaqManualMayorista() {
  const cards = [
    {
      title: "Módulo de Pedidos",
      desc: "Solicita nueva mercancía de nuestro catálogo de mayoreo. Crea, consulta y da seguimiento a tus envíos.",
      icon: <Package size={24} color="#b76e79" />,
      href: "/dashboard/inicio/pedidos",
      linkText: "Ir a Pedidos"
    },
    {
      title: "Consignaciones",
      desc: "Gestiona inventario a préstamo. Solicita lotes, revisa fechas de corte y reporta ventas para liquidación.",
      icon: <Handshake size={24} color="#b76e79" />,
      href: "/dashboard/inicio/consignaciones",
      linkText: "Ir a Consignaciones"
    },
    {
      title: "Cuentas por Cobrar",
      desc: "Control de adeudos. Revisa saldos pendientes, fechas de vencimiento e historial de pagos.",
      icon: <CreditCard size={24} color="#b76e79" />,
      href: "/dashboard/inicio",
      linkText: "Ir a Finanzas"
    },
    {
      title: "Reportes",
      desc: "Analiza tus compras. Visualiza gráficas, filtra por fechas y exporta tu información fácilmente.",
      icon: <BarChart3 size={24} color="#b76e79" />,
      href: "/dashboard/inicio/reports",
      linkText: "Ir a Reportes"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl md:rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#b76e79]/10 p-6 md:p-10 lg:p-12 mb-10 w-full"
    >
      <div className="text-center mb-10 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-8 md:w-12 bg-[#b76e79]/60" />
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#b76e79]">
            Exclusivo Mayoristas
          </span>
          <span className="h-px w-8 md:w-12 bg-[#b76e79]/60" />
        </div>
        <h2 className="font-marcellus text-2xl md:text-3xl lg:text-4xl text-slate-800 m-0 flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4">
          <span className="flex items-center gap-2">
            <BookOpen color="#b76e79" className="w-6 h-6 md:w-8 md:h-8" />
            Manual de Usuario
          </span>
          <em className="text-[#b76e79] italic">Operativo</em>
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed px-4">
          Guía rápida para gestionar tu inventario, pedidos y finanzas en Stella ERP.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="group flex flex-col bg-slate-50/50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-[#b76e79]/20 hover:shadow-[0_8px_30px_rgba(183,110,121,0.06)] transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#b76e79]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h3 className="font-sans text-base md:text-lg font-bold text-slate-800 mb-2">
              {card.title}
            </h3>
            <p className="font-sans text-sm text-slate-500 leading-relaxed mb-6 flex-1">
              {card.desc}
            </p>
            <Link 
              href={card.href} 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b76e79] mt-auto hover:gap-2.5 transition-all duration-300 w-fit"
            >
              {card.linkText} <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 md:mt-14 p-6 md:p-8 bg-[#b76e79]/[0.02] rounded-2xl border border-[#b76e79]/10 border-dashed">
        <h4 className="font-sans text-slate-800 m-0 mb-6 flex items-center gap-2.5 text-base md:text-lg font-semibold">
          <div className="w-8 h-8 rounded-full bg-[#b76e79]/10 flex items-center justify-center">
            <ArrowRight size={16} color="#b76e79" />
          </div>
          Flujo Logístico
        </h4>
        <ul className="text-slate-500 text-sm md:text-base m-0 pl-4 md:pl-12 space-y-4 font-sans leading-relaxed list-none relative">
          <div className="absolute left-[27px] md:left-[59px] top-3 bottom-3 w-px bg-[#b76e79]/20 hidden sm:block" />
          
          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline">Solicitud:</strong> Genera tu solicitud de contacto/ingreso o tu solicitud de consignación.
            </div>
          </li>
          
          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline mb-1.5">Validación:</strong> 
              <ul className="list-disc pl-5 mt-1 space-y-1.5 text-sm">
                <li><span className="font-semibold text-slate-600">Ingreso a Mayoreo:</span> Evaluamos tu perfil y al ser aprobado obtienes <span className="font-semibold text-[#b76e79]">25% de descuento</span> en todos los productos.</li>
                <li><span className="font-semibold text-slate-600">Consignaciones:</span> Son validadas únicamente por el administrador. <em className="text-slate-400 text-[13px]">(Nuevos mayoristas no son aptos de inicio).</em></li>
              </ul>
            </div>
          </li>

          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline">Realizar Pedidos:</strong> Con tu cuenta activa, realiza tus pedidos con precios exclusivos o selecciona el inventario a consignar.
            </div>
          </li>
          
          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline">Despacho:</strong> Envío de mercancía o recolección física en tienda.
            </div>
          </li>
          
          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline">Finanzas:</strong> Se genera tu cuenta por cobrar automáticamente.
            </div>
          </li>
          
          <li className="relative flex items-start gap-3 md:gap-4">
            <span className="hidden sm:flex z-10 absolute -left-[36px] md:-left-[48px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b76e79] ring-4 ring-white" />
            <div>
              <strong className="text-slate-700 block md:inline">Análisis:</strong> Todo se refleja en tus reportes para que analices tus <span className="font-semibold text-[#b76e79]">ganancias, productos más vendidos</span> y métricas de negocio.
            </div>
          </li>
        </ul>
      </div>
    </motion.section>
  );
}
