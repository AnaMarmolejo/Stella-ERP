import LoginForm from "./_components/LoginForm";
import ResetLayout from "@/app/resetPass/_components/ResetLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
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
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </ResetLayout>
  );
}
