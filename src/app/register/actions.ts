"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  console.log("🔍 Register action called");

  // Debug: Log all form data
  console.log("📝 All form data entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}: ${key === "password" ? "[HIDDEN]" : value}`);
  }

  const supabase = await createClient();
  console.log("✅ Supabase client created");

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    fullName: formData.get("fullName") as string,
  };

  console.log("📧 Registration data:", {
    email: data.email,
    password: data.password ? "[HIDDEN]" : "undefined",
  });

  const { data: signupData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  console.log("📋 Signup response:", {
    user: signupData.user
      ? { id: signupData.user.id, email: signupData.user.email }
      : null,
    session: signupData.session ? "Session created" : "No session",
    error: error ? { message: error.message, status: error.status } : null,
  });

  if (error) {
    console.error("❌ Signup error:", error);
    redirect("/error");
  }

  console.log("✅ Signup successful, redirecting to check email page...");
  revalidatePath("/", "layout");
  redirect("/check-email");
}
