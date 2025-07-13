"use client";

import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
