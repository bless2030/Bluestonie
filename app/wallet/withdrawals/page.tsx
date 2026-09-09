"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { MoneyValue, Withdrawal } from "@/lib/types";

export default function WithdrawalsPage() {
  const router = useRouter();

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWithdrawals() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.push("/login");
      return;
    }

    const { data, error: withdrawalError } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (withdrawalError) {
      setError(withdrawalError.message);
      setLoading(false);
      return;
    }

    setWithdrawals((data || []) as Withdrawal[]);
    setLoading(false);
    }

    void loadWithdrawals();
  }, [router]);

  function formatUSD(amount: MoneyValue) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  function formatUGX(amount: MoneyValue) {
    return `UGX ${Number(amount || 0).toLocaleString()}`;
  }

  function getStatusStyle(status: string | null) {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "rejected":
      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function getStatusLabel(status: string | null) {
    if (!status) return "Pending";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading withdrawal history...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">

          <button
            onClick={() => router.push("/wallet")}
            className="text-sm font-bold text-blue-600"
          >
            ← Wallet
          </button>

          <h1 className="text-lg font-extrabold text-slate-900">
            Withdrawals
          </h1>

          <button
            onClick={() => router.push("/wallet/withdraw")}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
          >
            Withdraw
          </button>

        </div>
      </header>


      <div className="mx-auto max-w-3xl px-4 py-6">

        {/* Heading */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Withdrawal History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your withdrawal requests and their status.
          </p>
        </section>


        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Empty state */}
        {withdrawals.length === 0 ? (

          <section className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
              ↓
            </div>

            <h3 className="mt-4 font-extrabold text-slate-800">
              No withdrawals yet
            </h3>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              Your withdrawal requests will appear here.
            </p>

            <button
              onClick={() => router.push("/wallet/withdraw")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            >
              Make a Withdrawal
            </button>

          </section>

        ) : (

          <section className="mt-6 space-y-4">

            {withdrawals.map((withdrawal) => (

              <article
                key={withdrawal.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl text-orange-600">
                      ↓
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900">
                        Withdrawal
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {withdrawal.requested_at || withdrawal.created_at
                          ? new Date(
                              withdrawal.requested_at || withdrawal.created_at || ""
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                  </div>


                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                      withdrawal.status
                    )}`}
                  >
                    {getStatusLabel(withdrawal.status)}
                  </span>

                </div>


                {/* Amounts */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Requested
                    </p>

                    <p className="mt-1 font-extrabold text-slate-900">
                      {formatUSD(
                        withdrawal.requested_amount_usd ?? withdrawal.amount_usd
                      )}
                    </p>
                  </div>


                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-xs text-red-500">
                      5% Fee
                    </p>

                    <p className="mt-1 font-extrabold text-red-700">
                      -{formatUSD(withdrawal.fee_usd)}
                    </p>
                  </div>


                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-500">
                      You Receive
                    </p>

                    <p className="mt-1 font-extrabold text-blue-700">
                      {formatUSD(withdrawal.net_amount_usd)}
                    </p>
                  </div>

                </div>


                {/* UGX */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-sm text-slate-500">
                    UGX amount
                  </span>

                  <span className="font-extrabold text-slate-800">
                    {formatUGX(
                      withdrawal.amount_ugx ??
                        Number(withdrawal.net_amount_usd || 0) * 4000
                    )}
                  </span>

                </div>


                {/* Reference */}
                {withdrawal.reference && (
                  <div className="mt-3">

                    <p className="text-xs text-slate-400">
                      Reference
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-slate-700">
                      {withdrawal.reference}
                    </p>

                  </div>
                )}


                {/* Admin note */}
                {withdrawal.admin_note && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3">

                    <p className="text-xs font-bold text-slate-500">
                      Administrator note
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {withdrawal.admin_note}
                    </p>

                  </div>
                )}


                {/* Review */}
                {withdrawal.reviewed_at && (
                  <p className="mt-4 text-xs text-slate-400">
                    Reviewed{" "}
                    {new Date(
                      withdrawal.reviewed_at
                    ).toLocaleString()}
                  </p>
                )}

              </article>

            ))}

          </section>

        )}

      </div>

    </main>
  );
}
