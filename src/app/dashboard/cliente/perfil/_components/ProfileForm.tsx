"use client";

import { useState } from "react";
import { User, Mail, Edit2, Shield, Check, X, Loader2 } from "lucide-react";
import { UserProfile } from "../type";
import { createClient } from "@utils/supabase/client";
import { ClienteService } from "@/lib/services/ClienteService";

interface ProfileFormProps {
  profile: UserProfile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: profile.nombre,
    correo: profile.correo,
  });
  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
  });

  const handleSave = async () => {
    const newErrors = {
      nombre: formData.nombre.trim() === "" ? "El nombre es obligatorio" : "",
      correo:
        formData.correo.trim() === ""
          ? "El correo es obligatorio"
          : !/^\S+@\S+\.\S+$/.test(formData.correo)
            ? "Correo inválido"
            : "",
    };

    setErrors(newErrors);

    if (newErrors.nombre || newErrors.correo) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const clienteSvc = new ClienteService(supabase);

      // Actualizar tabla cliente
      if (profile.clienteId) {
        await clienteSvc.actualizar(profile.clienteId, {
          nombre: formData.nombre,
        });
      }

      // Actualizar tabla usuario
      await supabase
        .from("usuario")
        .update({ nombre: formData.nombre, correo: formData.correo })
        .eq("id", profile.id);

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(
        "Hubo un error al intentar guardar tu información. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 flex flex-col gap-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-2xl font-semibold text-[#4a5568] m-0">
          Información Personal
        </h2>
        <div className="flex gap-3 w-full sm:w-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-[#708090]/30 rounded-xl text-[#708090] text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <X size={16} /> Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#b76e79] border border-[#b76e79] rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-[#a45f69] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 bg-[#b76e79]/10 border border-[#b76e79]/20 rounded-xl text-[#b76e79] text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-[#b76e79] hover:text-white hover:border-[#b76e79] shadow-sm"
            >
              <Edit2 size={16} /> Editar Perfil
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-semibold text-[#708090] uppercase tracking-wider">
            Nombre Completo
          </label>
          {isEditing ? (
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b76e79]">
                <User size={18} />
              </div>
              <input
                value={formData.nombre}
                onChange={e =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                disabled={isLoading}
                className={`w-full py-3 pr-4 pl-12 bg-white rounded-xl text-[#2d3748] border-2 outline-none text-[0.95rem] transition-all disabled:opacity-60 ${
                  errors.nombre
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#b76e79]/40 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/20"
                }`}
              />
              {errors.nombre && (
                <span className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase tracking-tight">
                  {errors.nombre}
                </span>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 bg-[#f6f4ef] rounded-xl text-[#2d3748] flex items-center gap-3 border border-gray-200">
              <User size={18} className="text-[#b76e79]" />
              <span className="text-[0.95rem] font-medium">
                {profile.nombre}
              </span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-semibold text-[#708090] uppercase tracking-wider">
            Correo Electrónico
          </label>
          {isEditing ? (
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b76e79]">
                <Mail size={18} />
              </div>
              <input
                value={formData.correo}
                onChange={e =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                disabled={isLoading}
                className={`w-full py-3 pr-4 pl-12 bg-white rounded-xl text-[#2d3748] border-2 outline-none text-[0.95rem] transition-all disabled:opacity-60 ${
                  errors.correo
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#b76e79]/40 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/20"
                }`}
              />
              {errors.correo && (
                <span className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase tracking-tight">
                  {errors.correo}
                </span>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 bg-[#f6f4ef] rounded-xl text-[#2d3748] flex items-center gap-3 border border-gray-200">
              <Mail size={18} className="text-[#b76e79]" />
              <span className="text-[0.95rem] font-medium">
                {profile.correo}
              </span>
            </div>
          )}
        </div>

        {/* Account Type Field */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-sans text-xs font-semibold text-[#708090] uppercase tracking-wider">
            Tipo de Cuenta
          </label>
          <div className="px-4 py-3 bg-gradient-to-r from-[#e0e5da]/40 to-[#f6f4ef] rounded-xl text-[#2d3748] flex items-center gap-4 border border-[#8c9768]/20 shadow-sm">
            <div className="bg-[#8c9768]/15 p-2 rounded-lg">
              <Shield size={20} className="text-[#8c9768]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.95rem] font-bold text-[#4a5568]">
                {profile.rol}
              </span>
              <span className="text-xs text-[#708090] font-medium">
                Activo desde {profile.fechaRegistro}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
