import { describe, it, expect, vi, beforeEach } from "vitest";
import { register } from "../app/(auth)/actions";
import { redirect } from "next/navigation";
import * as supabaseServer from "../utils/supabase/server";

vi.mock("../utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Server Action: register", () => {
  let mockSignUp: any;
  let mockUpdate: any;
  let mockEq: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSignUp = vi.fn();
    mockUpdate = vi.fn().mockReturnThis();
    mockEq = vi.fn();

    const mockSupabase = {
      auth: {
        signUp: mockSignUp,
      },
      from: vi.fn().mockReturnThis(),
      update: mockUpdate,
      eq: mockEq,
    };

    (supabaseServer.createClient as any).mockResolvedValue(mockSupabase);
  });

  const crearFormData = (
    nombre: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    return formData;
  };

  it("Debe redirigir si las contraseñas no coinciden", async () => {
    const formData = crearFormData("Usuario Prueba", "test@stella.com", "clave123", "otraClave");

    await register(formData);

    expect(redirect).toHaveBeenCalledWith("/register?error=password_mismatch");
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("Debe redirigir a user_already_exists cuando signUp devuelve un usuario sin identidades", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-id", identities: [] } },
      error: null,
    });
    mockEq.mockResolvedValue({ error: null });

    const formData = crearFormData("Usuario Prueba", "test@stella.com", "clave123", "clave123");
    await register(formData);

    expect(redirect).toHaveBeenCalledWith("/register?error=user_already_exists");
  });

  it("Debe redirigir con el código de error de auth si signUp falla", async () => {
    mockSignUp.mockResolvedValue({
      data: null,
      error: { code: "invalid_password" },
    });

    const formData = crearFormData("Usuario Prueba", "test@stella.com", "clave123", "clave123");
    await register(formData);

    expect(redirect).toHaveBeenCalledWith("/register?error=invalid_password");
  });

  it("Debe actualizar el usuario y redirigir a login cuando el registro es exitoso", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-id", identities: [{ provider: "email" }] } },
      error: null,
    });
    mockEq.mockResolvedValue({ error: null });

    const formData = crearFormData("Usuario Prueba", "test@stella.com", "clave123", "clave123");
    await register(formData);

    expect(mockUpdate).toHaveBeenCalledWith({ nombre: "Usuario Prueba" });
    expect(mockEq).toHaveBeenCalledWith("id_auth", "user-id");
    expect(redirect).toHaveBeenCalledWith("/login?success=check_email");
  });

  it("No debe redirigir a login si la actualización de la tabla falla", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "user-id", identities: [{ provider: "email" }] } },
      error: null,
    });
    mockEq.mockResolvedValue({ error: { message: "DB fail" } });

    const formData = crearFormData("Usuario Prueba", "test@stella.com", "clave123", "clave123");
    await register(formData);

    expect(redirect).not.toHaveBeenCalledWith("/login?success=check_email");
  });
});
