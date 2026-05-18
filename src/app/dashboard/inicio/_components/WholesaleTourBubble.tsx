"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Package, Handshake, CreditCard, BarChart3, ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function WholesaleTourBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-20 right-0 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="bg-[#b76e79] p-4 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10">
                  <HelpCircle size={20} />
                  <h3 className="m-0 font-sans font-bold text-sm tracking-wide">Guía Rápida Mayorista</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 text-white/80 hover:text-white bg-transparent border-none cursor-pointer p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-slate-500 m-0 leading-relaxed font-sans">
                  ¡Hola! Este es tu panel principal. Aquí te explicamos qué hace cada sección que ves en pantalla:
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#b76e79]/10 flex items-center justify-center shrink-0 border border-[#b76e79]/20">
                      <BarChart3 size={18} color="#b76e79" />
                    </div>
                    <div>
                      <strong className="text-slate-700 text-sm font-sans block mb-0.5">Indicadores Superiores</strong>
                      <span className="text-xs text-slate-500 font-sans leading-snug block">Tarjetas con el resumen en vivo de tus compras acumuladas, saldo pendiente y ganancias estimadas.</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#b76e79]/10 flex items-center justify-center shrink-0 border border-[#b76e79]/20">
                      <Package size={18} color="#b76e79" />
                    </div>
                    <div>
                      <strong className="text-slate-700 text-sm font-sans block mb-0.5">Órdenes Recientes</strong>
                      <span className="text-xs text-slate-500 font-sans leading-snug block">La tabla central muestra el estatus actual de tus envíos. Haz clic en una orden para ver detalles o la guía de rastreo.</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#b76e79]/10 flex items-center justify-center shrink-0 border border-[#b76e79]/20">
                      <ArrowRight size={18} color="#b76e79" />
                    </div>
                    <div>
                      <strong className="text-slate-700 text-sm font-sans block mb-0.5">Menú Lateral Izquierdo</strong>
                      <span className="text-xs text-slate-500 font-sans leading-snug block">Navega a los módulos completos para crear nuevos <b>Pedidos</b>, gestionar <b>Consignaciones</b> o ver <b>Reportes</b> de venta.</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#b76e79]/10 flex items-center justify-center shrink-0 border border-[#b76e79]/20">
                      <HelpCircle size={18} color="#b76e79" />
                    </div>
                    <div>
                      <strong className="text-slate-700 text-sm font-sans block mb-0.5">Barra Superior</strong>
                      <span className="text-xs text-slate-500 font-sans leading-snug block">Revisa las notificaciones de sistema (campanita) y accede rápidamente a tu cuenta o perfil.</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#b76e79]/10 flex items-center justify-center shrink-0 border border-[#b76e79]/20">
                      <PlusCircle size={18} color="#b76e79" />
                    </div>
                    <div>
                      <strong className="text-slate-700 text-sm font-sans block mb-0.5">Botón + Nueva Venta</strong>
                      <span className="text-xs text-slate-500 font-sans leading-snug block">Usa este botón rápido (arriba a la derecha) para registrar directamente una venta de tu inventario en consignación.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#b76e79] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(183,110,121,0.4)] border-none cursor-pointer relative z-50"
        >
          {isOpen ? <X size={26} /> : <HelpCircle size={26} />}
          
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 border-2 border-white"></span>
            </span>
          )}
        </motion.button>
      </div>
      
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-40 sm:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}
