"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarMenu from "@/app/_components/SideBarMenu";
import NuevaVentaHeader from "./_components/NuevaVentaHeader";
import VentaInfoForm from "./_components/VentaInfoForm";
import ProductosVenta from "./_components/ProductosVenta";
import VentaResumen from "./_components/VentaResumen";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { Mail, Info } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import NuevaVentaTourBubble from "./_components/NuevaVentaTourBubble";

function PedidoHydrator({
  onLoaded,
  onLoading,
}: {
  onLoaded: (productos: Producto[]) => void;
  onLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("pedidoId");

  useEffect(() => {
    if (id) {
      onLoading();
      const load = async () => {
        try {
          const supabase = createClient();
          const SELECT_FULL = `*, usuario:usuario(id, nombre, correo, id_rol), detalles:pedido_detalle(id, id_producto, cantidad, precio_unitario, subtotal, producto:producto(id, nombre, url_imagen))`;
          const { data, error } = await supabase
            .from("pedidos")
            .select(SELECT_FULL)
            .eq("id", id)
            .single();

          if (data && data.detalles) {
            const mapped = data.detalles.map((det: any) => ({
              id: det.id_producto,
              nombre: det.producto?.nombre || "Producto de Pedido",
              precio: det.precio_unitario,
              cantidad: det.cantidad,
            }));
            onLoaded(mapped);
          } else if (error) {
            console.error("Error cargando pedido base:", error);
          }
        } catch (err) {
          console.error("Excepción cargando pedido:", err);
        }
      };
      load();
    }
  }, [id]);

  return null;
}

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock?: number;
  categoria_nombre?: string;
  partes_seleccionadas?: string[];
  opciones?: { nombre: string; valores: { valor: string }[] }[];
  es_consignado?: boolean;
  id_consignacion_detalle?: number;
};

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  id_usuario?: number;
}

interface ProductoDisponible {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  categoria_nombre?: string;
  opciones?: any[];
  es_consignado?: boolean;
  id_consignacion_detalle?: number;
}

export default function NuevaVentaPage() {
  const { usuario } = useAuth();
  const isWholesaler = usuario?.id_rol === 3;
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cargandoPedido, setCargandoPedido] = useState(false);

  // 🔥 NUEVO ESTADO: Para el correo del ticket
  const [emailTicket, setEmailTicket] = useState("");

  const agregarProducto = (productoDisponible: ProductoDisponible) => {
    setProductos(prev => {
      const existente = prev.find(p => p.id === productoDisponible.id);

      if (existente) {
        const nuevaCantidad = existente.cantidad + 1;
        const stockDisponible = productoDisponible.stock || 0;

        if (nuevaCantidad > stockDisponible) {
          return prev;
        }

        return prev.map(p =>
          p.id === productoDisponible.id ? { ...p, cantidad: nuevaCantidad } : p
        );
      } else {
        const esJuego = productoDisponible.categoria_nombre
          ?.toLowerCase()
          .includes("juego");

        let componentes: string[] = [];
        if (esJuego) {
          const opJuego = productoDisponible.opciones?.find(
            (o: any) => o.nombre === "Componentes del Juego"
          );
          if (opJuego && opJuego.valores) {
            componentes = opJuego.valores.map((v: any) => v.valor);
          } else {
            componentes = ["Anillo", "Collar", "Aretes"];
          }
        }

        return [
          ...prev,
          {
            id: productoDisponible.id,
            nombre: productoDisponible.nombre,
            precio: productoDisponible.precio,
            cantidad: 1,
            stock: productoDisponible.stock,
            categoria_nombre: productoDisponible.categoria_nombre,
            partes_seleccionadas: esJuego ? componentes : undefined,
            opciones: productoDisponible.opciones,
            es_consignado: productoDisponible.es_consignado,
            id_consignacion_detalle: productoDisponible.id_consignacion_detalle,
          },
        ];
      }
    });
  };

  const aumentarCantidad = (id: number) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id) {
          const stock = p.stock || 0;
          if (p.cantidad < stock) {
            return { ...p, cantidad: p.cantidad + 1 };
          }
        }
        return p;
      })
    );
  };

  const disminuirCantidad = (id: number) => {
    setProductos(prev =>
      prev.map(p => {
        if (p.id === id && p.cantidad > 1) {
          return { ...p, cantidad: p.cantidad - 1 };
        }
        return p;
      })
    );
  };

  const eliminarProducto = (id: number) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const actualizarProducto = (id: number, cambios: Partial<Producto>) => {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
  };

  const handleVentaConfirmada = () => {
    setProductos([]);
    setClienteSeleccionado(null);
    setFecha(new Date().toISOString().split("T")[0]);
    setEmailTicket(""); // 🔥 Limpiamos el correo al terminar la venta
  };

  // Efecto opcional: Autocompletar el correo si el cliente seleccionado ya tiene uno en BD
  // Si en tu interfaz "Cliente" tuvieras el correo, podrías hacer:
  // useEffect(() => { if (clienteSeleccionado?.correo) setEmailTicket(clienteSeleccionado.correo); }, [clienteSeleccionado]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--beige)" }}
    >
      <SidebarMenu />

      <main
        className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto"
        style={{ background: "var(--beige)" }}
      >
        {isWholesaler && <NuevaVentaTourBubble isOpen={isTourOpen} setIsOpen={setIsTourOpen} />}
        <div className="mx-auto max-w-[1440px] space-y-8">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span
                className="h-px w-8 sm:w-12"
                style={{ background: "var(--rose-gold)" }}
              />
              <span
                className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium"
                style={{
                  color: "var(--rose-gold)",
                  fontFamily: "var(--font-marcellus)",
                }}
              >
                Gestión
              </span>
            </div>
            {cargandoPedido && (
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: "var(--rose-gold)" }}
                />
                <p className="text-xs" style={{ color: "var(--slate-light)" }}>
                  Sincronizando productos del pedido...
                </p>
              </div>
            )}
            <Suspense fallback={null}>
              <PedidoHydrator
                onLoading={() => setCargandoPedido(true)}
                onLoaded={prods => {
                  setProductos(prods);
                  setCargandoPedido(false);
                }}
              />
            </Suspense>
          </header>

          <NuevaVentaHeader />

          <div className="space-y-3">
            {isWholesaler && isTourOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">1</div>
                  <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Información General</h3>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-slate-600 mb-2 mt-0 font-sans">Puedes seleccionar a tu cliente para una venta rápida (pago inmediato) o asignarle la venta para que quede registrada como cuenta por cobrar.</p>
                  <div className="bg-red-50 p-2 rounded-md border border-red-100 flex gap-2 items-start">
                    <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-red-800 m-0 leading-tight font-sans"><strong>Restricción:</strong> No puedes finalizar la venta sin seleccionar a un cliente válido de tu lista.</p>
                  </div>
                </div>
              </motion.div>
            )}
            <VentaInfoForm
              usuario={usuario}
              onClienteChange={setClienteSeleccionado}
              onFechaChange={setFecha}
            />
          </div>

          <div className="space-y-3">
            {isWholesaler && isTourOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">2</div>
                  <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Catálogo y Carrito</h3>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-slate-600 mb-2 mt-0 font-sans">Añade los productos al carrito. Usa la barra de búsqueda o <strong>utiliza tu escáner de códigos de barras</strong> para encontrar los productos rápidamente.</p>
                  <div className="bg-red-50 p-2 rounded-md border border-red-100 flex gap-2 items-start">
                    <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-red-800 m-0 leading-tight font-sans"><strong>Restricción:</strong> El sistema no te dejará añadir más productos del stock físico que posees.</p>
                  </div>
                </div>
              </motion.div>
            )}
            <ProductosVenta
              productos={productos}
              clienteSeleccionado={clienteSeleccionado}
              usuario={usuario}
              onAgregar={agregarProducto}
              onEliminar={eliminarProducto}
              onAumentar={aumentarCantidad}
              onDisminuir={disminuirCantidad}
              onActualizar={actualizarProducto}
            />
          </div>

          {/* 🔥 NUEVA SECCIÓN: Captura de correo para ticket */}
          <div className="space-y-3">
            {isWholesaler && isTourOpen && productos.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-[#b76e79] flex items-center justify-center shadow-sm shrink-0">
                    <Mail size={16} />
                  </div>
                  <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Ticket Digital (Opcional)</h3>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-slate-600 mb-0 mt-0 font-sans">Si deseas automatizar el envío de remisión, ingresa aquí el correo de tu cliente. Si lo dejas vacío, solo se registrará la venta.</p>
                </div>
              </motion.div>
            )}
            {productos.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold text-[#4a5568] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Mail size={16} className="text-[#b76e79]" />
                  Envío de Ticket Digital (Opcional)
                </h3>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={emailTicket}
                    onChange={e => setEmailTicket(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#b76e79] focus:ring-1 focus:ring-[#b76e79] transition-all text-[#4a5568]"
                  />
                  <p className="text-xs text-slate-400 ml-1">
                    Ingresa el correo del cliente. Al confirmar la venta, se
                    enviará el recibo automáticamente.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 🔥 Pasamos el correo a VentaResumen mediante una nueva prop */}
          <div className="space-y-3">
            {isWholesaler && isTourOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#b76e79]/30 rounded-xl p-4 shadow-sm mb-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">3</div>
                  <h3 className="m-0 text-slate-700 font-sans font-semibold text-lg">Resumen y Pago</h3>
                </div>
                <div className="pl-11">
                  <p className="text-sm text-slate-600 mb-0 mt-0 font-sans">Revisa el subtotal, los descuentos, elige los métodos de pago y confirma la transacción para registrarla en el sistema.</p>
                </div>
              </motion.div>
            )}
            <VentaResumen
              productos={productos}
              cliente={clienteSeleccionado}
              vendedor={usuario?.nombre || "Usuario actual"}
              idUsuario={usuario?.id || ""}
              fecha={fecha}
              esVentaMayorista={
                usuario?.id_rol === 1 && !!clienteSeleccionado?.id_usuario
              }
              emailTicket={emailTicket}
              onConfirmed={handleVentaConfirmada}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
