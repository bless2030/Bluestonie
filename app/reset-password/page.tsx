"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event);

      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setChecking(false);
      }
    });

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("RESET SESSION:", session);

      if (session) {
        setReady(true);
        setChecking(false);
      } else {
        setTimeout(async () => {
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();

          if (retrySession) {
            setReady(true);
          } else {
            setError(
              "This password reset link is invalid or has expired. Please request a new reset link."
            );
          }

          setChecking(false);
        }, 1500);
      }
    }

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      console.error("PASSWORD UPDATE ERROR:", updateError);
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Your password has been updated successfully. Redirecting to login..."
    );

    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
    }, 1500);
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
            Create a new password
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">

          <h1 className="text-2xl font-extrabold text-slate-900">
            Create New Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter and confirm your new BLUESTONIE password below.
          </p>

          {checking && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              Verifying your password reset link...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {ready && !message && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
  <label
    htmlFor="password"
    className="text-sm font-semibold text-slate-700"
  >
    New password
  </label>

  <div className="relative mt-2">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter new password"
      autoComplete="new-password"
      required
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 hover:text-blue-700"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>
              <div>
  <label
    htmlFor="confirmPassword"
    className="text-sm font-semibold text-slate-700"
  >
    Confirm new password
  </label>

  <div className="relative mt-2">
    <input
      id="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm new password"
      autoComplete="new-password"
      required
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 hover:text-blue-700"
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

              <p className="text-xs text-slate-500">
                Password must be at least 6 characters.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating Password..."
                  : "Create New Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}