import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Create account — Last Pair" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
