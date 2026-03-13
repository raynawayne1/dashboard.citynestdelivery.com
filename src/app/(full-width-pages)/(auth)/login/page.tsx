// This is a Client Component, so we can't export `metadata` here
"use client";

import SignInForm from "@/components/auth/SignInForm";

export default function LoginPage() {
  return <SignInForm />;
}
