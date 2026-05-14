"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import OrderCard from "./_components/OrderCard";
import {
  Order,
  OrderItem,
  OrdersStats as IOrdersStats,
  OrderStatus,
} from "./type";
import { ShoppingBag, Search } from "lucide-react";

// Importamos el servicio que acabamos de crear
import { VentaService } from "@/lib/services/VentaService"; // Ajusta esta ruta a tu estructura

export type TabType = "pedidos" | "comprar_nuevo" | "cancelados";

export default function OrdersPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<IOrdersStats>({
    totalPedidos: 0,
    pedidosEnviados: 0,
    puntosAcumulados: 0,
  });

  const [activeTab, setActiveTab] = useState<TabType>("pedidos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      // Si no hay usuario cargado, salimos temprano
      if (!usuario?.id) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const ventaService = new VentaService(supabase);

        // Llamamos a nuestro servicio limpio
        const { ventas, error } = await ventaService.obtenerPedidosDeUsuario(
          usuario.id as unknown as number
        );

        if (error) throw new Error(error);

        if (ventas && mounted) {
          const formattedOrders: Order[] = ventas.map(venta => {
            // Mapeamos los items de "detallesventas" al formato OrderItem de la UI
            const items: OrderItem[] =
              venta.detalles?.map(detalle => ({
                id: detalle.id,
                id_producto: detalle.id_producto || 0,
                nombre_producto:
                  detalle.producto?.nombre || "Producto Desconocido",
                cantidad: detalle.cantidad || 1,
                precio_unitario: detalle.producto?.precio || 0,
                imagen_url: detalle.producto?.url_imagen || "/LogoM.svg",
              })) || [];

            // Normalizamos el estado de la base de datos para la UI
            let estadoUI: OrderStatus = "pendiente";
            const dbEstado = (venta.estado || "").toLowerCase();
            if (dbEstado.includes("envia") || dbEstado.includes("ruta"))
              estadoUI = "enviado";
            else if (
              dbEstado.includes("paga") ||
              dbEstado.includes("completado")
            )
              estadoUI = "pagado";
            else if (dbEstado.includes("cancel")) estadoUI = "cancelado";

            // Retornamos el objeto con la interfaz exacta que espera tu <OrderCard />
            return {
              id: venta.id,
              fecha: venta.fecha
                ? new Date(venta.fecha).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Fecha desconocida",
              total: Number(venta.total) || 0,
              estado: estadoUI,
              items,
              metodo_pago: "Método en tienda", // Ajustar si agregas métodos de pago después
              direccion_envio: "Envío a domicilio", // Ajustar si agregas direcciones después
            };
          });

          setOrders(formattedOrders);
          updateStats(formattedOrders);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    function updateStats(allOrders: Order[]) {
      if (mounted) {
        setStats({
          totalPedidos: allOrders.length,
          pedidosEnviados: allOrders.filter(o => o.estado === "enviado").length,
          puntosAcumulados: Math.floor(
            allOrders.reduce((acc, o) => acc + o.total, 0) / 10
          ),
        });
      }
    }

    if (!authLoading) {
      fetchOrders();
    }

    return () => {
      mounted = false;
    };
  }, [usuario, authLoading]);

  const displayedOrders = orders.filter(order => {
    if (activeTab === "pedidos" && order.estado === "cancelado") return false;
    if (activeTab === "cancelados" && order.estado !== "cancelado")
      return false;
    if (activeTab === "comprar_nuevo" && order.estado === "cancelado")
      return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchId = order.id.toString().includes(term);
      const matchItem = order.items.some(item =>
        item.nombre_producto.toLowerCase().includes(term)
      );
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f4ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] flex flex-col">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>

      <HeaderClient user={usuario} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#4a5568] m-0 mb-2">
            Mis <span className="text-[#b76e79] italic">Pedidos</span>
          </h1>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#708090]/20 gap-4 pb-2">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-6 w-full md:w-auto pb-1">
              <button
                onClick={() => setActiveTab("pedidos")}
                className={`whitespace-nowrap px-2 sm:px-4 py-2 text-sm sm:text-[0.95rem] transition-all font-sans border-b-4 ${
                  activeTab === "pedidos"
                    ? "border-[#b76e79] text-[#b76e79] font-semibold"
                    : "border-transparent text-[#4a5568] font-medium hover:text-[#b76e79]"
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveTab("comprar_nuevo")}
                className={`whitespace-nowrap px-2 sm:px-4 py-2 text-sm sm:text-[0.95rem] transition-all font-sans border-b-4 ${
                  activeTab === "comprar_nuevo"
                    ? "border-[#b76e79] text-[#b76e79] font-semibold"
                    : "border-transparent text-[#4a5568] font-medium hover:text-[#b76e79]"
                }`}
              >
                Comprar de nuevo
              </button>
              <button
                onClick={() => setActiveTab("cancelados")}
                className={`whitespace-nowrap px-2 sm:px-4 py-2 text-sm sm:text-[0.95rem] transition-all font-sans border-b-4 ${
                  activeTab === "cancelados"
                    ? "border-[#b76e79] text-[#b76e79] font-semibold"
                    : "border-transparent text-[#4a5568] font-medium hover:text-[#b76e79]"
                }`}
              >
                Pedidos cancelados
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center w-full md:w-auto mb-2 md:mb-0 relative shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search size={16} className="text-[#708090]" />
              </div>
              <input
                placeholder="Buscar en pedidos"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-64 py-2.5 pr-4 pl-9 text-sm border border-[#708090]/25 rounded-l-lg outline-none bg-white text-[#4a5568] font-sans focus:border-[#b76e79] transition-colors"
              />
              <button className="bg-[#4a5568] hover:bg-[#374151] transition-colors text-white border-none py-2.5 px-4 rounded-r-lg text-sm font-semibold cursor-pointer font-sans">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {activeTab === "pedidos" && !searchTerm && (
          <div className="mb-6">
            <span className="text-sm font-semibold text-[#4a5568]">
              {displayedOrders.length} pedidos
            </span>
            <span className="text-sm text-[#708090]"> realizados en tu cuenta.</span>
          </div>
        )}

        <div className="flex flex-col gap-6 sm:gap-8">
          {displayedOrders.length > 0 ? (
            displayedOrders.map(order => (
              <OrderCard key={order.id} order={order} activeTab={activeTab} />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-[#708090]/40 mt-4 shadow-sm">
              <ShoppingBag
                size={48}
                className="text-[#b76e79] opacity-50 mx-auto mb-4"
              />
              <h3 className="font-serif text-2xl text-[#4a5568] m-0 mb-2">
                No encontramos pedidos
              </h3>
              <p className="font-sans text-[#708090] mb-6 max-w-md mx-auto">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}"`
                  : "Te invitamos a realizar tu primera compra en nuestra tienda."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() =>
                    (window.location.href = "/dashboard/cliente/catalogo")
                  }
                  className="px-6 py-2.5 bg-[#b76e79] hover:bg-[#a45f69] transition-colors text-white border-none rounded-xl font-sans font-medium cursor-pointer shadow-md shadow-[#b76e79]/20"
                >
                  Continuar comprando
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
