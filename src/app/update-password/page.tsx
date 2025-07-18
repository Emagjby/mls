import React, { Suspense } from "react";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
