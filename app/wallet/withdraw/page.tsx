"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Investment, Wallet } from "@/lib/types";

const USD_TO_UGX = 4000;
const WITHDRAWAL_FEE_RATE = 0.05;

export default function WithdrawPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadWithdrawalData() {
    setLoading(true);
    setError("");

    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      router.push("/login");
      return;
    }

    setUser(currentUser);

    const { data: walletData, error: walletError } =
      await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

    if (walletError) {
      setError(walletError.message);
      setLoading(false);
      return;
    }

    const { data: investmentData, error: investmentError } =
      await supabase
        .from("investments")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (investmentError) {
      setError(investmentError.message);
      setLoading(false);
      return;
    }

    setWallet(walletData as Wallet | null);
    setInvestments((investmentData || []) as Investment[]);
    setLoading(false);
    }

    void loadWithdrawalData();
  }, [router]);

  const lockedCapital = useMemo(() => {
    const now = new Date();

    return investments.reduce((total, investment) => {
      if (
        investment.lock_until &&
        new Date(investment.lock_until) > now
      ) {
        return total + Number(investment.amount_usd || 0);
      }

      return total;
    }, 0);
  }, [investments]);

  const availableBalance = Math.max(
    Number(wallet?.balance_usd || 0),
    0
  );

  const requestedAmount = Number(amount || 0);

  const fee =
    requestedAmount > 0
      ? requestedAmount * WITHDRAWAL_FEE_RATE
      : 0;

  const netAmount =
    requestedAmount > 0
      ? requestedAmount - fee
      : 0;

  const netUGX = netAmount * USD_TO_UGX;

  async function submitWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!user || !wallet) {
      setError("Wallet information is unavailable.");
      return;
    }

    if (!requestedAmount || requestedAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (requestedAmount > availableBalance) {
      setError(
        `You can only withdraw up to $${availableBalance.toFixed(2)}.`
      );
      return;
    }

    /*
      The wallet balance is the amount available for withdrawal.
      Locked investment capital is not added to the available balance.
    */

    if (requestedAmount > availableBalance) {
      setError(
        "The requested amount exceeds your available balance."
      );
      return;
    }

    setSubmitting(true);

    const { error: withdrawalError } = await supabase
  .from("withdrawals")
  .insert({
    user_id: user.id,
    requested_amount_usd: requestedAmount,
    fee_percent: 5,
    fee_usd: fee,
    net_amount_usd: netAmount,
    status: "pending",
  });

    if (withdrawalError) {
      setError(withdrawalError.message);
      setSubmitting(false);
      return;
    }

    setAmount("");
    setSuccess(
      `Withdrawal request submitted successfully. It is now waiting for administrator review.`
    );

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading withdrawal information...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">

          <button
            onClick={() => router.push("/wallet")}
            className="text-sm font-bold text-blue-600"
          >
            ← Wallet
          </button>

          <h1 className="text-lg font-extrabold text-slate-900">
            Withdraw
          </h1>

          <div className="w-16" />

        </div>
      </header>


      <div className="mx-auto max-w-2xl px-4 py-6">

        {/* Balance */}
        <section className="rounded-2xl bg-blue-600 p-5 text-white shadow-sm">

          <p className="text-sm text-blue-100">
            Available Balance
          </p>

          <p className="mt-1 text-3xl font-extrabold">
            ${availableBalance.toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-blue-100">
            UGX{" "}
            {(availableBalance * USD_TO_UGX).toLocaleString()}
          </p>

        </section>


        {/* Locked capital */}
        <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">

          <div className="flex items-start gap-3">

            <div className="text-xl">
              🔒
            </div>

            <div>
              <h2 className="font-extrabold text-amber-800">
                Locked Investment Capital
              </h2>

              <p className="mt-1 text-sm leading-5 text-amber-700">
                ${lockedCapital.toFixed(2)} is currently locked
                under the investment lock period and cannot be
                withdrawn before its unlock date.
              </p>
            </div>

          </div>

        </section>


        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* Withdrawal form */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

          <h2 className="text-xl font-extrabold text-slate-900">
            Request Withdrawal
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A 5% withdrawal fee applies.
          </p>


          <form
            onSubmit={submitWithdrawal}
            className="mt-6"
          >

            <label className="text-sm font-bold text-slate-700">
              Amount to withdraw (USD)
            </label>

            <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500">

              <span className="flex items-center bg-slate-50 px-4 font-bold text-slate-500">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                className="min-w-0 flex-1 px-4 py-3 text-lg font-bold outline-none"
              />

            </div>


            {/* Calculation */}
            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-slate-500">
                  Requested amount
                </span>

                <span className="font-bold text-slate-800">
                  ${requestedAmount.toFixed(2)}
                </span>

              </div>


              <div className="flex justify-between gap-4 text-sm">

                <span className="text-slate-500">
                  Withdrawal fee (5%)
                </span>

                <span className="font-bold text-red-600">
                  -${fee.toFixed(2)}
                </span>

              </div>


              <div className="border-t border-slate-200 pt-3">

                <div className="flex justify-between gap-4">

                  <span className="font-extrabold text-slate-800">
                    You receive
                  </span>

                  <span className="font-extrabold text-blue-700">
                    ${netAmount.toFixed(2)}
                  </span>

                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  UGX {netUGX.toLocaleString()}
                </p>

              </div>

            </div>


            <button
              type="submit"
              disabled={
                submitting ||
                !requestedAmount ||
                requestedAmount <= 0 ||
                requestedAmount > availableBalance
              }
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-extrabold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Withdrawal Request"}
            </button>

          </form>

        </section>


        {/* Information */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

          <h2 className="font-extrabold text-slate-900">
            Withdrawal Information
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-500">

            <li>
              • A 5% withdrawal fee is deducted from the
              requested amount.
            </li>

            <li>
              • Investment capital remains locked until its
              specified unlock date.
            </li>

            <li>
              • Every withdrawal is reviewed by an administrator.
            </li>

            <li>
              • Approved withdrawals will appear in your
              transaction history.
            </li>

          </ul>

        </section>

      </div>

    </main>
  );
}
