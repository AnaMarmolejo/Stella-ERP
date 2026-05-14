"use server";

import { createClient } from "@utils/supabase/server";
import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";
import { IUsuario } from "@/lib/models/Usuario";

export default async function Header() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some(c => c.name.includes("auth-token"));

  let iUsuario: IUsuario | null = null;

  if (hasSession) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id_usuario", user.id)
          .single();
          
        if (data) {
          iUsuario = data as IUsuario;
        }
      }
    } catch (error) {
      // Ignore refresh errors gracefully
    }
  }

  return <HeaderClient user={iUsuario} />;
}
