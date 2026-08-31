"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return <button className="account-logout" onClick={logout} disabled={pending}>
    {pending ? "Signing out…" : "Sign out"}
  </button>;
}
