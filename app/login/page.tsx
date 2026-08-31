import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Sign in — Last Pair" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
