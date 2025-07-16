"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  console.log("🔍 Login action called");

  const supabase = await createClient();
  console.log("✅ Supabase client created");

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("📧 Login data:", {
    email: data.email,
    password: data.password ? "[HIDDEN]" : "undefined",
  });

  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  console.log("📋 Login response:", {
    user: loginData.user
      ? { id: loginData.user.id, email: loginData.user.email }
      : null,
    session: loginData.session ? "Session created" : "No session",
    error: error ? { message: error.message, status: error.status } : null,
  });

  if (error) {
    console.error("❌ Login error:", error);
    redirect("/error");
  }

  console.log("✅ Login successful, redirecting...");
  revalidatePath("/", "layout");
  redirect("/");
}
