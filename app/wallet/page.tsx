"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Deposit, Package } from "@/lib/types";

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package");

  const [user, setUser] = useState<User | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const USD_RATE = 4000;

  useEffect(() => {
    async function loadWallet() {
      setLoading(true);
      setError("");

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      if (packageId) {
        const { data: packageData, error: packageError } =
          await supabase
            .from("packages")
            .select("*")
            .eq("id", packageId)
            .eq("is_active", true)
            .single();

        if (packageError) {
          setError("Unable to load the selected package.");
        } else {
          setSelectedPackage(packageData as Package);
        }
      }

      const { data: depositData, error: depositError } =
        await supabase
          .from("deposits")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("submitted_at", { ascending: false });

      if (!depositError) {
        setDeposits((depositData || []) as Deposit[]);
      }

      setLoading(false);
    }

    loadWallet();
  }, [packageId, router]);

  const numericAmount = Number(amount || 0);

  const amountUGX = numericAmount * USD_RATE;

  const isAmountValid =
    selectedPackage &&
    numericAmount >= Number(selectedPackage.min_usd) &&
    numericAmount <= Number(selectedPackage.max_usd);

  async function handleDeposit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedPackage || !user) {
      setError("Please select a package first.");
      return;
    }

    if (!isAmountValid) {
      setError(
        `Amount must be between $${selectedPackage.min_usd} and $${selectedPackage.max_usd}.`
      );
      return;
    }

    if (!reference.trim()) {
      setError("Please enter your deposit reference.");
      return;
    }

    setSubmitting(true);

    const { error: depositError } = await supabase
      .from("deposits")
      .insert({
        user_id: user.id,
        amount_usd: numericAmount,
        amount_ugx: amountUGX,
        reference: reference.trim(),
        status: "pending",
      });

    if (depositError) {
      setError(depositError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(
      "Deposit request submitted successfully. It is now waiting for administrator verification."
    );

    setAmount("");
    setReference("");

    const { data: updatedDeposits } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false });

    setDeposits((updatedDeposits || []) as Deposit[]);

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading wallet...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">

          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-blue-600"
          >
            ← Dashboard
          </button>

          <h1 className="text-lg font-extrabold text-slate-900">
            Wallet
          </h1>

          <div className="w-20" />

        </div>
      </header>


      <div className="mx-auto max-w-3xl px-4 py-6">

        {/* Selected package */}
        {selectedPackage ? (
          <section className="rounded-2xl bg-blue-600 p-5 text-white shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
              Selected package
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">
              {selectedPackage.name}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-blue-100">
                  Minimum
                </p>

                <p className="mt-1 font-extrabold">
                  ${Number(selectedPackage.min_usd).toFixed(0)}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-blue-100">
                  Maximum
                </p>

                <p className="mt-1 font-extrabold">
                  ${Number(selectedPackage.max_usd).toFixed(0)}
                </p>
              </div>

            </div>

          </section>
        ) : (
          <section className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">

            <h2 className="text-lg font-extrabold text-slate-900">
              No package selected
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose a package from your dashboard before making a deposit.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            >
              Choose Package
            </button>

          </section>
        )}


        {/* Deposit form */}
        {selectedPackage && (
          <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

            <h2 className="text-xl font-extrabold text-slate-900">
              Deposit Request
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Enter the amount you deposited and your payment reference.
              Your deposit will remain pending until an administrator verifies it.
            </p>


            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}


            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-700">
                {success}
              </div>
            )}


            <form
              onSubmit={handleDeposit}
              className="mt-6 space-y-5"
            >

              {/* Amount */}
              <div>

                <label
                  htmlFor="amount"
                  className="text-sm font-bold text-slate-700"
                >
                  Deposit amount (USD)
                </label>

                <input
                  id="amount"
                  type="number"
                  min={selectedPackage.min_usd ?? undefined}
                  max={selectedPackage.max_usd ?? undefined}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`$${selectedPackage.min_usd} - $${selectedPackage.max_usd}`}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* UGX conversion */}
              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Fixed accounting rate
                  </span>

                  <span className="font-bold text-slate-800">
                    1 USD = UGX 4,000
                  </span>

                </div>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Required UGX
                  </span>

                  <span className="text-lg font-extrabold text-blue-700">
                    UGX {amountUGX.toLocaleString()}
                  </span>

                </div>

              </div>


              {/* Reference */}
              <div>

                <label
                  htmlFor="reference"
                  className="text-sm font-bold text-slate-700"
                >
                  Deposit reference
                </label>

                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter transaction/reference number"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Instructions */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <h3 className="font-bold text-blue-900">
                  Deposit instructions
                </h3>

                <ul className="mt-2 space-y-2 text-sm leading-5 text-blue-800">

                  <li>
                    • Deposit exactly the amount displayed for your selected package.
                  </li>

                  <li>
                    • Use the fixed accounting rate of UGX 4,000 per USD.
                  </li>

                  <li>
                    • Keep your payment reference.
                  </li>

                  <li>
                    • Submit the reference above after making the payment.
                  </li>

                  <li>
                    • Your deposit remains pending until verified by the administrator.
                  </li>

                </ul>

              </div>


              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Deposit Request"}
              </button>

            </form>

          </section>
        )}


        {/* Deposit history */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

          <h2 className="text-xl font-extrabold text-slate-900">
            Deposit History
          </h2>

          {deposits.length === 0 ? (

            <p className="mt-4 text-sm text-slate-500">
              No deposit requests yet.
            </p>

          ) : (

            <div className="mt-4 space-y-3">

              {deposits.map((deposit) => (

                <div
                  key={deposit.id}
                  className="rounded-xl border border-slate-200 p-4"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="font-bold text-slate-900">
                        ${Number(deposit.amount_usd).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        UGX{" "}
                        {Number(
                          deposit.amount_ugx
                        ).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Ref: {deposit.reference || "—"}
                      </p>

                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        deposit.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : deposit.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {deposit.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}
export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Loading wallet...
          </p>
        </main>
      }
    >
      <WalletContent />
    </Suspense>
  );
}