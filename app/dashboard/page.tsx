"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Package, Profile, Wallet } from "@/lib/types";

type Notice = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

type Referral = {
  id: string;
  referred_user_id: string;
  commission_rate: number;
  commission_amount_usd: number;
  commission_amount_ugx: number;
  status: string;
  created_at: string;
  referred_profile?: {
    full_name: string | null;
    phone: string | null;
  }[] | null;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  task_date: string;
  is_active: boolean;
  display_order?: number | null;
  sort_order?: number | null;
};

type Deposit = {
  id: string;
  amount_usd: number;
  amount_ugx: number;
  reference: string | null;
  status: string;
  submitted_at: string;
  admin_note: string | null;
};

type Withdrawal = {
  id: string;
  user_id: string;
  requested_amount_usd: number;
  fee_usd: number;
  net_amount_usd: number;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const packageSectionRef = useRef<HTMLElement | null>(null);
  const depositPanelRef = useRef<HTMLElement | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPaymentDetails, setWithdrawPaymentDetails] =
    useState("");

  const [depositUsd, setDepositUsd] = useState("");
  const [depositReference, setDepositReference] = useState("");

  const [depositMethod, setDepositMethod] = useState("");
const [depositNumber, setDepositNumber] = useState("");
const [depositAccountName, setDepositAccountName] = useState("");

  const [loading, setLoading] = useState(true);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [submittingWithdrawal, setSubmittingWithdrawal] =
    useState(false);

const [referrals, setReferrals] = useState<Referral[]>([]);

  const [completingTask, setCompletingTask] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Africa/Kampala",
    });

    try {
      const [
        profileResult,
        walletResult,
        packagesResult,
        noticesResult,
        tasksResult,
        completionsResult,
        depositsResult,
        withdrawalsResult,
        depositSettingsResult,
        referralsResult
      ] = await Promise.all([

       
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single(),

        supabase
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .single(),

        supabase
          .from("packages")
          .select("*")
          .eq("is_active", true)
          .order("min_usd", { ascending: true }),

        supabase
          .from("notices")
          .select("id,title,message,created_at")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("tasks")
          .select("*")
          .eq("is_active", true)
          .eq("task_date", today)
          .order("display_order", { ascending: true }),

        supabase
          .from("task_completions")
          .select("task_id")
          .eq("user_id", user.id)
          .eq("completed_on", today),

        supabase
          .from("deposits")
          .select("*")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false })
          .limit(10),

        supabase
          .from("withdrawals")
          .select(
            "id,user_id,requested_amount_usd,fee_usd,net_amount_usd,status,requested_at,reviewed_at"
          )
          .eq("user_id", user.id)
          .order("requested_at", { ascending: false })
          .limit(10),

          supabase
  .from("system_settings")
  .select("key, value")
  .in("key", [
    "deposit_method",
    "deposit_number",
    "deposit_account_name",
  ]), 

supabase
  .from("referrals")
  .select(
    "id, referred_user_id, commission_rate, commission_amount_usd, commission_amount_ugx, status, created_at"
  )
  .eq("referrer_id", user.id)
  .order("created_at", { ascending: false }),
  ]);
     

      if (profileResult.error) {
        throw new Error(profileResult.error.message);
      }

      if (walletResult.error) {
        throw new Error(walletResult.error.message);
      }

      if (packagesResult.error) {
        throw new Error(packagesResult.error.message);
      }

      if (withdrawalsResult.error) {
        throw new Error(withdrawalsResult.error.message);
      }

      setProfile(profileResult.data as Profile);
setWallet(walletResult.data as Wallet);
setPackages((packagesResult.data || []) as Package[]);

const referralRows = (referralsResult.data || []) as Referral[];

if (referralRows.length > 0) {
  const referredUserIds = referralRows.map(
    (referral) => referral.referred_user_id
  );

  const { data: referredProfiles, error: referredProfilesError } =
    await supabase.rpc("get_my_referred_profiles", {
      p_user_ids: referredUserIds,
    });

  if (referredProfilesError) {
    console.error(
      "REFERRED PROFILES ERROR:",
      referredProfilesError
    );
  }

  const referralsWithProfiles = referralRows.map((referral) => ({
    ...referral,
    referred_profile:
     referredProfiles?.filter(
  (profile: { id: string; full_name: string | null; phone: string | null }) =>
    profile.id === referral.referred_user_id
) || [],
  }));

  setReferrals(referralsWithProfiles);
} else {
  setReferrals([]);
}

if (!depositSettingsResult.error) {
  depositSettingsResult.data?.forEach((setting) => {
    if (setting.key === "deposit_method") {
      setDepositMethod(setting.value || "");
    }

    if (setting.key === "deposit_number") {
      setDepositNumber(setting.value || "");
    }

    if (setting.key === "deposit_account_name") {
      setDepositAccountName(setting.value || "");
    }
  });
}

      const depositSettings = depositSettingsResult.data || [];

depositSettings.forEach((setting) => {
  if (setting.key === "deposit_method") {
    setDepositMethod(setting.value || "");
  }

  if (setting.key === "deposit_number") {
    setDepositNumber(setting.value || "");
  }

  if (setting.key === "deposit_account_name") {
    setDepositAccountName(setting.value || "");
  }
});

      if (!noticesResult.error) {
        setNotices((noticesResult.data || []) as Notice[]);
      }

      if (!tasksResult.error) {
        setTasks((tasksResult.data || []) as Task[]);
      }

      if (!completionsResult.error) {
        setCompletedTaskIds(
          (completionsResult.data || []).map(
            (item) => item.task_id
          )
        );
      }

      if (!depositsResult.error) {
        setDeposits((depositsResult.data || []) as Deposit[]);
      }

      setWithdrawals(
        (withdrawalsResult.data || []) as Withdrawal[]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleSelectPackage(pkg: Package) {
    setSelectedPackage(pkg);

    setShowDeposit(true);
    setShowWithdraw(false);

    setMessage("");
    setError("");

    setTimeout(() => {
      depositPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function openDeposit() {
    setShowWithdraw(false);
    setShowDeposit(false);

    setMessage("");
    setError("");

    setTimeout(() => {
      packageSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function openWithdraw() {
    setShowDeposit(false);
    setShowWithdraw(true);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeposit() {
    setMessage("");
    setError("");

    if (!selectedPackage) {
      setError("Please select a package first.");
      return;
    }

    const amount = Number(depositUsd);

    if (!amount || amount <= 0) {
      setError("Enter a valid deposit amount.");
      return;
    }

    const minimum = Number(selectedPackage.min_usd);
    const maximum = Number(selectedPackage.max_usd);

    if (amount < minimum || amount > maximum) {
      setError(
        `Your ${selectedPackage.name} package accepts $${minimum} - $${maximum}.`
      );
      return;
    }

    if (!depositReference.trim()) {
      setError("Enter your payment reference.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setSubmittingDeposit(true);

    const amountUgx = Math.round(amount * 4000);

    const { error: depositError } = await supabase
      .from("deposits")
      .insert({
        user_id: user.id,
        package_id: selectedPackage.id,
        amount_usd: amount,
        amount_ugx: amountUgx,
        reference: depositReference.trim(),
        status: "pending",
        submitted_at: new Date().toISOString(),
      });

    setSubmittingDeposit(false);

    if (depositError) {
      setError(depositError.message);
      return;
    }

    setDepositUsd("");
    setDepositReference("");

    setMessage(
      "Deposit request submitted successfully. It is now awaiting admin review."
    );

    await loadDashboard();
  }

  async function handleCompleteTask(taskId: string) {
    if (completedTaskIds.includes(taskId)) return;

    setCompletingTask(taskId);
    setMessage("");
    setError("");

    const { data, error: rpcError } = await supabase.rpc(
      "complete_daily_task",
      {
        p_task_id: taskId,
      }
    );

    setCompletingTask(null);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    if (data?.success) {
      setMessage(
        data.message || "Task completed successfully."
      );

      setCompletedTaskIds((current) => [
        ...current,
        taskId,
      ]);

      await loadDashboard();
    } else {
      setError(
        data?.message || "Unable to complete task."
      );
    }
  }

  async function handleWithdrawal() {
    setMessage("");
    setError("");

    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }
    if (amount < 15) {
  setError("Minimum withdrawal amount is $15.00");
  return;
}

    if (!withdrawPaymentDetails.trim()) {
      setError("Enter your payment details.");
      return;
    }

    if (amount > withdrawableProfit) {
  setError(
    `You can only withdraw up to your available profit of $${withdrawableProfit.toFixed(
      2
    )}.`
  );
  return;
}

    setSubmittingWithdrawal(true);

    const { data, error: withdrawalError } =
      await supabase.rpc("request_withdrawal", {
        p_amount_usd: amount,
        p_payment_details:
          withdrawPaymentDetails.trim(),
      });

    setSubmittingWithdrawal(false);

    if (withdrawalError) {
      setError(withdrawalError.message);
      return;
    }

    if (!data?.success) {
      setError(
        data?.message ||
          "Unable to submit withdrawal request."
      );
      return;
    }

    setWithdrawAmount("");
    setWithdrawPaymentDetails("");
    setShowWithdraw(false);

    setMessage(
      data.message ||
        "Withdrawal request submitted successfully."
    );

    await loadDashboard();
  }

  const completedCount = tasks.filter((task) =>
    completedTaskIds.includes(task.id)
  ).length;

  const totalTasks = tasks.length;

 const capitalLocked = Number(
  wallet?.total_invested_usd || 0
);

const profits = Number(
  wallet?.total_returns_usd || 0
);

const balance = Number(
  wallet?.balance_usd || 0
);

const totalReferrals = referrals.length;

const completedReferrals = referrals.filter(
  (referral) => referral.status === "completed"
).length;

const referralEarningsUsd = referrals.reduce(
  (total, referral) =>
    total + Number(referral.commission_amount_usd || 0),
  0
);

const referralEarningsUgx = referrals.reduce(
  (total, referral) =>
    total + Number(referral.commission_amount_ugx || 0),
  0
);

const referralCode =
  (profile as Profile & { referral_code?: string | null })
    ?.referral_code || "";

  /*
   * TOTAL DEPOSITS
   *
   * Only verified/approved deposits are counted
   * as actual funded deposits.
   */
  const totalDeposits = deposits
    .filter(
      (deposit) =>
        deposit.status.toLowerCase() === "verified" ||
        deposit.status.toLowerCase() === "approved"
    )
    .reduce(
      (total, deposit) =>
        total + Number(deposit.amount_usd || 0),
      0
    );

  /*
   * TOTAL WITHDRAWALS
   *
   * Completed/approved withdrawals are counted
   * as actual withdrawals.
   */
  const totalWithdrawals = withdrawals
    .filter(
      (withdrawal) =>
        withdrawal.status.toLowerCase() ===
          "completed" ||
        withdrawal.status.toLowerCase() ===
          "approved"
    )
    .reduce(
      (total, withdrawal) =>
        total +
        Number(
          withdrawal.requested_amount_usd || 0
        ),
      0
    );

const pendingWithdrawals = withdrawals
  .filter(
    (withdrawal) =>
      withdrawal.status?.toLowerCase() === "pending"
  )
  .reduce(
    (total, withdrawal) =>
      total +
      Number(withdrawal.requested_amount_usd || 0),
    0
  );

const withdrawableProfit = Math.max(
  profits - pendingWithdrawals,
  0
);

const withdrawableProfitUgx = Math.round(
  withdrawableProfit * 4000
);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="font-bold text-red-600">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Welcome back
            </p>

            <h1 className="text-lg font-extrabold text-blue-700">
              {profile?.full_name || "Member"}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {/* TOP ACCOUNT AREA */}
        <section className="rounded-3xl bg-blue-600 p-5 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
  <p className="text-sm text-slate-500">
    Available profit balance
  </p>

  <p className="mt-1 text-2xl font-extrabold text-blue-700">
    ${withdrawableProfit.toFixed(2)}
  </p>
<p className="mt-1 text-sm text-blue-100">
          UGX{" "}
          {(withdrawableProfit * 4000).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </p>

</div>
              <p className="mt-1 text-sm text-blue-100">
                UGX{" "}
               {(withdrawableProfit * 4000).toLocaleString(undefined, {
  maximumFractionDigits: 0,
})}
              </p>
            </div>

            {/* MAIN ACTIONS */}
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                onClick={openDeposit}
                className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-blue-700 shadow-sm hover:bg-blue-50"
              >
                + Deposit
              </button>

              <button
                onClick={openWithdraw}
                className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-white/20 hover:bg-blue-400"
              >
                ↑ Withdraw
              </button>
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            <SummaryCard
              label="Total Deposits"
              value={`$${totalDeposits.toFixed(2)}`}
            />

            <SummaryCard
              label="Total Withdrawals"
              value={`$${totalWithdrawals.toFixed(2)}`}
            />

            <SummaryCard
              label="Profits"
              value={`$${profits.toFixed(2)}`}
            />

            <SummaryCard
              label="Running Investment"
              value={`$${capitalLocked.toFixed(2)}`}
            />

            <SummaryCard
              label="Tasks"
              value={`${completedCount}/${totalTasks}`}
            />

            <SummaryCard
              label="Status"
              value="Active"
            />
          </div>
        </section>

        {/* PENDING WITHDRAWAL NOTICE */}
        {pendingWithdrawals > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-amber-600">
                !
              </div>

              <div>
                <p className="text-sm font-extrabold text-amber-800">
                  Withdrawal pending
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  ${pendingWithdrawals.toFixed(2)} is
                  currently reserved for pending
                  withdrawal request(s) and cannot be
                  reused.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGE / NOTICE */}
        {message && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* WITHDRAW PANEL */}
        {showWithdraw && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Withdrawal
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Withdraw from profits
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Withdrawable funds come from your
                  available profit balance.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowWithdraw(false)
                }
                className="text-sm font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            

            <div className="mt-4">
              <label className="text-sm font-bold text-slate-700">
                Amount to withdraw (USD)
              </label>

              <input
  type="number"
  min="15"
  max={withdrawableProfit}
  step="0.01"
  value={withdrawAmount}
  onChange={(e) => setWithdrawAmount(e.target.value)}
  placeholder="Enter amount"
  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
/>
{withdrawableProfit < 15 && (
  <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
    <p className="text-xs font-bold text-amber-800">
      Minimum withdrawal is $15.00
    </p>

    <p className="mt-1 text-xs text-amber-700">
      You currently have $
      {withdrawableProfit.toFixed(2)} available.
      You need $
      {(15 - withdrawableProfit).toFixed(2)} more
      in profit before you can withdraw.
    </p>
  </div>
)}

            </div>

            {Number(withdrawAmount) > 0 && (
              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Withdrawal amount
                  </span>

                  <span className="font-bold text-slate-900">
                    $
                    {Number(
                      withdrawAmount
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-500">
                    Withdrawal fee
                  </span>

                  <span className="font-bold text-red-600">
                    -$
                    {(
                      Number(withdrawAmount) *
                      0.05
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 border-t border-blue-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">
                      You receive
                    </span>

                    <span className="text-lg font-extrabold text-blue-700">
                      $
                      {(
                        Number(withdrawAmount) -
                        Number(withdrawAmount) *
                          0.05
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm font-bold text-slate-700">
                Payment details
              </label>

              <textarea
                value={withdrawPaymentDetails}
                onChange={(e) =>
                  setWithdrawPaymentDetails(
                    e.target.value
                  )
                }
                placeholder="e.g. Mobile Money number and account name"
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleWithdrawal}
              disabled={
  submittingWithdrawal ||
  withdrawableProfit < 15
}
              className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingWithdrawal
  ? "Submitting..."
  : withdrawableProfit < 15
  ? "Minimum $15 Required"
  : "Submit Withdrawal Request"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              A 5% withdrawal fee applies. Once a
              request is submitted, that amount should
              remain reserved until the request is
              approved or rejected.
            </p>
          </section>
        )}

        {/* DEPOSIT PANEL */}
        {showDeposit && (
          <section
            ref={depositPanelRef}
            className="mt-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Deposit
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Fund your account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submit your payment reference for
                  administrator verification.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowDeposit(false)
                }
                className="text-sm font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            {selectedPackage ? (
              <div className="mt-5">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-bold text-blue-600">
                    Selected Package
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="font-extrabold text-slate-900">
                      {selectedPackage.name}
                    </p>

                    <p className="font-extrabold text-blue-700">
                      $
                      {Number(
                        selectedPackage.min_usd
                      ).toFixed(0)}{" "}
                      - $
                      {Number(
                        selectedPackage.max_usd
                      ).toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
  <p className="text-sm font-extrabold text-blue-900">
    Payment Instructions
  </p>

  <p className="mt-1 text-xs leading-5 text-blue-700">
    Send your deposit using the payment details below.
  </p>

  <div className="mt-4 space-y-3">
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-semibold text-slate-400">
        Payment Method
      </p>
      <p className="mt-1 font-extrabold text-slate-900">
        {depositMethod || "NOT LOADED"}
      </p>
    </div>

    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-semibold text-slate-400">
        Send Payment To
      </p>
      <p className="mt-1 text-lg font-extrabold text-blue-700">
        {depositNumber || "NOT LOADED"}
      </p>
    </div>

    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-semibold text-slate-400">
        Account Name
      </p>
      <p className="mt-1 font-extrabold text-slate-900">
        {depositAccountName || "NOT LOADED"}
      </p>
    </div>
  </div>
</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Deposit Amount (USD)
                    </label>

                    <input
                      type="number"
                      min={Number(
                        selectedPackage.min_usd
                      )}
                      max={Number(
                        selectedPackage.max_usd
                      )}
                      value={depositUsd}
                      onChange={(e) =>
                        setDepositUsd(
                          e.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Payment Reference
                    </label>

                    <input
                      type="text"
                      value={depositReference}
                      onChange={(e) =>
                        setDepositReference(
                          e.target.value
                        )
                      }
                      placeholder="e.g. transaction number"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={submittingDeposit}
                  className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingDeposit
                    ? "Submitting..."
                    : "Submit Deposit Request"}
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Your deposit remains pending until
                  reviewed and approved by an
                  administrator.
                </p>
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                Select a package below to continue.
              </p>
            )}
          </section>
        )}

 {/* PACKAGES */}
        <section
          ref={packageSectionRef}
          className="mt-7 scroll-mt-6"
        >
          <div className="mb-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Packages
            </h2>

            <p className="text-xs text-slate-500">
              Select a package to make a deposit.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {packages.map((pkg) => {
              const selected =
                selectedPackage?.id === pkg.id;

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() =>
                    handleSelectPackage(pkg)
                  }
                  className={`rounded-xl p-3 text-left transition ${
                    selected
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                      : "bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-extrabold">
                      {pkg.name}
                    </p>

                    {selected && (
                      <span className="text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-base font-extrabold ${
                      selected
                        ? "text-white"
                        : "text-blue-700"
                    }`}
                  >
                    $
                    {Number(
                      pkg.min_usd
                    ).toFixed(0)}
                    -
                    {Number(
                      pkg.max_usd
                    ).toFixed(0)}
                  </p>

                  <p
                    className={`mt-1 text-[11px] ${
                      selected
                        ? "text-blue-100"
                        : "text-slate-400"
                    }`}
                  >
                    {Number(
                      pkg.displayed_roi_percent
                    ).toFixed(1)}
                    % displayed rate
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* REFERRALS */}
<section className="mt-6">
  <div className="mb-3">
    <h2 className="text-lg font-extrabold text-slate-900">
      Referral & Earnings
    </h2>

    <p className="text-xs text-slate-500">
      Earn 10% commission when your referrals make qualifying deposits.
    </p>
  </div>

  <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
    {/* Referral Code */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">
        Your Referral Code
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold tracking-wide text-blue-900">
          {referralCode || "Loading..."}
        </p>
      </div>
    </div>

    {/* Referral Link */}
    {referralCode && (
      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-500">
          Your Referral Link
        </p>

        <div className="mt-2 flex gap-2">
          <input
            readOnly
            value={`${window.location.origin}/register?ref=${encodeURIComponent(
              referralCode
            )}`}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 outline-none"
          />

          <button
            type="button"
            onClick={async () => {
              const link = `${window.location.origin}/register?ref=${encodeURIComponent(
                referralCode
              )}`;

              try {
                await navigator.clipboard.writeText(link);
                setMessage("Referral link copied.");
              } catch {
                setError("Unable to copy referral link.");
              }
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
      </div>
    )}

    {/* Referral Statistics */}
    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-[11px] font-semibold text-slate-500">
          Total Referrals
        </p>

        <p className="mt-1 text-xl font-extrabold text-slate-900">
          {totalReferrals}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-[11px] font-semibold text-slate-500">
          Completed
        </p>

        <p className="mt-1 text-xl font-extrabold text-slate-900">
          {completedReferrals}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-[11px] font-semibold text-slate-500">
          Commission
        </p>

        <p className="mt-1 text-xl font-extrabold text-blue-700">
          ${referralEarningsUsd.toFixed(2)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-[11px] font-semibold text-slate-500">
          Rate
        </p>

        <p className="mt-1 text-xl font-extrabold text-slate-900">
          10%
        </p>
      </div>
    </div>

    {/* Recent Referrals */}
    {referrals.length > 0 && (
      <div className="mt-5">
        <p className="mb-2 text-sm font-extrabold text-slate-900">
          Recent Referrals
        </p>

        <div className="space-y-2">
          {referrals.slice(0, 5).map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-700">
  {referral.referred_profile?.[0]?.full_name ||
    `Referral #${referral.referred_user_id.slice(0, 8)}`}
</p>

                <p className="mt-1 text-[11px] text-slate-400">
                  {new Date(
                    referral.created_at
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-extrabold text-blue-700">
                  ${Number(
                    referral.commission_amount_usd || 0
                  ).toFixed(2)}
                </p>

                <p className="text-[11px] font-semibold text-slate-500">
  UGX{" "}
  {Number(
    referral.commission_amount_ugx || 0
  ).toLocaleString()}
</p>

                <p
                  className={`text-[10px] font-bold uppercase ${
                    referral.status === "completed"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {referral.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>


        {/* NOTICES */}
        {notices.length > 0 && (
          <section className="mt-6">
            <div className="mb-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                Messages & Notices
              </h2>

              <p className="text-xs text-slate-500">
                Important updates for your account.
              </p>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                >
                  <p className="font-extrabold text-slate-900">
                    {notice.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {notice.message}
                  </p>

                  <p className="mt-2 text-[11px] text-slate-400">
                    {new Date(
                      notice.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

       

        {/* DAILY TASKS */}
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Today's Activities
              </h2>

              <p className="text-xs text-slate-500">
                Complete today's activities to qualify
                for today's return.
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              {completedCount}/{totalTasks}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500">
                No activities are available today.
              </div>
            ) : (
              tasks.map((task, index) => {
                const completed =
                  completedTaskIds.includes(
                    task.id
                  );

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        completed
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : String(index + 1).padStart(
                            2,
                            "0"
                          )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-slate-900">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {completed ? (
                      <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleCompleteTask(
                            task.id
                          )
                        }
                        disabled={
                          completingTask ===
                          task.id
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {completingTask ===
                        task.id
                          ? "..."
                          : "Complete"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* RECENT DEPOSITS */}
        {deposits.length > 0 && (
          <section className="mt-7">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Recent Deposits
                </h2>

                <p className="text-xs text-slate-500">
                  Your latest deposit requests.
                </p>
              </div>

              <div className="text-sm font-extrabold text-blue-700">
                ${totalDeposits.toFixed(2)} total
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-extrabold">
                      $
                      {Number(
                        deposit.amount_usd
                      ).toFixed(2)}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(
                        deposit.submitted_at
                      ).toLocaleString()}
                    </p>

                    {deposit.reference && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        Ref: {deposit.reference}
                      </p>
                    )}
                  </div>

                  <StatusBadge
                    status={deposit.status}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECENT WITHDRAWALS */}
        {withdrawals.length > 0 && (
          <section className="mt-7 pb-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Recent Withdrawals
                </h2>

                <p className="text-xs text-slate-500">
                  Your latest withdrawal requests.
                </p>
              </div>

              <div className="text-sm font-extrabold text-blue-700">
                ${totalWithdrawals.toFixed(2)} total
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        $
                        {Number(
                          withdrawal.requested_amount_usd
                        ).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          withdrawal.requested_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <StatusBadge
                      status={withdrawal.status}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <p className="text-slate-400">
                        Fee (5%)
                      </p>

                      <p className="mt-1 font-bold text-red-600">
                        -$
                        {Number(
                          withdrawal.fee_usd
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        You receive
                      </p>

                      <p className="mt-1 font-extrabold text-blue-700">
                        $
                        {Number(
                          withdrawal.net_amount_usd
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {withdrawal.reviewed_at && (
                    <p className="mt-3 text-[11px] text-slate-400">
                      Reviewed{" "}
                      {new Date(
                        withdrawal.reviewed_at
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
      <p className="text-[10px] font-medium text-blue-100">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-white sm:text-base">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  const classes =
    normalized === "approved" ||
    normalized === "completed" ||
    normalized === "verified"
      ? "bg-green-50 text-green-700"
      : normalized === "rejected" ||
        normalized === "failed"
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${classes}`}
    >
      {status}
    </span>
  );
}