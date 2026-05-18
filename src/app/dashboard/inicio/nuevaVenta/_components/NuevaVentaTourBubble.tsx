"use client";

import { motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function NuevaVentaTourBubble({ isOpen, setIsOpen }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#b76e79] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(183,110,121,0.4)] border-none cursor-pointer relative z-50"
        title="Activar/Desactivar Guía Interactiva"
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
  );
}
