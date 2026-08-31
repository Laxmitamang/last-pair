"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "../../lib/auth-client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const result = isSignup
      ? await authClient.signUp.email({
          name: String(form.get("name") ?? "").trim(),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong. Please try again.");
      setPending(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Link className="brand auth-brand" href="/">
          LAST PAIR<span>●</span>
        </Link>
        <div>
          <p className="eyebrow">Members get first look</p>
          <h1>
            Your size.<br />
            <em>Your account.</em>
          </h1>
          <p>
            Save your details today. Early drop alerts, wishlists and order history
            will arrive as the prototype grows.
          </p>
        </div>
        <small>AUTHENTIC PAIRS · HONEST SAVINGS · LIMITED DROPS</small>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">{isSignup ? "Create an account" : "Welcome back"}</p>
          <h2>{isSignup ? "Join Last Pair." : "Sign in."}</h2>
          <p className="auth-intro">
            {isSignup
              ? "Start with the essentials—we’ll keep the rest simple."
              : "Enter the details you used when joining."}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {isSignup && (
              <label>
                <span>Name</span>
                <input name="name" autoComplete="name" required placeholder="Your name" />
              </label>
            )}
            <label>
              <span>Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 12 : undefined}
                required
                placeholder={isSignup ? "At least 12 characters" : "Your password"}
              />
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-submit" type="submit" disabled={pending}>
              <span>{pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</span>
              <span>→</span>
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New to Last Pair?"}{" "}
            <Link href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
          <Link className="auth-back" href="/">← Return to the latest drop</Link>
        </div>
      </section>
    </main>
  );
}
