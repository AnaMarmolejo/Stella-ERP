"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  FileText,
} from "lucide-react";
import { Order, OrderStatus } from "../type";

// Import Modals
import TrackingModal from "./modals/TrackingModal";
import ReviewModal from "./modals/ReviewModal";
import ReceiptModal from "./modals/ReceiptModal";
import OrderDetailsModal from "./modals/OrderDetailsModal";

interface OrderCardProps {
  order: Order;
  activeTab: "pedidos" | "comprar_nuevo" | "cancelados";
}

const COLORS = {
  bg: "#f6f4ef",
  bgAlt: "#ede9e3",
  white: "#ffffff",
  slate: "#708090",
  slateDeep: "#4a5568",
  rose: "#b76e79",
  slateBorder: "rgba(112,128,144,0.18)",
  slateMid: "rgba(112,128,144,0.25)",
  sageSm: "rgba(140,151,104,0.08)",
  sageLg: "rgba(140,151,104,0.22)",
  roseMid: "rgba(183,110,121,0.32)",
};

const statusConfig: Record<
  OrderStatus,
  { text: string; icon: any; label: string }
> = {
  pendiente: {
    text: COLORS.slateDeep,
    icon: <Clock size={20} color={COLORS.slate} />,
    label: "Pendiente",
  },
  pagado: {
    text: COLORS.slateDeep,
    icon: <CheckCircle2 size={20} color={COLORS.slate} />,
    label: "Preparando envío",
  },
  enviado: {
    text: COLORS.rose,
    icon: <Truck size={20} color={COLORS.slate} />,
    label: "Entregado",
  },
  cancelado: {
    text: COLORS.slate,
    icon: <Package size={20} color={COLORS.slate} />,
    label: "Cancelado",
  },
};

export default function OrderCard({ order, activeTab }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "tracking" | "review" | "receipt" | "details" | null
  >(null);

  const status = statusConfig[order.estado] || statusConfig.pendiente;

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-white border border-[#708090]/15 rounded-2xl overflow-hidden flex flex-col font-sans transition-all duration-300 relative ${
          isHovered ? "shadow-xl shadow-[#8c9768]/10 -translate-y-1" : "shadow-sm"
        }`}
      >
        {/* Header */}
        <div className="bg-[#f6f4ef]/60 px-4 sm:px-6 py-4 border-b border-[#708090]/15 flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-6">
          <div className="flex gap-4 sm:gap-8 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-[11px] text-[#4a5568] uppercase font-semibold tracking-wider">
                Pedido Realizado
              </span>
              <span className="text-sm text-[#708090] font-medium">
                {order.fecha}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-[11px] text-[#4a5568] uppercase font-semibold tracking-wider">
                Total
              </span>
              <span className="text-sm text-[#708090] font-medium">
                ${order.total.toLocaleString()}
              </span>
            </div>

            {order.direccion_envio && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] text-[#4a5568] uppercase font-semibold tracking-wider">
                  Enviar a
                </span>
                <span className="text-sm text-[#b76e79] cursor-pointer flex items-center gap-1 hover:underline">
                  Stella Cliente <ChevronRight size={14} />
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 items-start md:items-end w-full md:w-auto">
            <span className="text-[10px] sm:text-[11px] text-[#4a5568] uppercase font-semibold tracking-wider">
              Pedido n.º {order.id}
            </span>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => setActiveModal("details")}
                className="bg-transparent border-none p-0 text-[#b76e79] hover:text-[#a45f69] hover:underline cursor-pointer transition-colors"
              >
                Detalles del pedido
              </button>
              <span className="text-[#708090]/30">|</span>
              <button
                onClick={() => setActiveModal("receipt")}
                className="bg-transparent border-none p-0 text-[#b76e79] hover:text-[#a45f69] hover:underline cursor-pointer transition-colors"
              >
                Ver recibo
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
          <h3 className="font-serif text-xl sm:text-2xl font-semibold m-0 flex items-center gap-3" style={{ color: status.text }}>
            {status.icon}
            {order.estado === "enviado"
              ? `Entregado ${order.fecha}`
              : status.label}
          </h3>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Items List */}
            <div className="flex flex-col gap-6 w-full lg:w-auto lg:flex-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 sm:gap-5 w-full">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f6f4ef] shrink-0 border border-[#708090]/15 relative">
                    <img
                      src={item.imagen_url || "/LogoM.svg"}
                      alt={item.nombre_producto}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-1.5 pt-1 w-full">
                    <span className="text-[0.95rem] sm:text-base text-[#b76e79] font-medium leading-tight">
                      {item.nombre_producto}
                    </span>
                    <span className="text-sm text-[#708090]">
                      Cantidad: {item.cantidad}
                    </span>

                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                      <button
                        className={`rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                          activeTab === "comprar_nuevo"
                            ? "bg-[#b76e79] hover:bg-[#a45f69] text-white border-none shadow-sm"
                            : "bg-transparent hover:bg-[#f6f4ef] text-[#708090] border-2 border-[#708090]/25"
                        }`}
                      >
                        {activeTab === "comprar_nuevo"
                          ? "Agregar al carrito"
                          : "Comprar de nuevo"}
                      </button>

                      <button className="bg-transparent hover:bg-[#f6f4ef] rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-[#708090] border-2 border-[#708090]/25 font-medium transition-colors">
                        Ver tu artículo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Actions */}
            <div className="flex flex-col gap-3 w-full lg:w-[220px] shrink-0 mt-2 lg:mt-0">
              <button
                onClick={() => setActiveModal("tracking")}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  order.estado === "cancelado"
                    ? "bg-transparent text-[#708090] border-2 border-[#708090]/25 hover:bg-gray-50"
                    : "bg-[#b76e79] hover:bg-[#a45f69] text-white border-none shadow-md hover:shadow-lg shadow-[#b76e79]/20"
                }`}
              >
                {order.estado === "enviado" ? "Rastrear paquete" : "Ver estado"}
              </button>

              {order.estado === "enviado" && (
                <button
                  onClick={() => setActiveModal("review")}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-gray-50 text-[#708090] border-2 border-[#708090]/25 rounded-xl text-sm font-medium transition-colors"
                >
                  Dejar reseña
                </button>
              )}

              <button
                onClick={() => setActiveModal("details")}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-gray-50 text-[#708090] border-2 border-[#708090]/25 rounded-xl text-sm font-medium transition-colors"
              >
                Ver detalles del pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals Injected */}
      <TrackingModal
        isOpen={activeModal === "tracking"}
        onClose={() => setActiveModal(null)}
        order={order}
      />
      <ReviewModal
        isOpen={activeModal === "review"}
        onClose={() => setActiveModal(null)}
        order={order}
      />
      <ReceiptModal
        isOpen={activeModal === "receipt"}
        onClose={() => setActiveModal(null)}
        order={order}
      />
      <OrderDetailsModal
        isOpen={activeModal === "details"}
        onClose={() => setActiveModal(null)}
        order={order}
      />
    </>
  );
}
