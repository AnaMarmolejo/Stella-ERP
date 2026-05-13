import RegisterForm from "./_components/RegisterForm";
import ResetLayout from "@/app/resetPass/_components/ResetLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <ResetLayout>
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#708090] hover:text-[#B76E79] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
      <div className="w-full max-w-md space-y-4">
        {error === "password_mismatch" && (
          <p className="text-[#B76E79] text-center">
            Las contraseñas no coinciden
          </p>
        )}

        {error === "weak_password" && (
          <div className="text-[#B76E79] text-center space-y-2">
            <span className="font-bold block mb-1">
              La contraseña es muy débil.
            </span>
            <ul className="text-xs text-left inline-block list-disc list-inside opacity-80">
              <li>Mínimo 8 caracteres</li>
              <li>Mayúsculas y minúsculas</li>
              <li>Números</li>
              <li>Símbolos especiales</li>
            </ul>
          </div>
        )}

        {error === "user_already_exists" && (
          <p className="text-[#B76E79] text-center">El usuario ya existe</p>
        )}

        <RegisterForm />
      </div>
    </ResetLayout>
  );
}
