"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { MoneyValue, Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransactions() {
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

    const { data, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (transactionError) {
      setError(transactionError.message);
      setLoading(false);
      return;
    }

    setTransactions((data || []) as Transaction[]);
    setLoading(false);
    }

    void loadTransactions();
  }, [router]);

  function formatUSD(amount: MoneyValue) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  function formatUGX(amount: MoneyValue) {
    return `UGX ${Number(amount || 0).toLocaleString()}`;
  }

  function formatType(type: string | null) {
    if (!type) return "Transaction";

    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  function statusStyle(status: string | null) {
    switch (status?.toLowerCase()) {
      case "completed":
      case "verified":
      case "approved":
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

  function typeStyle(type: string | null) {
    const value = type?.toLowerCase() || "";

    if (
      value.includes("deposit") ||
      value.includes("investment")
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (
      value.includes("return") ||
      value.includes("roi") ||
      value.includes("profit")
    ) {
      return "bg-green-50 text-green-700";
    }

    if (value.includes("withdraw")) {
      return "bg-orange-50 text-orange-700";
    }

    return "bg-slate-50 text-slate-700";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading transactions...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">

          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-blue-600"
          >
            ← Dashboard
          </button>

          <h1 className="text-lg font-extrabold text-slate-900">
            Transactions
          </h1>

          <div className="w-20" />

        </div>
      </header>


      <div className="mx-auto max-w-4xl px-4 py-6">

        {/* Title */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View your deposits, investments, returns and withdrawals.
          </p>
        </section>


        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Empty */}
        {transactions.length === 0 ? (

          <section className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">

            <div className="text-3xl">
              ₿
            </div>

            <h3 className="mt-3 font-extrabold text-slate-800">
              No transactions yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your transaction history will appear here.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Back to Dashboard
            </button>

          </section>

        ) : (

          /* Transaction list */
          <section className="mt-6 space-y-3">

            {transactions.map((transaction) => (

              <article
                key={transaction.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
              >

                <div className="flex items-start gap-3">

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${typeStyle(
                      transaction.type
                    )}`}
                  >
                    {transaction.type
                      ?.toLowerCase()
                      .includes("withdraw")
                      ? "↓"
                      : transaction.type
                          ?.toLowerCase()
                          .includes("return") ||
                        transaction.type
                          ?.toLowerCase()
                          .includes("roi")
                      ? "↗"
                      : "↑"}
                  </div>


                  {/* Main content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <h3 className="font-extrabold text-slate-900">
                        {formatType(transaction.type)}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status || "Recorded"}
                      </span>

                    </div>


                    {/* Amount */}
                    <div className="mt-3 grid grid-cols-2 gap-3">

                      <div>
                        <p className="text-xs text-slate-400">
                          USD Amount
                        </p>

                        <p className="mt-1 font-extrabold text-slate-900">
                          {formatUSD(
                            transaction.amount_usd
                          )}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-slate-400">
                          UGX Amount
                        </p>

                        <p className="mt-1 font-extrabold text-blue-700">
                          {formatUGX(
                            transaction.amount_ugx
                          )}
                        </p>
                      </div>

                    </div>


                    {/* Description */}
                    {transaction.description && (
                      <p className="mt-3 text-sm leading-5 text-slate-500">
                        {transaction.description}
                      </p>
                    )}


                    {/* Reference */}
                    {transaction.reference && (
                      <p className="mt-3 break-all text-xs text-slate-400">
                        Reference: {transaction.reference}
                      </p>
                    )}


                    {/* Date */}
                    <p className="mt-2 text-xs text-slate-400">
                      {transaction.created_at
                        ? new Date(
                            transaction.created_at
                          ).toLocaleString()
                        : "Date unavailable"}
                    </p>

                  </div>

                </div>

              </article>

            ))}

          </section>

        )}

      </div>

    </main>
  );
}
