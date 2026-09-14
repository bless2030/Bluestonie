"use client";

import {
  Suspense,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setReferralCode(ref.trim().toUpperCase());
    }
  }, [searchParams]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setError("");
  setMessage("");

  if (
    !form.fullName ||
    !form.phone ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    setError("Please complete all fields.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (form.password.length < 6) {
    setError("Password must contain at least 6 characters.");
    return;
  }

  if (!agreedToTerms) {
    setError("Please agree to the Terms & Conditions and applicable policies.");
    return;
  }

  const phoneLocal = form.phone.replace(/\D/g, "");

// Allowed Ugandan mobile prefixes
const allowedPrefixes = [
  "70",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
];

if (
  phoneLocal.length !== 9 ||
  !allowedPrefixes.some((prefix) => phoneLocal.startsWith(prefix))
) {
  setError(
    "Please enter valid Number."
  );
  setLoading(false);
  return;
}

// Store in international format
const phoneNormalized = "256" + phoneLocal;

  if (!/^2567\d{8}$/.test(phoneNormalized)) {
    setError("Please enter a valid Ugandan mobile phone number.");
    return;
  }

  setLoading(true);

  const { data: phoneExists, error: phoneCheckError } = await supabase.rpc(
  "phone_already_registered",
  {
    p_phone_normalized: phoneNormalized,
  }
);

if (phoneCheckError) {
  setError("Unable to check the phone number. Please try again.");
  setLoading(false);
  return;
}

if (phoneExists === true) {
  setError(
    "This phone number is already registered. Please use a different number or log in to your existing account."
  );
  setLoading(false);
  return;
}

 // Check existing email
const email = form.email.trim().toLowerCase();

const { data: emailExists, error: emailCheckError } =
  await supabase.rpc("email_already_registered", {
    p_email: email,
  });

if (emailCheckError) {
  setError("Unable to check the email address. Please try again.");
  setLoading(false);
  return;
}

if (emailExists === true) {
  setError(
    "This email address is already registered. Please use a different email or log in to your existing account."
  );
  setLoading(false);
  return;
}

// Create account
const { data, error } = await supabase.auth.signUp({
  email,
  password: form.password,
  options: {
    data: {
      full_name: form.fullName.trim(),
      phone: phoneNormalized,
      country: "Uganda",
      referral_code: referralCode || null,
    },
  },
});

if (error) {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("already registered") ||
    errorMessage.includes("already exists") ||
    errorMessage.includes("duplicate") ||
    errorMessage.includes("unique")
  ) {
    setError(
      "This email or phone number is already registered. Please log in or use different details."
    );
  } else {
    setError(error.message);
  }

  setLoading(false);
  return;
}

setLoading(false);

if (data.session) {
  router.push("/dashboard");
  return;
}

  setMessage(
    "Account created successfully. Please check your email to confirm your account. If you do not see the verification email in your inbox, please check your Spam, Junk, or Promotions folder."
  );
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-700"
          >
            BLUESTONIE
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Create your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Register
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create your Bluestonie account to access your dashboard.
          </p>

          {referralCode && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              Referral code:{" "}
              <span className="font-bold">{referralCode}</span>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
<div>
  <label
    htmlFor="phone"
    className="text-sm font-semibold text-slate-700"
  >
    Phone number
  </label>

  <div className="mt-2 flex">
    <div className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-4 text-base font-semibold text-slate-700">
      +256
    </div>

    <input
      id="phone"
      name="phone"
      type="tel"
      inputMode="numeric"
      maxLength={9}
      value={form.phone}
      onChange={(e) => {
        const value = e.target.value
          .replace(/\D/g, "")
          .slice(0, 9);

        setForm({
          ...form,
          phone: value,
        });
      }}
      placeholder="701234567"
      autoComplete="tel-national"
      className="w-full rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>

  <p className="mt-1.5 text-xs text-slate-500">
    Enter 9 digits starting with 70–79.
  </p>
</div>

            {/* Email */}
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
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
  <label
    htmlFor="password"
    className="text-sm font-semibold text-slate-700"
  >
    Password
  </label>

  <div className="relative mt-2">
    <input
      id="password"
      name="password"
      type={showPassword ? "text" : "password"}
      value={form.password}
      onChange={handleChange}
      placeholder="Create a password"
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

            {/* Confirm password */}
            <div>
  <label
    htmlFor="confirmPassword"
    className="text-sm font-semibold text-slate-700"
  >
    Confirm Password
  </label>

  <div className="relative mt-2">
    <input
      id="confirmPassword"
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={form.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm your password"
      autoComplete="new-password"
      required
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 hover:text-blue-700"
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

            {/* Terms and agreement */}
<label className="flex items-start gap-3 text-sm leading-5 text-slate-600">
  <input
    type="checkbox"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
  />

  <span>
    I confirm that I have read and agree to the{" "}
    <Link
      href="/terms"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Terms & Conditions
    </Link>
    ,{" "}
    <Link
      href="/privacy"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Privacy Policy
    </Link>
    ,{" "}
    <Link
      href="/risk-disclosure"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Risk Disclosure
    </Link>
    ,{" "}
    <Link
      href="/deposit-withdrawal-policy"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Deposit & Withdrawal Policy
    </Link>
    , and{" "}
    <Link
      href="/referral-terms"
      className="font-semibold text-blue-600 hover:text-blue-700"
    >
      Referral Terms
    </Link>
    . I confirm that the information I have provided is accurate and that I
    understand the risks associated with using BLUESTONIE Investments.
  </span>
</label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          By creating an account, you agree to the platform&apos;s terms
          and applicable policies.
        </p>
      </div>
    </main>
  );

}
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <p className="text-sm text-slate-500">Loading...</p>
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}