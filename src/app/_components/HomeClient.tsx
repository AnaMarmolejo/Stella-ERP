"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ShieldCheck, Package, Sparkles, Bot,
  ArrowRight, Menu, X, ChevronRight,
  LayoutGrid, Database, CircleDollarSign, ShoppingCart, TrendingUp, Handshake, Gem, Check,
} from "lucide-react";
import LogoM from "@assets/LogoM.svg";

// ─── Paleta exacta de la imagen ───────────────────────────────────────────────
// #f6f4ef  → fondo general (crema cálido)
// #708090  → texto base, estructura, bordes, iconos (slate)
// #b76e79  → acento: palabras clave en títulos, botón CTA principal, estrellas
// #ffffff  → superficie de cards
// #8c9768  → sombras sage sutiles
const C = {
  // ── fondos ──
  bg:           "#f6f4ef",       // fondo página
  bgAlt:        "#ede9e3",       // secciones alternas ligeramente más cálidas
  white:        "#ffffff",       // cards

  // ── slate (base dominante) ──
  slate:        "#708090",       // texto párrafos, labels, bordes
  slateDeep:    "#4a5568",       // títulos principales, texto oscuro
  slateBorder:  "rgba(112,128,144,0.18)",
  slateMid:     "rgba(112,128,144,0.25)",
  slateLight:   "rgba(112,128,144,0.08)",
  slateIcon:    "rgba(112,128,144,0.12)",  // fondo de iconos

  // ── rose (acento — sólo en palabras clave y CTA) ──
  rose:         "#b76e79",
  roseDeep:     "#9c5a65",
  roseBg:       "rgba(183,110,121,0.08)",  // fondo pill badge
  roseBorder:   "rgba(183,110,121,0.22)",
  roseMid:      "rgba(183,110,121,0.32)",

  // ── sage (sombras premium multicapa) ──
  sage:         "#8c9768",
  sageSm:       "0 2px 10px rgba(140,151,104,0.05), 0 1px 3px rgba(0,0,0,0.02)",
  sageMd:       "0 10px 30px rgba(140,151,104,0.12), 0 4px 8px rgba(0,0,0,0.04)",
  sageLg:       "0 30px 60px rgba(140,151,104,0.18), 0 10px 20px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.5)",
};

// ─── Componentes de Ambiente ──────────────────────────────────────────────────
function AmbientLights() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Esquina superior izquierda */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: `radial-gradient(circle, ${C.rose} 0%, transparent 70%)`, opacity: 0.04, filter: "blur(100px)" }} />
      {/* Esquina superior derecha */}
      <div style={{ position: "absolute", top: "-5%", right: "-5%", width: "35%", height: "35%", background: `radial-gradient(circle, ${C.slate} 0%, transparent 70%)`, opacity: 0.03, filter: "blur(80px)" }} />
      {/* Esquina inferior izquierda */}
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "30%", height: "30%", background: `radial-gradient(circle, ${C.rose} 0%, transparent 70%)`, opacity: 0.03, filter: "blur(90px)" }} />
      {/* Esquina inferior derecha */}
      <div style={{ position: "absolute", bottom: "-8%", right: "-10%", width: "45%", height: "45%", background: `radial-gradient(circle, ${C.slateDeep} 0%, transparent 70%)`, opacity: 0.04, filter: "blur(120px)" }} />
    </div>
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const itemV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const containerV: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const fadeV: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};
const scaleV: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const slideV: Variants = {
  hidden: { opacity: 0, x: 44 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const menuV: Variants = {
  hidden: { opacity: 0, x: "100%" },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
  exit:   { opacity: 0, x: "100%", transition: { duration: 0.18 } },
};

function d(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureCardProps { icon: React.ReactNode; title: string; text: string; }
interface RoleCardProps    { badge: string; title: string; desc: string; perks: string[]; image?: string; }
interface ModuleCardProps  { num: string; icon: React.ReactNode; name: string; desc: string; }
interface ReviewCardProps  { text: string; initials: string; name: string; role: string; }

// ─── Feature Card — blanca limpia, icono slate, sin color extra ───────────────
function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -8, boxShadow: C.sageLg, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(24px,2.8vw,34px)",
        boxShadow: C.sageMd,
        textAlign: "center",
        position: "relative",
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 16px", background: C.slateIcon, border: `1px solid ${C.slateBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "var(--font-subtitle)", fontSize: "1.18rem", fontWeight: 600, color: C.slateDeep, marginBottom: 8, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.86rem", lineHeight: 1.68, color: C.slate, fontWeight: 400, margin: 0 }}>
        {text}
      </p>
    </motion.div>
  );
}

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ badge, title, desc, perks }: RoleCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -6, boxShadow: C.sageLg }}
      transition={{ duration: 0.3 }}
      style={{ 
        position: "relative", 
        background: C.white, 
        borderRadius: 16, 
        border: `1px solid ${C.slateBorder}`, 
        boxShadow: C.sageMd,
        padding: "32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.rose, marginBottom: 12, fontWeight: 500 }}>
        <span style={{ width: 10, height: 1, background: C.rose, display: "inline-block" }} />
        {badge}
      </div>
      <h3 style={{ fontFamily: "var(--font-subtitle)", fontSize: "clamp(1.25rem,1.9vw,1.52rem)", fontWeight: 600, color: C.slateDeep, marginBottom: 10, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.86rem", lineHeight: 1.70, color: C.slate, fontWeight: 400, marginBottom: 18 }}>
        {desc}
      </p>
      <div style={{ height: 1, background: C.slateBorder, marginBottom: 14 }} />
      <ul style={{ display: "flex", flexDirection: "column", gap: 9, listStyle: "none", padding: 0, margin: 0 }}>
        {perks.map((p) => (
          <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", color: C.slate, fontFamily: "var(--font-subtitle)" }}>
            <ChevronRight size={13} color={C.rose} style={{ flexShrink: 0 }} />
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({ num, icon, name, desc }: ModuleCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -6, boxShadow: C.sageLg, background: C.white }}
      transition={{ duration: 0.3 }}
      style={{
        background: "rgba(255,255,255,0.7)", borderRadius: 12,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(18px,2vw,24px)",
        boxShadow: C.sageSm,
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* number watermark */}
      <span style={{ position: "absolute", top: -8, right: 10, lineHeight: 1, fontFamily: "var(--font-serif)", fontSize: "4.5rem", fontWeight: 600, color: "rgba(112,128,144,0.06)", pointerEvents: "none", userSelect: "none" }}>
        {num}
      </span>
      {/* left accent */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${C.slate} 0%, transparent 100%)`, borderRadius: "12px 0 0 12px", opacity: 0.18 }} />
      <div style={{ fontSize: "1.2rem", marginBottom: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: C.slateIcon, borderRadius: 9, border: `1px solid ${C.slateBorder}` }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.93rem", fontWeight: 600, color: C.slateDeep, marginBottom: 6, letterSpacing: "-0.01em" }}>{name}</div>
      <p style={{ fontSize: "0.82rem", lineHeight: 1.62, color: C.slate, fontWeight: 400, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ─── Review Card — exactamente como la imagen ─────────────────────────────────
function ReviewCard({ text, initials, name, role }: ReviewCardProps) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -5, boxShadow: `0 18px 40px ${C.sageLg}` }}
      transition={{ duration: 0.22 }}
      style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.slateBorder}`,
        padding: "clamp(18px,2.2vw,24px)",
        boxShadow: `0 2px 10px ${C.sageSm}`,
      }}
    >
      {/* author row arriba como en la imagen */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.slateIcon}, rgba(140,151,104,0.12))`, border: `1px solid ${C.slateBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 600, color: C.slate }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 500, color: C.slateDeep }}>{name}</div>
          <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: C.sage, marginTop: 1 }}>{role}</div>
        </div>
        {/* stars right */}
        <div style={{ marginLeft: "auto", color: C.rose, fontSize: "0.82rem", letterSpacing: 1 }}>★★★★★</div>
      </div>
      <div style={{ height: 1, background: C.slateBorder, marginBottom: 14 }} />
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.08rem", fontStyle: "italic", color: C.slateDeep, lineHeight: 1.67, fontWeight: 400, margin: 0 }}>
        &ldquo;{text}&rdquo;
      </p>
    </motion.div>
  );
}

// ─── Section Header — título bicolor como en la imagen ────────────────────────
// "Lo que dicen" en slate + "Nuestros Clientes" en rose
function SectionHeader({
  eyebrow, before, accent, after, sub,
}: {
  eyebrow?: string;
  before: string;
  accent: string;
  after?: string;
  sub?: string;
}) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={containerV} style={{ textAlign: "center", marginBottom: 36 }}>
      {eyebrow && (
        <motion.p variants={d(0)} style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.rose, marginBottom: 10, fontWeight: 600, fontFamily: "var(--font-subtitle)" }}>
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 variants={d(0.06)} style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.1rem,4vw,3.2rem)", fontWeight: 500, lineHeight: 1.18, letterSpacing: "-0.01em", margin: "0 0 0" }}>
        <span style={{ color: C.slateDeep }}>{before} </span>
        <span style={{ color: C.rose }}>{accent}</span>
        {after && <span style={{ color: C.slateDeep }}> {after}</span>}
      </motion.h2>
      {sub && (
        <motion.p variants={d(0.12)} style={{ color: C.slate, fontSize: "0.94rem", lineHeight: 1.72, maxWidth: 520, margin: "12px auto 0", fontWeight: 400 }}>
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const showcaseImages = [
  { src: "/video/capturas/01_dashboard_desktop.png", type: "desktop", label: "Dashboard Central" },
  { src: "/video/capturas/04_bom_desktop.png", type: "desktop", label: "Ingeniería BOM" },
  { src: "/video/capturas/03_consignaciones_tablet.png", type: "tablet", label: "Consignaciones" },
  { src: "/video/capturas/02_campanas_desktop.png", type: "desktop", label: "Marketing" },
  { src: "/video/capturas/05_rol_admin_mobile.png", type: "mobile", label: "Admin Móvil" },
  { src: "/video/capturas/05_rol_cliente_mobile.png", type: "mobile", label: "Filtros Probadores AR" },
  { src: "/video/capturas/05_rol_mayorista_mobile.png", type: "mobile", label: "Portal Mayorista" },
];

function PresentationDeck() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  const current = showcaseImages[index];

  return (
    <div style={{ 
      position: "relative", 
      width: "100%", 
      maxWidth: "min(90vw, 850px)", 
      height: "clamp(300px, 50vh, 520px)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      margin: "0 auto"
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {/* Mockup based on type - Optimized for 1920x1080 look */}
          <div style={{ 
            position: "relative", 
            width: current.type === "mobile" ? "min(280px, 45%)" : current.type === "tablet" ? "min(580px, 90%)" : "100%",
            aspectRatio: current.type === "mobile" ? "9/19" : current.type === "tablet" ? "4/3" : "16/9",
            background: "#fff",
            borderRadius: current.type === "mobile" ? 40 : 12,
            border: current.type === "mobile" ? `10px solid ${C.slateDeep}` : `1px solid ${C.slateBorder}`,
            boxShadow: `0 40px 100px ${C.sageLg}, 0 10px 30px rgba(0,0,0,0.05)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: current.type === "desktop" ? 0 : 8,
            transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
          }}>
             <Image src={current.src} alt={current.label} fill style={{ objectFit: "contain" }} />
             
             {/* Glass Reflection Effect */}
             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 5 }} />
             
             {/* Notch for mobile */}
             {current.type === "mobile" && (
               <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 90, height: 28, background: C.slateDeep, borderRadius: "0 0 18px 18px", zIndex: 10 }} />
             )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div style={{ position: "absolute", bottom: -60, display: "flex", gap: 10, padding: "10px", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", borderRadius: 100 }}>
        {showcaseImages.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setIndex(i)}
            style={{ 
              width: i === index ? 28 : 8, 
              height: 8, 
              borderRadius: 4, 
              background: i === index ? C.rose : C.slateMid,
              cursor: "pointer",
              transition: "0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: i === index ? `0 0 12px ${C.rose}` : "none"
            }} 
          />
        ))}
      </div>
      
      {/* Dynamic Label */}
      <div style={{ 
        position: "absolute", top: -45, left: "50%", transform: "translateX(-50%)",
        background: C.white, padding: "6px 16px", borderRadius: 100, border: `1px solid ${C.slateBorder}`,
        boxShadow: `0 4px 15px ${C.sageSm}`, display: "flex", alignItems: "center", gap: 8,
        whiteSpace: "nowrap"
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.rose }} />
        <span style={{ fontSize: "0.68rem", color: C.slateDeep, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase" }}>
          {current.label}
        </span>
      </div>
    </div>
  );
}

const features: FeatureCardProps[] = [
  { icon: <ShieldCheck size={20} color={C.slate} />, title: "Pagos Seguros",             text: "Stripe y SPEI con cifrado AES y cumplimiento PCI-DSS en cada transacción." },
  { icon: <Package     size={20} color={C.slate} />, title: "Inventario en Tiempo Real", text: "Control FIFO/LIFO con alertas automáticas y notificaciones push al detectar stock bajo." },
  { icon: <Sparkles    size={20} color={C.slate} />, title: "Filtros Probadores en Tiempo Real", text: "Experiencia de realidad aumentada para que tus clientes prueben cada joya virtualmente antes de comprar." },
  { icon: <Bot         size={20} color={C.slate} />, title: "IA Generativa",              text: "Análisis inteligente de información y generación automática de nombres y descripciones premium con Gemini API." },
];

const roles: RoleCardProps[] = [
  {
    badge: "Administrador",
    title: "Control Total del Negocio",
    desc: "Panel centralizado con inventarios, precios, reportes estratégicos y gestión de usuarios.",
    perks: ["Dashboard con KPIs en tiempo real", "Gestión de catálogo y precios", "Reportes y analítica predictiva", "Configuración de módulos y permisos"],
    image: "/video/capturas/05_rol_admin_mobile.png",
  },
  {
    badge: "Mayorista B2B",
    title: "Portal de Distribuidores",
    desc: "Consignaciones, créditos personalizados y facturación electrónica automática.",
    perks: ["Consignaciones trazables", "Precios y descuentos por volumen", "Reportes PDF/Excel individuales", "Facturación electrónica integrada"],
    image: "/video/capturas/05_rol_mayorista_mobile.png",
  },
  {
    badge: "Cliente Minorista B2C",
    title: "Experiencia de Compra Premium",
    desc: "Probadores virtuales en tiempo real, carrito inteligente y programa de fidelización.",
    perks: ["Filtros Probadores en Tiempo Real", "Reseñas y sistema de rating", "Seguimiento en tiempo real", "Programa de recompensas"],
    image: "/video/capturas/05_rol_cliente_mobile.png",
  },
];

const modules: ModuleCardProps[] = [
  { num: "01", icon: <LayoutGrid      size={18} color={C.slate} />, name: "Catálogo con Probadores",  desc: "Artículos con filtros de realidad aumentada para prueba inmediata." },
  { num: "02", icon: <Database        size={18} color={C.slate} />, name: "Inventario Inteligente",  desc: "WebSockets + triggers SQL para actualización automática." },
  { num: "03", icon: <CircleDollarSign size={18} color={C.slate} />, name: "Gestión de Precios",      desc: "Márgenes, descuentos por volumen y políticas de fidelización." },
  { num: "04", icon: <ShoppingCart    size={18} color={C.slate} />, name: "Pedidos y Ventas",        desc: "Trazabilidad ACID, devoluciones y panel interactivo." },
  { num: "05", icon: <TrendingUp      size={18} color={C.slate} />, name: "Reportes Estratégicos",   desc: "Dashboards con KPIs personalizables y analítica predictiva." },
  { num: "06", icon: <Handshake       size={18} color={C.slate} />, name: "Módulo Mayoristas",       desc: "Consignaciones, créditos y paneles individualizados." },
];

const techStack = [
  "Next.js","React","Tailwind CSS","Supabase","PostgreSQL",
  "Node.js / Express","Gemini AI",
  "Stripe", "JWT / OAuth 2.0", "Vercel", "CI/CD Pipeline",
];

const reviews: ReviewCardProps[] = [
  { text: "La trazabilidad de consignaciones es exactamente lo que necesitábamos. Antes perdíamos piezas; ahora tenemos control total.", initials: "MR", name: "María R.",  role: "Distribuidora Mayorista" },
  { text: "El dashboard en tiempo real me da la tranquilidad de saber qué piezas tengo disponibles desde cualquier dispositivo.",        initials: "EB", name: "Estela B.", role: "Administradora · Stella" },
  { text: "Poder probarme las joyas con los filtros en tiempo real es increíble. Ver cómo luce la pieza antes de comprarla me da una seguridad absoluta.", initials: "LC", name: "Laura C.",  role: "Cliente Minorista" },
];

const statsData = [
  { num: "80%",  label: "Adopción primer mes" },
  { num: "50%",  label: "Reducción de errores" },
  { num: "4/5",  label: "Satisfacción cliente" },
  { num: "100%", label: "Reportes automatizados" },
];

// ─── Shared padding ──────────────────────────────────────────────────────────
const SP = "clamp(44px,5.5vw,68px) clamp(20px,5vw,52px)";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomeClient() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const heroRef             = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const blobY               = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const navLinks = [
    { label: "Inicio",      href: "#" },
    { label: "Módulos",     href: "#modulos" },
    { label: "Usuarios",    href: "#usuarios" },
    { label: "Tecnología",  href: "#tecnologia" },
    { label: "Mayoristas",  href: "#contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1)).filter(id => id);
      
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset to detect section earlier
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveSection(""); // Inicio
      } else {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
                *,*::before,*::after{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        .cta-input:focus{outline:none;border-color:rgba(183,110,121,0.45)!important;box-shadow:0 0 0 3px rgba(183,110,121,0.09)!important;}
        .nav-link{transition:color 0.2s;}
        .nav-link:hover{color:#b76e79!important;}
        .foot-link:hover{color:#b76e79!important;}
        /* ── RESPONSIVE ── */
        @media(max-width:1024px){.feat-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:768px){
          .hero-inner{grid-template-columns:1fr!important;padding-top:82px!important;padding-bottom:48px!important;}
          .hero-visual-wrap{display:none!important;}
          .feat-grid{grid-template-columns:repeat(2,1fr)!important;}
          .roles-grid{grid-template-columns:1fr!important;}
          .mod-grid{grid-template-columns:repeat(2,1fr)!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .rev-grid{grid-template-columns:1fr!important;}
          .footer-flex{flex-direction:column!important;gap:14px!important;text-align:center!important;}
          .nav-links-desk{display:none!important;}
          .nav-login-desk{display:none!important;}
          .ham-btn{display:flex!important;}
          .cta-row{flex-direction:column!important;}
          .hero-stats{flex-wrap:wrap!important;}
        }
        @media(max-width:480px){
          .feat-grid{grid-template-columns:1fr!important;}
          .mod-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <main style={{ background: C.bg, color: C.slate, fontFamily: "var(--font-sans, 'Tan Mon Cheri', sans-serif)", overflowX: "hidden" }}>

        {/* ══════════ NAV ══════════ */}
        {/* Estilo igual a la imagen: fondo blanco, links slate, CTA rose */}
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            height: 60, padding: "0 clamp(20px,4vw,52px)",
            background: C.white,
            borderBottom: `1px solid ${C.slateBorder}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: `0 1px 12px ${C.sageSm}`,
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <Image src={LogoM} alt="Stella" width={150} height={80} priority style={{ objectFit: "contain", display: "block" }} />
          </motion.div>

          {/* Desktop links */}
          <ul className="nav-links-desk" style={{ display: "flex", gap: 14, listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map(({ label, href }) => {
              const isActive = activeSection === href.substring(1) || (activeSection === "" && href === "#");
              return (
                <li key={label} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-nav"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(183,110,121,0.12)",
                        borderRadius: 999,
                        zIndex: 0
                      }}
                    />
                  )}
                  <a href={href} className="nav-link" style={{ 
                    position: "relative",
                    zIndex: 1,
                    padding: "10px 24px",
                    textDecoration: "none", 
                    color: isActive ? C.rose : C.slate, 
                    fontWeight: 500,
                    textShadow: isActive ? `0 0 0.5px ${C.rose}` : "none",
                    fontSize: "0.95rem", 
                    letterSpacing: "0.04em",
                    transition: "color 0.25s ease, text-shadow 0.25s ease",
                    borderRadius: 999,
                  }}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <motion.button className="nav-login-desk" whileHover={{ color: C.rose }} onClick={() => router.push("/login")}
              style={{ display: "flex", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.78rem", color: C.slate, padding: "8px 2px", transition: "color 0.2s" }}>
              Iniciar sesión
            </motion.button>
            {/* CTA principal: rose como en la imagen */}
            <motion.button
              whileHover={{ y: -2, boxShadow: `0 8px 22px ${C.roseMid}` }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/dashboard/cliente")}
              style={{ background: C.rose, color: "#f6f4ef", border: "none", cursor: "pointer", padding: "9px 20px", borderRadius: 6, fontSize: "0.78rem", letterSpacing: "0.04em", fontFamily: "var(--font-sans, Inter, sans-serif)", boxShadow: `0 3px 10px ${C.roseBorder}`, transition: "box-shadow 0.2s" }}
            >
              Visitar Tienda
            </motion.button>
            <button className="ham-btn" onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.slate, padding: 4, alignItems: "center" }}>
              <Menu size={20} />
            </button>
          </div>
        </motion.nav>

        {/* ══════════ MOBILE MENU ══════════ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div key="mob" variants={menuV} initial="hidden" animate="show" exit="exit"
              style={{ position: "fixed", inset: 0, zIndex: 200, background: C.white, padding: "0 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Image src={LogoM} alt="Stella" width={96} height={30} style={{ objectFit: "contain" }} />
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}><X size={21} /></button>
              </div>
              <div style={{ height: 1, background: C.slateBorder }} />
              <div style={{ flex: 1, paddingTop: 24, paddingLeft: 24, paddingRight: 24, margin: "0 -24px" }}>
                {navLinks.map(({ label, href }) => {
                  const isActive = activeSection === href.substring(1) || (activeSection === "" && href === "#");
                  return (
                    <a key={label} href={href} onClick={() => setMobileOpen(false)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center",
                        justifyContent: "space-between",
                        textDecoration: "none", 
                        color: isActive ? C.rose : C.slateDeep, 
                        fontSize: "1.35rem", 
                        fontFamily: "var(--font-serif, 'Celestial', serif)", 
                        fontWeight: 300, 
                        textShadow: isActive ? `0 0 0.5px ${C.rose}` : "none",
                        padding: "16px 24px", 
                        background: isActive ? "linear-gradient(90deg, rgba(183,110,121,0.06) 0%, transparent 100%)" : "transparent",
                        borderLeft: isActive ? `3px solid ${C.rose}` : "3px solid transparent",
                        borderBottom: `1px solid ${C.slateBorder}`,
                        transition: "all 0.25s ease"
                      }}>
                      {label}
                      {isActive && <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: "1rem", color: C.rose }}>✦</motion.span>}
                    </a>
                  );
                })}
              </div>
              <div style={{ paddingBottom: 40, display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => { router.push("/dashboard/cliente"); setMobileOpen(false); }} style={{ background: C.rose, color: "#f6f4ef", border: "none", borderRadius: 6, padding: "12px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.88rem", cursor: "pointer" }}>Visitar Tienda</button>
                <div style={{ display: "flex", gap: 10 }}>
                   <button onClick={() => { router.push("/login"); setMobileOpen(false); }} style={{ flex: 1, background: "none", border: `1.5px solid ${C.slateMid}`, borderRadius: 6, padding: "10px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.80rem", color: C.slate, cursor: "pointer" }}>Inicia sesión</button>
                   <button onClick={() => { router.push("/register"); setMobileOpen(false); }} style={{ flex: 1, background: "none", border: `1.5px solid ${C.slateMid}`, borderRadius: 6, padding: "10px 0", fontFamily: "var(--font-sans, Inter, sans-serif)", fontSize: "0.80rem", color: C.slate, cursor: "pointer" }}>Regístrate</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ HERO ══════════ */}
        <section id="inicio" ref={heroRef} style={{ 
          position: "relative", 
          padding: `clamp(100px, 12vh, 160px) 0 clamp(60px, 8vh, 100px)`, 
          background: `radial-gradient(circle at 70% 30%, ${C.bgAlt} 0%, ${C.bg} 100%)`,
          overflow: "hidden" 
        }}>
          {/* subtle background accent */}
          <div style={{ position: "absolute", top: -200, right: -200, width: 800, height: 800, background: C.rose, opacity: 0.04, filter: "blur(140px)", borderRadius: "50%" }} />
          
          <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 clamp(20px, 5vw, 60px)" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1.2fr", 
              gap: "clamp(40px, 6vw, 120px)", 
              alignItems: "center" 
            }}>
              
              {/* TEXT SIDE */}
              <motion.div initial="hidden" animate="show" variants={containerV}>
                <motion.div variants={d(0)} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.white, padding: "8px 16px", borderRadius: 100, border: `1px solid ${C.slateBorder}`, boxShadow: `0 4px 12px ${C.sageSm}`, marginBottom: 24 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" }} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.slateDeep, letterSpacing: "0.05em", textTransform: "uppercase" }}>Sistema Online v4.2</span>
                </motion.div>

                <motion.h1 variants={d(0.08)} style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3.2rem, 5.8vw, 5.8rem)", fontWeight: 500, lineHeight: 1.05, color: C.slateDeep, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
                  Gestión <span style={{ color: C.rose, fontStyle: "italic" }}>Maestra</span> para Joyería.
                </motion.h1>

                <motion.p variants={d(0.16)} style={{ fontSize: "clamp(1.05rem, 1.25vw, 1.2rem)", lineHeight: 1.65, color: C.slate, maxWidth: 620, marginBottom: 40, fontWeight: 400 }}>
                  Stella ERP centraliza tu producción, inventarios y ventas con una interfaz diseñada para la excelencia y el control absoluto del negocio artesanal.
                </motion.p>

                <motion.div variants={d(0.24)} style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                  <motion.button whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${C.roseBorder}` }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/catalogo")}
                    style={{ background: C.rose, color: "#f6f4ef", border: "none", cursor: "pointer", padding: "18px 36px", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.04em", fontFamily: "var(--font-subtitle)", boxShadow: `0 4px 15px ${C.roseBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
                    Explorar Catálogo <ArrowRight size={16} />
                  </motion.button>
                  <motion.button whileHover={{ borderColor: C.slate, color: C.slateDeep, background: "rgba(255,255,255,0.5)" }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/login")}
                    style={{ background: "transparent", color: C.slate, border: `1.5px solid ${C.slateMid}`, cursor: "pointer", padding: "18px 36px", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.04em", fontFamily: "var(--font-subtitle)" }}>
                    Acceso Portal
                  </motion.button>
                </motion.div>

                {/* stats row */}
                <motion.div variants={d(0.32)} className="hero-stats" style={{ display: "flex", gap: "clamp(24px, 5vw, 60px)", marginTop: 60 }}>
                  {[{ num: "50%", label: "Menos errores" }, { num: "3", label: "Roles clave" }, { num: "10+", label: "Módulos ERP" }].map((s, i) => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.6rem", fontWeight: 600, color: C.rose, lineHeight: 1 }}>{s.num}</span>
                      <span style={{ fontSize: "0.8rem", color: C.slate, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* PRESENTATION SIDE */}
              <motion.div className="hero-visual-wrap" initial="hidden" animate="show" variants={slideV} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <PresentationDeck />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ FEATURES ══════════ */}
        <section id="modulos" style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Lo que hace" accent="diferente" after="a Stella" sub="Cada funcionalidad diseñada para resolver un problema real de la joyería artesanal." />
              <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(10px,1.6vw,16px)" }}>
                {features.map((f) => <FeatureCard key={f.title} {...f} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.slateMid},transparent)`, maxWidth: 1200, margin: "0 auto" }} />

        {/* ══════════ ROLES ══════════ */}
        <section id="usuarios" style={{ padding: SP, background: C.bg }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Una plataforma para" accent="cada rol" sub="Accesos, vistas y herramientas diseñadas para el administrador, distribuidor y comprador." />
              <div className="roles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(12px,2vw,18px)" }}>
                {roles.map((r) => <RoleCard key={r.title} {...r} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ MODULES ══════════ */}
        <section style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Módulos" accent="funcionales" sub="Independientes y escalables — activa solo lo que tu negocio necesita." />
              <div className="mod-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(9px,1.5vw,14px)" }}>
                {modules.map((m) => <ModuleCard key={m.name} {...m} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        {/* En la imagen esta sección tiene fondo slate oscuro — mantenemos ese contraste */}
        <section style={{ padding: `clamp(40px,5vw,60px) clamp(20px,5vw,52px)`, background: "#4a5568", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(246,244,239,0.05) 1px, transparent 1px)`, backgroundSize: "36px 36px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(246,244,239,0.10)" }} />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV} className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(16px,4vw,40px)", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {statsData.map((st) => (
              <motion.div key={st.label} variants={scaleV} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "clamp(2.2rem,4.2vw,3.2rem)", fontWeight: 600, color: "#f6f4ef", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.02em" }}>{st.num}</div>
                <div style={{ width: 24, height: 2, background: C.rose, margin: "0 auto 8px", borderRadius: 1 }} />
                <div style={{ fontSize: "0.67rem", color: "rgba(246,244,239,0.60)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{st.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════ TECH ══════════ */}
        <section id="tecnologia" style={{ padding: SP, background: C.bg }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Construido con" accent="tecnología de vanguardia" />
              <motion.div variants={containerV} style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", maxWidth: 820, margin: "0 auto" }}>
                {techStack.map((tech) => (
                  <motion.div key={tech} variants={fadeV}
                    whileHover={{ borderColor: C.slate, color: C.slateDeep, y: -2 }}
                    transition={{ duration: 0.18 }}
                    style={{ background: C.white, borderRadius: 5, padding: "7px 16px", border: `1px solid ${C.slateBorder}`, fontSize: "0.75rem", color: C.slate, cursor: "default", boxShadow: `0 1px 5px ${C.sageSm}`, display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.sage, display: "inline-block", flexShrink: 0 }} />
                    {tech}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ REVIEWS ══════════ */}
        <section style={{ padding: SP, background: C.bgAlt }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
              <SectionHeader before="Lo que dicen" accent="Nuestros Clientes" sub="Escuchamos cada palabra de quienes confían en nosotros para sus momentos inolvidables." />
              <div className="rev-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,1.6vw,16px)" }}>
                {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        {/* Como la barra inferior de la imagen: fondo slate oscuro, texto f6f4ef, botón rose */}
        <section id="contacto" style={{ padding: `clamp(36px,4.5vw,52px) clamp(20px,5vw,52px)`, background: "#4a5568", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(246,244,239,0.10)" }} />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={containerV}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              {/* left */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <motion.p variants={d(0)} style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(246,244,239,0.45)", marginBottom: 8, fontFamily: "var(--font-subtitle)" }}>
                  Únete al proyecto
                </motion.p>
                <motion.h2 variants={d(0.06)} style={{ fontFamily: "var(--font-serif, 'Celestial', serif)", fontSize: "clamp(1.7rem,3.4vw,2.8rem)", fontWeight: 500, color: "#f6f4ef", lineHeight: 1.18, letterSpacing: "-0.01em", margin: 0 }}>
                  Descubre tu{" "}
                  <em style={{ fontStyle: "italic", color: C.rose }}>brillo interior</em>
                </motion.h2>
                <motion.p variants={d(0.12)} style={{ fontSize: "0.92rem", lineHeight: 1.68, color: "rgba(246,244,239,0.60)", marginTop: 10, fontWeight: 400, maxWidth: 400 }}>
                  Explora nuestro catálogo y encuentra esa pieza que hablará por ti más allá de una sola palabra.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{ padding: "clamp(16px,2vw,22px) clamp(20px,5vw,52px)", background: "#3d4a5c", borderTop: `1px solid rgba(246,244,239,0.07)` }}>
          <div className="footer-flex" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Image src={LogoM} alt="Stella" width={86} height={26} style={{ objectFit: "contain", opacity: 0.70, filter: "brightness(10)" }} />
            <p style={{ fontSize: "0.68rem", color: "rgba(246,244,239,0.38)", margin: 0 }}>
              © 2025 Stella Joyería Artesanal · Proyecto ERP Web
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacidad", "Términos", "Docs"].map((link) => (
                <a key={link} href="#" className="foot-link" style={{ fontSize: "0.68rem", color: "rgba(246,244,239,0.40)", textDecoration: "none", transition: "color 0.2s" }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}