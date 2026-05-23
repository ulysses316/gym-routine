"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import {
  LoginSchema,
  type LoginState,
  RegisterSchema,
  type RegisterState,
} from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function register(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const validated = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: "Ya existe una cuenta con ese email." };
  }

  const hashedPassword = await hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect("/dashboard");
}

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "Email o contraseña incorrectos." };
  }

  const valid = await compare(password, user.hashedPassword);
  if (!valid) {
    return { message: "Email o contraseña incorrectos." };
  }

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
