"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DURATION = 30000;
const SLIDE_COUNT = 5;
const SLIDE_DURATION = TOTAL_DURATION / SLIDE_COUNT;
const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const textDeepSlate = "text-[#3F4C59]"; 
const brandPink = "text-[#b97a7a]";
const brandPinkHex = "#b97a7a";
const slateGrayHex = "#708090"; 

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <HeroSlide key="hero" />,
    <CampanasSlide key="campanas" />,
    <ConsignacionesSlide key="consignaciones" />,
    <BOMSlide key="bom" />,
    <RolesSlide key="roles" />
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev < SLIDE_COUNT - 1 ? prev + 1 : 0));
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#F6F3EF] font-sans overflow-hidden">
      <BackgroundParticles />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentSlide}
          variants={slideTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#E2D1C3]/30 z-50">
         <motion.div 
            initial={{ width: "0%" }} animate={{ width: "100%" }}
            transition={{ duration: TOTAL_DURATION / 1000, ease: "linear" }}
            className={`h-full bg-[${brandPinkHex}]`}
         />
      </div>
    </div>
  );
}

// --- FONDOS ---
function BackgroundParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className={`absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-gradient-to-br from-[#EFEAE2] to-[${brandPinkHex}]/10 rounded-full blur-[80px]`} />
      <motion.div animate={{ y: [0, 40, 0], scale: [1, 1.05, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className={`absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] bg-gradient-to-tl from-[#EFEAE2] to-[${slateGrayHex}]/10 rounded-full blur-[100px]`} />
      
      <Star top="10%" left="15%" size="text-3xl" color={`text-[${brandPinkHex}]/40`} delay={0} duration={4} />
      <Star top="25%" left="80%" size="text-xl" color={`text-[${slateGrayHex}]/30`} delay={0.5} duration={5} />
      <Star top="70%" left="10%" size="text-4xl" color={`text-[${brandPinkHex}]/20`} delay={1} duration={6} />
      <Star top="85%" left="85%" size="text-2xl" color={`text-[${slateGrayHex}]/40`} delay={0.2} duration={4.5} />
      <Star top="45%" left="40%" size="text-lg" color={`text-[${brandPinkHex}]/30`} delay={0.8} duration={3.5} />
      <Star top="15%" left="50%" size="text-xl" color={`text-[${slateGrayHex}]/30`} delay={1.2} duration={5.5} />
      <Star top="55%" left="90%" size="text-3xl" color={`text-[${brandPinkHex}]/15`} delay={0.4} duration={7} />
      <Star top="80%" left="30%" size="text-xl" color={`text-[${slateGrayHex}]/35`} delay={0.6} duration={4} />
      <Star top="35%" left="20%" size="text-2xl" color={`text-[${brandPinkHex}]/25`} delay={0.1} duration={5} />
      <Star top="5%" left="90%" size="text-lg" color={`text-[${slateGrayHex}]/20`} delay={0.9} duration={4.5} />

      <Dot top="20%" left="30%" size="w-3 h-3" color={`bg-[${brandPinkHex}]/30`} delay={0.3} duration={5} />
      <Dot top="60%" left="70%" size="w-4 h-4" color={`bg-[${slateGrayHex}]/25`} delay={0.6} duration={6} />
      <Dot top="80%" left="15%" size="w-2 h-2" color={`bg-[${brandPinkHex}]/40`} delay={0.4} duration={3} />
      <Dot top="10%" left="85%" size="w-5 h-5" color={`border border-[${slateGrayHex}]/30`} delay={1} duration={8} />
      <Dot top="40%" left="10%" size="w-6 h-6" color={`border border-[${brandPinkHex}]/25`} delay={0.7} duration={7} />
      <Dot top="90%" left="60%" size="w-3 h-3" color={`bg-[${slateGrayHex}]/25`} delay={1.2} duration={5.5} />
      <Dot top="50%" left="50%" size="w-2 h-2" color={`bg-[${brandPinkHex}]/35`} delay={0.9} duration={4} />
      <Dot top="30%" left="60%" size="w-4 h-4" color={`border border-[${slateGrayHex}]/30`} delay={0.1} duration={7} />
      <Dot top="75%" left="45%" size="w-5 h-5" color={`bg-[${brandPinkHex}]/20`} delay={0.5} duration={6.5} />
      <Dot top="15%" left="5%" size="w-3 h-3" color={`bg-[${slateGrayHex}]/30`} delay={1.1} duration={4.5} />
      <Dot top="65%" left="25%" size="w-4 h-4" color={`bg-[${brandPinkHex}]/25`} delay={0.8} duration={6} />
      <Dot top="85%" left="95%" size="w-2 h-2" color={`bg-[${slateGrayHex}]/30`} delay={0.4} duration={4} />
    </div>
  );
}

function Star({ top, left, size, color, delay, duration }: any) {
  return (
    <motion.div 
      animate={{ y: [0, 10, 0], rotate: [0, 90, 0], opacity: [0.3, 1, 0.3] }} 
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }} 
      className={`absolute ${size} ${color}`} style={{ top, left }}
    >✦</motion.div>
  );
}

function Dot({ top, left, size, color, delay, duration }: any) {
  return (
    <motion.div 
      animate={{ y: [0, -15, 0], opacity: [0.1, 0.8, 0.1], scale: [1, 1.3, 1] }} 
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }} 
      className={`absolute rounded-full ${size} ${color}`} style={{ top, left }}
    />
  );
}

// --- TRANSICIONES GLOBALES ---
const slideTransitionVariants = {
  enter: { opacity: 0, scale: 0.98, filter: "blur(5px)" },
  center: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: fluidEase } },
  exit: { opacity: 0, scale: 1.02, filter: "blur(5px)", transition: { duration: 0.5, ease: fluidEase } }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: fluidEase, delay: 0.1 } }
};

const shadowPremium = "shadow-[0_0_80px_rgba(63,76,89,0.3)] ring-1 ring-black/5";
const textGlow = "drop-shadow-[0_10px_20px_rgba(246,243,239,0.9)]";

// --- MOCKUPS LIMPIOS MINIMALISTAS (SIN ESPACIOS BLANCOS) ---

function DesktopMockup({ src, className = "" }: { src: string, className?: string }) {
  return (
    <div className={`w-full max-h-[68vh] aspect-[16/10] bg-white rounded-2xl border border-[#E2E8F0] flex flex-col overflow-hidden relative ${shadowPremium} ${className}`}>
      <div className="h-6 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center px-4 gap-2 shrink-0">
         <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
         <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
         <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 bg-white relative overflow-hidden group">
         <motion.img 
            initial={{ y: 0 }}
            animate={{ y: "-60%" }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={src} 
            className="absolute top-0 left-0 w-full h-auto" 
            alt="Desktop Screenshot" 
         />
      </div>
    </div>
  );
}

function TabletMockup({ src, className = "" }: { src: string, className?: string }) {
  return (
    <div className={`w-full max-h-[65vh] aspect-[4/3] bg-white rounded-3xl border-[12px] border-gray-100 flex flex-col overflow-hidden relative ${shadowPremium} ${className}`}>
      <div className="flex-1 bg-white relative overflow-hidden">
         <motion.img 
            initial={{ y: 0 }}
            animate={{ y: "-50%" }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={src} 
            className="absolute top-0 left-0 w-full h-auto" 
            alt="Tablet Screenshot" 
         />
      </div>
    </div>
  );
}

function PhoneMockup({ src, className = "" }: { src: string, className?: string }) {
  return (
    <div className={`w-full max-h-[62vh] aspect-[9/19] bg-white rounded-[2.5rem] border-[10px] border-gray-100 flex flex-col overflow-hidden relative ${shadowPremium} ${className}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-4 bg-gray-100 rounded-b-xl z-20" />
      <div className="flex-1 bg-white relative overflow-hidden">
         <motion.img 
            initial={{ y: 0 }}
            animate={{ y: "-70%" }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={src} 
            className="absolute top-0 left-0 w-full h-auto" 
            alt="Phone Screenshot" 
         />
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gray-200 rounded-full z-20" />
    </div>
  );
}

// --- SLIDES INDIVIDUALES ---

function HeroSlide() {
  return (
    <div className="w-full h-full flex flex-col pt-6 relative px-12 md:px-24 z-10">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-white/60 blur-[60px] rounded-[100%] -z-10 pointer-events-none" />

      <div className="w-full flex flex-col items-center text-center h-[16%] justify-center shrink-0 mb-2">
         <motion.p variants={textVariants} initial="hidden" animate="show" className={`${brandPink} tracking-[0.3em] uppercase text-xs md:text-sm font-semibold mb-3 ${textGlow}`}>
            STELLA ERP · JOYERÍA ARTESANAL
         </motion.p>
         <motion.h1 variants={textVariants} initial="hidden" animate="show" className={`text-5xl md:text-6xl font-light ${textDeepSlate} leading-tight ${textGlow}`} style={{ fontFamily: "var(--font-marcellus), serif" }}>
            Gestión <span className={`${brandPink} font-bold italic`}>Inteligente</span>
         </motion.h1>
      </div>

      <motion.div 
        initial={{ y: "15%", scale: 0.98, opacity: 0 }} animate={{ y: "0%", scale: 1, opacity: 1 }} 
        transition={{ duration: 0.8, ease: fluidEase, delay: 0.15 }}
        className="flex-1 w-full flex justify-center items-end pb-4"
      >
        <DesktopMockup src="/video/capturas/01_dashboard_desktop.png" className="max-w-[1250px]" />
      </motion.div>
    </div>
  );
}

function CampanasSlide() {
  return (
    <div className="w-full h-full flex flex-col relative px-12 md:px-24 z-10 pt-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-white/40 blur-[80px] rounded-[100%] -z-10 pointer-events-none" />

      <div className="w-full flex justify-between items-center h-[10%] z-20 shrink-0 mb-4">
         <div className="flex-1">
            <motion.h2 variants={textVariants} initial="hidden" animate="show" className={`text-4xl md:text-5xl font-light ${textDeepSlate} ${textGlow}`} style={{ fontFamily: "var(--font-marcellus), serif" }}>
               Campañas y <span className={`${brandPink} font-bold`}>Promociones</span>
            </motion.h2>
         </div>
         <div className="flex-1 text-right">
            <motion.p variants={textVariants} initial="hidden" animate="show" className={`text-xl ${textDeepSlate}/80 font-light ml-auto max-w-sm ${textGlow}`}>
               Gestión omnicanal de banners y descuentos.
            </motion.p>
         </div>
      </div>

      <div className="flex-1 w-full relative flex justify-center items-end pb-8">
         <motion.div 
           initial={{ y: "15%", scale: 0.95, opacity: 0 }} animate={{ y: "0%", scale: 1, opacity: 1 }} 
           transition={{ duration: 0.8, ease: fluidEase, delay: 0.1 }}
           className="w-full max-w-[1050px] z-10"
         >
           {/* Invertidas */}
           <DesktopMockup src="/video/capturas/02_campanas_mobile.png" />
         </motion.div>

         <motion.div 
           initial={{ y: "30%", x: 50, rotate: 10, opacity: 0 }} animate={{ y: "10%", x: 0, rotate: 5, opacity: 1 }} 
           transition={{ duration: 0.9, ease: fluidEase, delay: 0.3 }}
           className="absolute right-[5%] bottom-[15%] w-[260px] z-30"
         >
           {/* Invertidas */}
           <PhoneMockup src="/video/capturas/02_campanas_desktop.png" />
         </motion.div>
      </div>
    </div>
  );
}

function ConsignacionesSlide() {
  return (
    <div className="w-full h-full flex items-center justify-center relative px-12 md:px-24 z-10 perspective-1000">
      
       <motion.div 
          initial={{ x: "-30%", rotateY: 25, rotateX: 10, scale: 0.8, opacity: 0 }} 
          animate={{ x: "-20%", rotateY: 15, rotateX: 5, scale: 1, opacity: 1 }} 
          transition={{ duration: 1, ease: fluidEase, delay: 0.1 }} 
          className="absolute w-[750px] lg:w-[950px] z-10"
       >
          <TabletMockup src="/video/capturas/03_consignaciones_tablet.png" />
       </motion.div>

       <motion.div 
          initial={{ x: "30%", opacity: 0 }} 
          animate={{ x: "20%", opacity: 1 }} 
          transition={{ duration: 0.8, ease: fluidEase, delay: 0.3 }} 
          className={`absolute right-[2%] xl:right-[4%] w-[380px] lg:w-[460px] bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/80 z-30 shadow-[0_40px_80px_rgba(63,76,89,0.2)]`}
       >
          <motion.h2 variants={textVariants} initial="hidden" animate="show" className={`text-4xl md:text-5xl font-light ${textDeepSlate} mb-4 leading-tight`} style={{ fontFamily: "var(--font-marcellus), serif" }}>
             Consignaciones <br/><span className={`${brandPink} font-bold`}>Mayoristas</span>
          </motion.h2>
         <motion.p variants={textVariants} initial="hidden" animate="show" className={`text-xl ${textDeepSlate}/80 font-light`}>
            Trazabilidad exacta de joyería de alto valor B2B con un control absoluto del inventario en tránsito.
         </motion.p>
      </motion.div>
      
    </div>
  );
}

function BOMSlide() {
  return (
    <div className="w-full h-full flex flex-col pt-12 relative px-12 md:px-24 z-10 perspective-1000">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-white/60 blur-[60px] rounded-[100%] -z-10 pointer-events-none" />

       <div className="w-full flex flex-col items-center text-center h-[16%] justify-center shrink-0 mb-4">
          <motion.h2 variants={textVariants} initial="hidden" animate="show" className={`text-4xl md:text-5xl font-light ${textDeepSlate} mb-2 ${textGlow}`} style={{ fontFamily: "var(--font-marcellus), serif" }}>
             Administración <span className={`${brandPink} font-bold`}>BOM</span>
          </motion.h2>
          <motion.p variants={textVariants} initial="hidden" animate="show" className={`text-lg ${textDeepSlate}/80 font-light ${textGlow}`}>
             Control milimétrico de costos y materiales.
          </motion.p>
       </div>

      <motion.div 
        initial={{ y: "15%", rotateX: 10, rotateZ: -2, opacity: 0, scale: 0.9 }} animate={{ y: "0%", rotateX: 0, rotateZ: 0, opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: fluidEase, delay: 0.15 }}
        className="flex-1 w-full flex justify-center items-center pb-8"
      >
        <DesktopMockup src="/video/capturas/04_bom_desktop.png" className="max-w-[1200px]" />
      </motion.div>
    </div>
  );
}

function RolesSlide() {
  return (
    <div className="w-full h-full flex flex-col pt-2 relative px-12 md:px-24 z-10">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-white/60 blur-[60px] rounded-[100%] -z-10 pointer-events-none" />

      <div className="w-full flex flex-col items-center text-center h-[10%] justify-center shrink-0 mb-2">
          <motion.h2 variants={textVariants} initial="hidden" animate="show" className={`text-4xl md:text-5xl font-light ${textDeepSlate} mb-2 ${textGlow}`} style={{ fontFamily: "var(--font-marcellus), serif" }}>
             Plataforma para <span className={`${brandPink} font-bold italic`}>cada rol</span>
          </motion.h2>
       </div>

      {/* Uso de shrink-0 y w-[360px] para forzar tamaños MASIVOS e idénticos sin importar el ancho de la ventana */}
      <div className="flex-1 w-full flex justify-center items-start gap-10 pt-0 pb-4 overflow-hidden">
        <RolePhone title="Admin" delay={0.1} color={brandPink} image="05_rol_admin_mobile.png" />
        <RolePhone title="Mayorista" delay={0.2} color={`text-[${slateGrayHex}]`} image="05_rol_mayorista_mobile.png" />
        <RolePhone title="Cliente" delay={0.3} color={brandPink} image="05_rol_cliente_mobile.png" />
      </div>
    </div>
  );
}

function RolePhone({ title, delay, color, image }: any) {
  const phoneReveal = {
    hidden: { opacity: 0, y: "20%", scale: 0.95 },
    show: { opacity: 1, y: "0%", scale: 1, transition: { duration: 0.7, ease: fluidEase, delay } }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
         initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
         transition={{ duration: 0.5, ease: fluidEase, delay: delay + 0.2 }}
         className="z-30"
      >
         <h3 className={`${color} font-bold text-2xl drop-shadow-sm bg-white/90 backdrop-blur-md rounded-full py-2 px-10 border border-white shadow-sm`}>
            {title}
         </h3>
      </motion.div>

       <motion.div 
         variants={phoneReveal} initial="hidden" animate="show"
         className="w-[230px] lg:w-[280px] shrink-0" 
       >
         <PhoneMockup src={`/video/capturas/${image}`} />
      </motion.div>
    </div>
  );
}
