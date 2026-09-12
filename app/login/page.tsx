"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Get plain strings from the form state
    const loginEmail = String(form.email).trim();
    const loginPassword = String(form.password);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

    if (loginError) {
      console.error("LOGIN ERROR:", loginError);
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Unable to identify the logged-in user.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);
      setError(profileError.message);
      setLoading(false);
      return;
    }

    console.log("PROFILE:", profile);

    // Create referral relationship if the user registered
    // using a referral code.
    const referralCode = String(
      user.user_metadata?.referral_code || ""
    )
      .trim()
      .toUpperCase();

    if (referralCode) {
      const { data: referral, error: referralError } =
        await supabase.rpc(
          "create_referral_relationship",
          {
            p_referral_code: referralCode,
          }
        );

      if (referralError) {
        console.error(
          "REFERRAL ERROR:",
          referralError
        );
      } else {
        console.log(
          "REFERRAL RELATIONSHIP:",
          referral
        );
      }
    }

    if (
      profile?.role === "admin" &&
      profile?.status === "active"
    ) {
      router.push("/admin");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">

        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-700"
          >
            BLUESTONIE
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">

          <h1 className="text-2xl font-extrabold text-slate-900">
            Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your dashboard.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Create account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}