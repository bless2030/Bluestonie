"use client";


import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  Deposit,
  MoneyValue,
  Profile,
  Withdrawal,
} from "@/lib/types";

type Toast = {
  type: "success" | "error";
  message: string;
};

type Referral = {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  commission_rate: number;
  commission_amount_usd: number;
  commission_amount_ugx: number;
  status: string;
  qualifying_transaction_id: string | null;
  created_at: string;

  referrer_profile?: {
    id: string;
    full_name: string | null;
    phone: string | null;
    country: string | null;
  }[] | null;

  referred_profile?: {
    id: string;
    full_name: string | null;
    phone: string | null;
    country: string | null;
  }[] | null;
};

type AdminDashboardStats = {
  total_users: number;
  active_users: number;
  dormant_users: number;
  new_users_today: number;

  total_deposits: number;
  pending_deposits: number;
  rejected_deposits: number;
  today_deposits: number;

  total_withdrawals: number;
  pending_withdrawals: number;
  rejected_withdrawals: number;
  withdrawal_fees: number;
  today_withdrawals: number;

  total_returns: number;
  today_returns: number;
  return_records: number;

  total_referral_commission: number;
  completed_referral_commission: number;
  pending_referral_commission: number;
  pending_referrals: number;

  total_invested: number;
  active_investments: number;
  active_capital: number;
  locked_capital: number;
  completed_investments: number;
  earned_investment_returns: number;

  wallet_balance: number;
  total_wallet_deposited: number;
  total_wallet_invested: number;
  total_wallet_returns: number;
  total_wallet_withdrawn: number;

  tasks_completed_today: number;
  users_completed_all_tasks_today: number;
  users_with_tasks_today: number;

  users_with_active_investments: number;
  users_never_deposited: number;
  users_never_invested: number;

  completed_tasks_0_5_today: number;
  completed_tasks_1_4_today: number;
  completed_tasks_5_5_today: number;

  net_deposits: number;
  uninvested_capital: number;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function getStatusStyle(status: string | null | undefined) {
  const value = (status || "").toLowerCase();

  if (value === "approved" || value === "completed" || value === "verified") {
    return "bg-green-50 text-green-700";
  }

  if (value === "pending") {
    return "bg-amber-50 text-amber-700";
  }

  if (value === "rejected" || value === "failed") {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getStatusLabel(status: string | null | undefined) {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function AdminStat({
  title,
  value,
  icon,
  detail,
  className = "bg-white",
}: {
  title: string;
  value: string;
  icon: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 sm:p-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 truncate text-[11px] text-slate-500">
            {detail}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-sm font-extrabold text-slate-700 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SmallStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string | null | undefined;
}) {
  return (
    <span
      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${getStatusStyle(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function Rule({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-400">{label}</span>

      <span className="text-sm font-extrabold text-white">
        {value}
      </span>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function MenuIcon({ item }: { item: string }) {
  const icons: Record<string, string> = {
    Overview: "⌂",
    Deposits: "↓",
    "Deposit Settings": "⚙",
    Withdrawals: "↑",
    Referrals: "↗",
    Users: "♙",
    Packages: "▣",
    "Daily Tasks": "✓",
    Notices: "!",
    Transactions: "▤",
  };

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm">
      {icons[item] || "•"}
    </span>
  );
}

const menuItems = [
  "Overview",
  "Deposits",
  "Deposit Settings",
  "Withdrawals",
  "Referrals",
  "Users",
  "Packages",
  "Daily Tasks",
  "Notices",
  "Transactions",
];

export default function AdminPage() {
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  const [activeSection, setActiveSection] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(false);

  const [referrals, setReferrals] = useState<Referral[]>([]);
const [loadingReferrals, setLoadingReferrals] = useState(false);

const [overviewStats, setOverviewStats] =
  useState<AdminDashboardStats | null>(null);

const [loadingOverviewStats, setLoadingOverviewStats] =
  useState(false);

  const [toast, setToast] = useState<Toast | null>(null);
  const [search, setSearch] = useState("");

  const [depositMethod, setDepositMethod] = useState("");
const [depositNumber, setDepositNumber] = useState("");
const [depositAccountName, setDepositAccountName] = useState("");

const [savingDepositSettings, setSavingDepositSettings] =
  useState(false);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });

      window.setTimeout(() => {
        setToast(null);
      }, 4000);
    },
    []
  );

  const loadDeposits = useCallback(async () => {
    setLoadingDeposits(true);

    const { data, error } = await supabase
  .from("deposits")
  .select(`
    *,
    profiles:user_id (
      id,
      full_name,
      phone,
      country,
      role,
      status,
      created_at
    )
  `)
  .order("submitted_at", { ascending: false });
    if (error) {
      showToast("error", error.message);
      setDeposits([]);
    } else {
      setDeposits((data || []) as Deposit[]);
    }

    setLoadingDeposits(false);
  }, [showToast]);

const loadReferrals = useCallback(async () => {
  setLoadingReferrals(true);

  const { data, error } = await supabase
    .from("referrals")
    .select(
      "id, referrer_id, referred_user_id, commission_rate, commission_amount_usd, commission_amount_ugx, status, qualifying_transaction_id, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load referrals:", error);
    setReferrals([]);
    showToast("error", error.message);
    setLoadingReferrals(false);
    return;
  }

  const referralRows = (data || []) as Referral[];

  if (referralRows.length === 0) {
    setReferrals([]);
    setLoadingReferrals(false);
    return;
  }

  const userIds = Array.from(
    new Set(
      referralRows.flatMap((referral) => [
        referral.referrer_id,
        referral.referred_user_id,
      ])
    )
  );

  const {
    data: referralProfiles,
    error: profileError,
  } = await supabase.rpc("get_admin_referral_profiles", {
    p_user_ids: userIds,
  });

  if (profileError) {
    console.error(
      "Failed to load referral profiles:",
      profileError
    );
    setReferrals(referralRows);
    setLoadingReferrals(false);
    return;
  }

  const referralsWithProfiles = referralRows.map(
    (referral) => ({
      ...referral,
      referrer_profile:
        referralProfiles?.filter(
          (profile: {
            id: string;
            full_name: string | null;
            phone: string | null;
            country: string | null;
          }) => profile.id === referral.referrer_id
        ) || [],

      referred_profile:
        referralProfiles?.filter(
          (profile: {
            id: string;
            full_name: string | null;
            phone: string | null;
            country: string | null;
          }) => profile.id === referral.referred_user_id
        ) || [],
    })
  );

  setReferrals(referralsWithProfiles);
  setLoadingReferrals(false);
}, [showToast]);

const loadDepositSettings = useCallback(async () => {
  const { data, error } = await supabase
    .from("system_settings")
    .select("key, value")
    .in("key", [
      "deposit_method",
      "deposit_number",
      "deposit_account_name",
    ]);

  if (error) {
    console.error(
      "Failed to load deposit settings:",
      error
    );

    showToast("error", error.message);
    return;
  }

  data?.forEach((setting) => {
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
}, [showToast]);



const saveDepositSettings = useCallback(async () => {
  setSavingDepositSettings(true);

  const settings = [
    {
      key: "deposit_method",
      value: depositMethod.trim(),
    },
    {
      key: "deposit_number",
      value: depositNumber.trim(),
    },
    {
      key: "deposit_account_name",
      value: depositAccountName.trim(),
    },
  ];

  for (const setting of settings) {
    const { error } = await supabase
      .from("system_settings")
      .upsert(
        {
          key: setting.key,
          value: setting.value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "key",
        }
      );

    if (error) {
      console.error("Failed to save setting:", error);
      showToast("error", error.message);
      setSavingDepositSettings(false);
      return;
    }
  }

  setSavingDepositSettings(false);

  showToast(
    "success",
    "Deposit payment settings saved successfully."
  );
}, [
  depositMethod,
  depositNumber,
  depositAccountName,
  showToast,
]);

const loadOverviewStats = useCallback(async () => {
  setLoadingOverviewStats(true);

  const { data, error } = await supabase.rpc(
    "get_admin_dashboard_stats"
  );

  if (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);
    showToast("error", error.message);
    setOverviewStats(null);
    setLoadingOverviewStats(false);
    return;
  }

  setOverviewStats(data as AdminDashboardStats);
  setLoadingOverviewStats(false);
}, [showToast]);

  useEffect(() => {
    let cancelled = false;

    async function verifyAdministrator() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

      if (
        profileError ||
        profile?.role !== "admin" ||
        profile?.status !== "active"
      ) {
        router.replace("/dashboard");
        return;
      }

      if (cancelled) return;

    setIsAdminAuthorized(true);
setCheckingAdmin(false);

await loadDeposits();
await loadReferrals();
await loadOverviewStats();
    }

    void verifyAdministrator();

    return () => {
      cancelled = true;
    };
  }, [
  loadDeposits,
  loadReferrals,
  loadOverviewStats,
  router,
]);

  if (checkingAdmin || !isAdminAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Verifying administrator access...
          </p>
        </div>
      </main>
    );
  }


  const pendingDeposits = deposits.filter(
    (deposit) => deposit.status === "pending"
  );

  const verifiedDeposits = deposits.filter(
    (deposit) => deposit.status === "verified"
  );

const completedReferrals = referrals.filter(
  (referral) => referral.status === "completed"
);

const pendingReferrals = referrals.filter(
  (referral) => referral.status === "pending"
);

const totalReferralCommissionUsd = referrals.reduce(
  (sum, referral) =>
    sum + Number(referral.commission_amount_usd || 0),
  0
);

const totalReferralCommissionUgx = referrals.reduce(
  (sum, referral) =>
    sum + Number(referral.commission_amount_ugx || 0),
  0
);

  const totalVerified = verifiedDeposits.reduce(
    (sum, deposit) => sum + Number(deposit.amount_usd || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-bold shadow-xl ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 text-white transition-transform duration-200 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex min-h-20 items-center justify-between border-b border-slate-800 px-5">
            <div>
              <p className="text-xl font-extrabold tracking-tight">
                BLUESTONIE
              </p>

              <p className="mt-1 text-xs font-semibold text-blue-400">
                ADMIN PANEL
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Admin profile */}
          <div className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  Administrator
                </p>

                <p className="truncate text-xs text-slate-400">
                  Super Admin
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Management
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const active = activeSection === item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setActiveSection(item);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <MenuIcon item={item} />

                    <span>{item}</span>

                    {item === "Deposits" &&
                      pendingDeposits.length > 0 && (
                        <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-950">
                          {pendingDeposits.length}
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom links */}
          <div className="border-t border-slate-800 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              ← User Dashboard
            </Link>

            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              ↗ Public Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden"
              >
                ☰
              </button>

              <div>
                <p className="text-xs font-semibold text-blue-600">
                  ADMINISTRATION
                </p>

                <h1 className="text-lg font-extrabold sm:text-xl">
                  {activeSection}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={async () => {
                  await loadDeposits();
                  showToast("success", "Data refreshed.");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                ↻ Refresh
              </button>

              <div className="hidden rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 sm:block">
                ● System Online
              </div>

              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700 sm:flex">
                A
              </div>

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.replace("/login");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          {activeSection === "Overview" && (
<Overview
  deposits={deposits}
  onDeposits={() => setActiveSection("Deposits")}
  stats={overviewStats}
  loadingStats={loadingOverviewStats}
/>
          )}

          {activeSection === "Deposits" && (
            <Deposits
              deposits={deposits}
              loading={loadingDeposits}
              search={search}
              setSearch={setSearch}
              reload={loadDeposits}
              showToast={showToast}
            />
          )}
          
          {activeSection === "Referrals" && (
  <section className="space-y-6">
    {/* Header */}
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
        Referral Management
      </p>

      <h2 className="mt-1 text-xl font-extrabold text-slate-900">
        Referrals & Commissions
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Monitor referral relationships and commission earnings.
      </p>
    </div>

    {/* Statistics */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Total Referrals
        </p>

        <p className="mt-2 text-3xl font-extrabold text-slate-900">
          {referrals.length}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Completed
        </p>

        <p className="mt-2 text-3xl font-extrabold text-green-600">
          {completedReferrals.length}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Pending
        </p>

        <p className="mt-2 text-3xl font-extrabold text-amber-500">
          {pendingReferrals.length}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Commission Earned
        </p>

        <p className="mt-2 text-2xl font-extrabold text-blue-700">
          ${totalReferralCommissionUsd.toFixed(2)}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-500">
          UGX {totalReferralCommissionUgx.toLocaleString()}
        </p>
      </div>
    </div>

    {/* Referral Table */}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-base font-extrabold text-slate-900">
          Referral Records
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          All referral relationships recorded by BLUESTONIE.
        </p>
      </div>

      {loadingReferrals ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading referrals...
        </div>
      ) : referrals.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No referral records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Referrer
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Referred User
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Rate
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Commission
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
  <p className="text-xs font-bold text-slate-800">
    {referral.referrer_profile?.[0]?.full_name ||
      `User #${referral.referrer_id.slice(0, 8)}`}
  </p>

  {referral.referrer_profile?.[0]?.phone && (
    <p className="mt-1 text-[11px] text-slate-400">
      {referral.referrer_profile[0].phone}
    </p>
  )}
</td>

<td className="px-5 py-4">
  <p className="text-xs font-bold text-slate-800">
    {referral.referred_profile?.[0]?.full_name ||
      `User #${referral.referred_user_id.slice(0, 8)}`}
  </p>

  {referral.referred_profile?.[0]?.phone && (
    <p className="mt-1 text-[11px] text-slate-400">
      {referral.referred_profile[0].phone}
    </p>
  )}
</td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-slate-700">
                      {Number(referral.commission_rate || 0)}%
                    </span>
                  </td>

                  <td className="px-5 py-4">
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
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                        referral.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    {new Date(
                      referral.created_at
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
)}
          

          {activeSection === "Deposit Settings" && (
  <DepositSettings
    depositMethod={depositMethod}
    setDepositMethod={setDepositMethod}
    depositNumber={depositNumber}
    setDepositNumber={setDepositNumber}
    depositAccountName={depositAccountName}
    setDepositAccountName={setDepositAccountName}
    saving={savingDepositSettings}
    onSave={() => void saveDepositSettings()}
  />
)}


          {activeSection === "Withdrawals" && <Withdrawals />}

          {activeSection === "Users" && <Users />}

          {activeSection === "Packages" && <Packages />}

          {activeSection === "Daily Tasks" && <DailyTasks />}

          {activeSection === "Notices" && <Notices />}

          {activeSection === "Transactions" && <Transactions />}
        </div>
      </div>
    </main>
  );
}

/* =========================================================
DEPOSIT SETTINGS
========================================================= */

function DepositSettings({
  depositMethod,
  setDepositMethod,
  depositNumber,
  setDepositNumber,
  depositAccountName,
  setDepositAccountName,
  saving,
  onSave,
}: {
  depositMethod: string;
  setDepositMethod: (value: string) => void;
  depositNumber: string;
  setDepositNumber: (value: string) => void;
  depositAccountName: string;
  setDepositAccountName: (value: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<
    "Mobile Money" | "USDT / Crypto" | "Merchant Pay" | "Bank Transfer"
  >("Mobile Money");

  return (
    <div>
      <PageIntro
        eyebrow="Settings"
        title="Deposit Settings"
        description="Manage the payment methods displayed to users when they make a deposit."
      />

      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="space-y-6">

          {/* PAYMENT METHODS */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Deposit Methods
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedMethod("Mobile Money")}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedMethod === "Mobile Money"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <p className="font-extrabold text-slate-900">
                  Mobile Money
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  MTN & Airtel Mobile Money
                </p>
                <span className="mt-2 inline-block text-xs font-bold text-green-600">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("USDT / Crypto")}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedMethod === "USDT / Crypto"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <p className="font-extrabold text-slate-900">
                  USDT / Crypto
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Cryptocurrency payment
                </p>
                <span className="mt-2 inline-block text-xs font-bold text-green-600">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("Merchant Pay")}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedMethod === "Merchant Pay"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <p className="font-extrabold text-slate-900">
                  Merchant Pay
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Merchant payment option
                </p>
                <span className="mt-2 inline-block text-xs font-bold text-green-600">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("Bank Transfer")}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedMethod === "Bank Transfer"
                    ? "border-slate-300 bg-slate-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-extrabold text-slate-900">
                  Bank Transfer
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Direct bank payment
                </p>
                <span className="mt-2 inline-block text-xs font-bold text-amber-600">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>

          {/* MOBILE MONEY SETTINGS */}
          {selectedMethod === "Mobile Money" && (
            <div className="border-t border-slate-200 pt-6">
              <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900">
                  Mobile Money Settings
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  These details are shown to users when Mobile Money is selected.
                </p>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Deposit Method
                  </label>
                  <input
                    type="text"
                    value={depositMethod}
                    onChange={(e) => setDepositMethod(e.target.value)}
                    placeholder="Mobile Money"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Deposit Number
                  </label>
                  <input
                    type="text"
                    value={depositNumber}
                    onChange={(e) => setDepositNumber(e.target.value)}
                    placeholder="e.g. 077XXXXXXX"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={depositAccountName}
                    onChange={(e) => setDepositAccountName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Mobile Money Settings"}
                </button>

              </div>
            </div>
          )}

          {selectedMethod === "USDT / Crypto" && (
  <div className="border-t border-slate-200 pt-6">
    <div className="mb-5">
      <h3 className="text-base font-extrabold text-slate-900">
        USDT / Crypto Settings
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Configure the cryptocurrency payment details displayed to users.
      </p>
    </div>

    <div className="space-y-5">
      <div>
        <label className="text-sm font-bold text-slate-700">
          Network
        </label>

        <select
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          defaultValue="TRC20"
        >
          <option value="TRC20">USDT — TRC20</option>
          <option value="BEP20">USDT — BEP20</option>
          <option value="ERC20">USDT — ERC20</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Wallet Address
        </label>

        <input
          type="text"
          placeholder="Enter USDT wallet address"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Wallet Name / Label
        </label>

        <input
          type="text"
          placeholder="e.g. Bluestonie USDT Wallet"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Payment Instructions
        </label>

        <textarea
          rows={4}
          placeholder="Enter instructions users should follow when paying with USDT..."
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-slate-300 px-5 py-3.5 text-sm font-extrabold text-slate-600 sm:w-auto"
      >
        Save Crypto Settings
      </button>

      <p className="text-xs text-amber-600">
        Saving will be connected when the payment-method backend is added.
      </p>
    </div>
  </div>
)}

          {selectedMethod === "Merchant Pay" && (
  <div className="border-t border-slate-200 pt-6">
    <div className="mb-5">
      <h3 className="text-base font-extrabold text-slate-900">
        Merchant Pay Settings
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Configure the merchant payment details displayed to users.
      </p>
    </div>

    <div className="space-y-5">
      <div>
        <label className="text-sm font-bold text-slate-700">
          Merchant Name
        </label>

        <input
          type="text"
          placeholder="e.g. Bluestonie Investments"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Merchant Number / ID
        </label>

        <input
          type="text"
          placeholder="Enter merchant number or ID"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Account Name
        </label>

        <input
          type="text"
          placeholder="Enter merchant account name"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Payment Instructions
        </label>

        <textarea
          rows={4}
          placeholder="Enter instructions users should follow when making a Merchant Pay payment..."
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-slate-300 px-5 py-3.5 text-sm font-extrabold text-slate-600 sm:w-auto"
      >
        Save Merchant Pay Settings
      </button>

      <p className="text-xs text-amber-600">
        Saving will be connected when the payment-method backend is added.
      </p>
    </div>
  </div>
)}
          {selectedMethod === "Bank Transfer" && (
  <div className="border-t border-slate-200 pt-6">
    <div className="mb-5">
      <h3 className="text-base font-extrabold text-slate-900">
        Bank Transfer
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Bank transfer deposits will be available in a future update.
      </p>
    </div>

    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-extrabold text-slate-900">
            Bank Transfer
          </p>
          <p className="mt-1 text-sm text-slate-600">
            This payment method is currently being prepared.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-700">
          Coming Soon
        </span>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
  deposits,
  onDeposits,
  stats,
  loadingStats,
}: {
  deposits: Deposit[];
  onDeposits: () => void;
  stats: AdminDashboardStats | null;
  loadingStats: boolean;
}) {
  const money = (value: number | undefined) =>
    `$${Number(value || 0).toFixed(2)}`;

  return (
    <div>
      <PageIntro
        eyebrow="Overview"
        title="Platform Overview"
        description="Monitor the main activity and financial position of BLUESTONIE."
      />

      {/* COMMAND SUMMARY */}
      <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-white shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              BLUESTONIE Command Center
            </p>

            <h2 className="mt-1 text-lg font-extrabold">
              Platform at a glance
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-green-300">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            System Online
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Users
            </p>
            <p className="mt-1 text-xl font-extrabold">
              {stats?.total_users ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Deposits
            </p>
            <p className="mt-1 text-xl font-extrabold">
              {money(stats?.total_deposits)}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Invested
            </p>
            <p className="mt-1 text-xl font-extrabold">
              {money(stats?.total_invested)}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Net Flow
            </p>
            <p className="mt-1 text-xl font-extrabold">
              {money(stats?.net_deposits)}
            </p>
          </div>
        </div>
      </div>

      {/* USERS */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-800">
            Users
          </h2>

          {loadingStats && (
            <span className="text-[11px] font-semibold text-slate-400">
              Updating...
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Total Users"
            value={String(stats?.total_users ?? 0)}
            icon="◎"
            detail="Registered"
            className="bg-blue-50"
          />

          <AdminStat
            title="Active"
            value={String(stats?.active_users ?? 0)}
            icon="●"
            detail="Active accounts"
            className="bg-green-50"
          />

          <AdminStat
            title="Dormant"
            value={String(stats?.dormant_users ?? 0)}
            icon="○"
            detail="Inactive accounts"
            className="bg-amber-50"
          />

          <AdminStat
            title="New Today"
            value={String(stats?.new_users_today ?? 0)}
            icon="+"
            detail="Today's registrations"
            className="bg-violet-50"
          />
        </div>
      </section>

      {/* FINANCIAL */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Financial Overview
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Deposits"
            value={money(stats?.total_deposits)}
            icon="↓"
            detail="Verified"
            className="bg-emerald-50"
          />

          <AdminStat
            title="Withdrawals"
            value={money(stats?.total_withdrawals)}
            icon="↑"
            detail="Paid out"
            className="bg-rose-50"
          />

          <AdminStat
            title="Returns"
            value={money(stats?.total_returns)}
            icon="↗"
            detail="Credited ROI"
            className="bg-purple-50"
          />

          <AdminStat
            title="Referral Money"
            value={money(stats?.total_referral_commission)}
            icon="↗"
            detail="Commissions"
            className="bg-yellow-50"
          />
        </div>
      </section>

      {/* CAPITAL */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Capital & Wallet
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Invested"
            value={money(stats?.total_invested)}
            icon="$"
            detail="All investments"
            className="bg-sky-50"
          />

          <AdminStat
            title="Active Capital"
            value={money(stats?.active_capital)}
            icon="◆"
            detail="Active investments"
            className="bg-green-50"
          />

          <AdminStat
            title="Locked Capital"
            value={money(stats?.locked_capital)}
            icon="▣"
            detail="Under lock"
            className="bg-orange-50"
          />

          <AdminStat
            title="Wallet Balance"
            value={money(stats?.wallet_balance)}
            icon="□"
            detail="Subscriber wallets"
            className="bg-indigo-50"
          />
        </div>
      </section>

      {/* BUSINESS INTELLIGENCE */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Business Intelligence
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Uninvested"
            value={money(stats?.uninvested_capital)}
            icon="◇"
            detail="Deposits not invested"
            className="bg-cyan-50"
          />

          <AdminStat
            title="Fees Collected"
            value={money(stats?.withdrawal_fees)}
            icon="%"
            detail="Withdrawal fees"
            className="bg-slate-100"
          />

          <AdminStat
            title="Active Investments"
            value={String(stats?.active_investments ?? 0)}
            icon="◆"
            detail="Currently active"
            className="bg-teal-50"
          />

          <AdminStat
            title="Completed"
            value={String(stats?.completed_investments ?? 0)}
            icon="✓"
            detail="Completed investments"
            className="bg-lime-50"
          />
        </div>
      </section>

      {/* ACTION REQUIRED */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Action Required
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Pending Deposits"
            value={String(stats?.pending_deposits ?? 0)}
            icon="!"
            detail="Need verification"
            className="bg-amber-50"
          />

          <AdminStat
            title="Pending Withdrawals"
            value={String(stats?.pending_withdrawals ?? 0)}
            icon="!"
            detail="Need review"
            className="bg-red-50"
          />

          <AdminStat
            title="Pending Referrals"
            value={String(stats?.pending_referrals ?? 0)}
            icon="↗"
            detail="Awaiting action"
            className="bg-violet-50"
          />

          <AdminStat
            title="5/5 Tasks"
            value={String(stats?.completed_tasks_5_5_today ?? 0)}
            icon="✓"
            detail="Completed today"
            className="bg-blue-50"
          />
        </div>
      </section>

      {/* USER OPPORTUNITIES */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          User Opportunities
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Never Deposited"
            value={String(stats?.users_never_deposited ?? 0)}
            icon="○"
            detail="Potential subscribers"
            className="bg-orange-50"
          />

          <AdminStat
            title="Never Invested"
            value={String(stats?.users_never_invested ?? 0)}
            icon="◇"
            detail="Deposited but not invested"
            className="bg-cyan-50"
          />

          <AdminStat
            title="With Investments"
            value={String(stats?.users_with_active_investments ?? 0)}
            icon="◆"
            detail="Active investors"
            className="bg-green-50"
          />

          <AdminStat
            title="Tasks Today"
            value={String(stats?.tasks_completed_today ?? 0)}
            icon="✓"
            detail="Task completions"
            className="bg-purple-50"
          />
        </div>
      </section>

      {/* TODAY */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Today's Activity
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat
            title="Deposits Today"
            value={money(stats?.today_deposits)}
            icon="↓"
            detail="Verified today"
            className="bg-emerald-50"
          />

          <AdminStat
            title="Withdrawals Today"
            value={money(stats?.today_withdrawals)}
            icon="↑"
            detail="Approved today"
            className="bg-rose-50"
          />

          <AdminStat
            title="Returns Today"
            value={money(stats?.today_returns)}
            icon="↗"
            detail="ROI credited"
            className="bg-purple-50"
          />

          <AdminStat
            title="New Users"
            value={String(stats?.new_users_today ?? 0)}
            icon="+"
            detail="Registered today"
            className="bg-blue-50"
          />
        </div>
      </section>

      {/* TASK DISTRIBUTION */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-extrabold text-slate-800">
          Today's Task Progress
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <AdminStat
            title="0 / 5"
            value={String(stats?.completed_tasks_0_5_today ?? 0)}
            icon="○"
            detail="No tasks"
            className="bg-slate-100"
          />

          <AdminStat
            title="1–4 / 5"
            value={String(stats?.completed_tasks_1_4_today ?? 0)}
            icon="◐"
            detail="Partially complete"
            className="bg-amber-50"
          />

          <AdminStat
            title="5 / 5"
            value={String(stats?.completed_tasks_5_5_today ?? 0)}
            icon="✓"
            detail="Fully complete"
            className="bg-green-50"
          />
        </div>
      </section>

      {/* RECENT DEPOSITS */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-slate-900">
              Recent Deposits
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest deposit requests
            </p>
          </div>

          <button
            type="button"
            onClick={onDeposits}
            className="text-xs font-bold text-blue-600"
          >
            View all
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {deposits.slice(0, 5).map((deposit) => (
            <div
              key={deposit.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">
                  {deposit.profiles?.full_name || "Unknown depositor"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {deposit.profiles?.phone || "No phone number"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(deposit.submitted_at)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-extrabold text-slate-900">
                  {money(Number(deposit.amount_usd || 0))}
                </p>

                <StatusBadge status={deposit.status} />
              </div>
            </div>
          ))}

          {deposits.length === 0 && (
            <p className="py-5 text-center text-sm text-slate-400">
              No deposits found.
            </p>
          )}
        </div>
      </div>

      {/* PLATFORM SETTINGS */}
      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
          Platform Settings
        </p>

        <h2 className="mt-2 text-xl font-extrabold">
          Current Rules
        </h2>

        <div className="mt-5 space-y-3">
          <Rule
            label="Accounting rate"
            value="1 USD = 4,000 UGX"
          />

          <Rule label="Daily activities" value="5" />
          <Rule label="Withdrawal fee" value="5%" />
          <Rule label="Capital lock" value="4 months" />
          <Rule label="Minimum investment" value="$10" />
          <Rule label="Maximum investment" value="$500" />
        </div>
      </div>

      {/* ADMINISTRATOR NOTICE */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Administrator Notice
        </p>

        <h2 className="mt-2 font-extrabold text-blue-950">
          Review financial records carefully
        </h2>

        <p className="mt-2 text-sm leading-6 text-blue-800">
          Deposit verification and withdrawal processing should
          be reviewed before financial transactions are finalized.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DEPOSITS
========================================================= */

function Deposits({
  deposits,
  loading,
  search,
  setSearch,
  reload,
  showToast,
}: {
  deposits: Deposit[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  reload: () => Promise<void>;
  showToast: (type: "success" | "error", message: string) => void;
}) {
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const filteredDeposits = deposits.filter((deposit) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      (deposit.reference || "").toLowerCase().includes(value) ||
      deposit.id.toLowerCase().includes(value) ||
      deposit.user_id.toLowerCase().includes(value) ||
      deposit.status.toLowerCase().includes(value)
    );
  });

  const openReview = (deposit: Deposit) => {
    setSelected(deposit);
    setNote(deposit.admin_note || "");
  };

  const closeReview = () => {
    if (processing) return;

    setSelected(null);
    setNote("");
  };

  const updateDeposit = async (
    status: "verified" | "rejected"
  ) => {
    if (!selected) return;

    setProcessing(true);

    if (status === "verified") {
      const { error } = await supabase.rpc(
        "verify_deposit",
        {
          p_deposit_id: selected.id,
        }
      );

      if (error) {
        showToast("error", error.message);
        setProcessing(false);
        return;
      }

      showToast(
        "success",
        "Deposit verified and wallet credited successfully."
      );

      setProcessing(false);
      setSelected(null);
      setNote("");

      await reload();
      return;
    }

    const { data, error } = await supabase
      .from("deposits")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        admin_note: note.trim() || null,
      })
      .eq("id", selected.id)
      .eq("status", "pending")
      .select();

    if (error) {
      showToast("error", error.message);
      setProcessing(false);
      return;
    }

    if (!data || data.length === 0) {
      showToast(
        "error",
        "This deposit has already been reviewed."
      );

      setProcessing(false);
      return;
    }

    showToast(
      "success",
      "Deposit rejected successfully."
    );

    setProcessing(false);
    setSelected(null);
    setNote("");

    await reload();
  };

  return (
    <div>
      <PageIntro
        eyebrow="Wallet Management"
        title="Deposit Requests"
        description="Review and verify subscriber deposit requests."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SmallStat
          title="Pending"
          value={String(
            deposits.filter((d) => d.status === "pending").length
          )}
        />

        <SmallStat
          title="Verified"
          value={String(
            deposits.filter((d) => d.status === "verified").length
          )}
        />

        <SmallStat
          title="Rejected"
          value={String(
            deposits.filter((d) => d.status === "rejected").length
          )}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, reference or user..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={() => setSearch("")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Loading deposits...
            </p>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="font-bold text-slate-700">
              No deposits found
            </p>
          </div>
        ) : (
          filteredDeposits.map((deposit) => (
            <div
              key={deposit.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                    $
                  </div>

                  <div className="min-w-0">
  <p className="truncate font-extrabold text-slate-900">
    {deposit.profiles?.full_name || "Unknown depositor"}
  </p>

  <p className="mt-1 text-xs text-slate-500">
    {deposit.profiles?.phone || "No phone number"}
  </p>

  <p className="mt-1 text-xs text-slate-400">
    {deposit.profiles?.country || "No country"}
  </p>

  <p className="mt-2 break-all text-xs text-slate-400">
    Reference: {deposit.reference || "No reference"}
  </p>

  <p className="mt-1 text-xs text-slate-400">
    Submitted: {formatDate(deposit.submitted_at)}
  </p>
</div>
                </div>

                <div className="lg:text-right">
                  <p className="text-xl font-extrabold text-green-600">
                    ${Number(deposit.amount_usd || 0).toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    UGX{" "}
                    {Number(
                      deposit.amount_ugx || 0
                    ).toLocaleString()}
                  </p>

                  <StatusBadge status={deposit.status} />
                </div>
              </div>

              {deposit.proof_url && (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-bold text-blue-800">
                    Payment Proof
                  </p>

                  <a
                    href={deposit.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-sm font-semibold text-blue-600 underline"
                  >
                    View proof
                  </a>
                </div>
              )}

              {deposit.admin_note && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">
                    Admin Note
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {deposit.admin_note}
                  </p>
                </div>
              )}

              {deposit.reviewed_at && (
                <div className="mt-3 text-xs text-slate-400">
                  Reviewed: {formatDate(deposit.reviewed_at)}
                  {deposit.reviewed_by
                    ? ` • ${deposit.reviewed_by}`
                    : ""}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => openReview(deposit)}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Review
                </button>

                {deposit.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openReview(deposit)}
                      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                    >
                      ✓ Verify
                    </button>

                    <button
                      type="button"
                      onClick={() => openReview(deposit)}
                      className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Deposit Review
                </p>

                <h2 className="mt-1 break-all text-xl font-extrabold">
                  {selected.reference || "Deposit Request"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeReview}
                disabled={processing}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoBox
                label="USD"
                value={`$${Number(
                  selected.amount_usd || 0
                ).toFixed(2)}`}
              />

              <InfoBox
                label="UGX"
                value={`UGX ${Number(
                  selected.amount_ugx || 0
                ).toLocaleString()}`}
              />

              <InfoBox
                label="Status"
                value={selected.status}
              />

              <InfoBox
                label="Submitted"
                value={formatDate(selected.submitted_at)}
              />
            </div>

            {selected.proof_url && (
              <a
                href={selected.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-blue-50 p-4 text-center text-sm font-bold text-blue-700"
              >
                Open Payment Proof
              </a>
            )}

            <div className="mt-5">
              <label
                htmlFor="admin-note"
                className="text-sm font-bold text-slate-700"
              >
                Admin Note
              </label>

              <textarea
                id="admin-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Enter a note about this review..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selected.status === "pending" ? (
                <>
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => updateDeposit("verified")}
                    className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {processing
                      ? "Processing..."
                      : "✓ Verify Deposit"}
                  </button>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => updateDeposit("rejected")}
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {processing
                      ? "Processing..."
                      : "✕ Reject Deposit"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={closeReview}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white sm:col-span-2"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   WITHDRAWALS
========================================================= */

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadWithdrawals = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
  .from("withdrawals")
  .select(`
    *,
    profiles:user_id (
      id,
      full_name,
      phone,
      country,
      role,
      status,
      created_at
    )
  `)
  .order("requested_at", { ascending: false });
    if (error) {
      console.error("WITHDRAWALS ERROR:", error);
      setError(error.message);
      setWithdrawals([]);
      setLoading(false);
      return;
    }

    setWithdrawals((data || []) as Withdrawal[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadWithdrawals();
  }, [loadWithdrawals]);

  const pendingWithdrawals = withdrawals.filter(
    (item) => item.status?.toLowerCase() === "pending"
  );

  const today = new Date();

  const completedToday = withdrawals.filter((item) => {
    const status = item.status?.toLowerCase();

    if (status !== "approved" && status !== "completed") {
      return false;
    }

    if (!item.reviewed_at) return false;

    const date = new Date(item.reviewed_at);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  const feesToday = completedToday.reduce(
    (total, item) => total + Number(item.fee_usd || 0),
    0
  );

  function formatUSD(amount: MoneyValue) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  async function approveWithdrawal(withdrawal: Withdrawal) {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      `Approve withdrawal of $${Number(
        withdrawal.requested_amount_usd || 0
      ).toFixed(2)}?`
    );

    if (!confirmed) return;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Administrator session not found.");
        return;
      }

      const { error: approvalError } =
        await supabase.rpc("approve_withdrawal", {
          p_withdrawal_id: withdrawal.id,
        });

      if (approvalError) {
        setError(approvalError.message);
        return;
      }

      setMessage("Withdrawal approved successfully.");
      await loadWithdrawals();
    } catch (err: unknown) {
      console.error("APPROVE WITHDRAWAL ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to approve withdrawal."
      );
    }
  }

  async function rejectWithdrawal(withdrawal: Withdrawal) {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      `Reject withdrawal of $${Number(
        withdrawal.requested_amount_usd || 0
      ).toFixed(2)}?`
    );

    if (!confirmed) return;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Administrator session not found.");
        return;
      }

      const { error: rejectionError } =
        await supabase.rpc("reject_withdrawal", {
          p_withdrawal_id: withdrawal.id,
          p_admin_note: null,
        });

      if (rejectionError) {
        setError(rejectionError.message);
        return;
      }

      setMessage("Withdrawal rejected successfully.");
      await loadWithdrawals();
    } catch (err: unknown) {
      console.error("REJECT WITHDRAWAL ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject withdrawal."
      );
    }
  }

  return (
    <div>
      <PageIntro
        eyebrow="Wallet Management"
        title="Withdrawal Requests"
        description="Review withdrawal requests submitted by subscribers."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SmallStat
          title="Pending"
          value={String(pendingWithdrawals.length)}
        />

        <SmallStat
          title="Completed Today"
          value={String(completedToday.length)}
        />

        <SmallStat
          title="Fees Today"
          value={formatUSD(feesToday)}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => void loadWithdrawals()}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          ↻ Refresh
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-bold text-red-600">
            Unable to process request
          </p>

          <p className="mt-1 break-words text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Loading withdrawal requests...
          </p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
            ↑
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-slate-800">
            No withdrawal requests
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Withdrawal requests submitted by subscribers will
            appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-extrabold text-blue-700">
                      $
                    </div>

                    <div>
                      <p className="font-extrabold text-slate-900">
                        Withdrawal Request
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Requested{" "}
                        {formatDate(withdrawal.requested_at)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 break-all font-mono text-[10px] text-slate-400">
                    User ID: {withdrawal.user_id}
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                    Withdrawal ID: {withdrawal.id}
                  </p>
{withdrawal.profiles && (
  <div className="mt-4 rounded-xl bg-blue-50 p-4">
    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
      Subscriber Details
    </p>

    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <p className="text-xs text-slate-400">Full name</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.full_name || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Phone</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.phone || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Country</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.country || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Account status</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.status || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Role</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.role || "user"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Joined</p>
        <p className="font-bold text-slate-900">
          {withdrawal.profiles.created_at
            ? formatDate(withdrawal.profiles.created_at)
            : "—"}
        </p>
      </div>
    </div>
  </div>
)}
                  
                </div>

                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-extrabold ${getStatusStyle(
                    withdrawal.status
                  )}`}
                >
                  {getStatusLabel(withdrawal.status)}
                </span>
              </div>




              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Requested
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {formatUSD(
                      withdrawal.requested_amount_usd
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-red-500">
                    Fee ({Number(withdrawal.fee_percent || 0)}%)
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-red-700">
                    {formatUSD(withdrawal.fee_usd)}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-500">
                    Net Amount
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-blue-700">
                    {formatUSD(withdrawal.net_amount_usd)}
                  </p>
                </div>
              </div>

              {(withdrawal.capital_amount ||
                withdrawal.lock_until) && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Investment
                  </p>

                  <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-slate-500">
                        Capital:
                      </span>{" "}
                      <span className="font-bold">
                        {formatUSD(
                          withdrawal.capital_amount
                        )}
                      </span>
                    </p>

                    <p>
                      <span className="text-slate-500">
                        Lock until:
                      </span>{" "}
                      <span className="font-bold">
                        {withdrawal.lock_until
                          ? formatDate(
                              withdrawal.lock_until
                            )
                          : "—"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {withdrawal.admin_note && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-700">
                    Admin Note
                  </p>

                  <p className="mt-1 text-sm text-amber-800">
                    {withdrawal.admin_note}
                  </p>
                </div>
              )}

              {withdrawal.reviewed_at && (
                <p className="mt-4 text-xs text-slate-400">
                  Reviewed{" "}
                  {formatDate(withdrawal.reviewed_at)}
                </p>
              )}

              {withdrawal.status?.toLowerCase() ===
                "pending" && (
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      void rejectWithdrawal(withdrawal)
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void approveWithdrawal(withdrawal)
                    }
                    className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   USERS
========================================================= */

function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [reactivatingUserId, setReactivatingUserId] = useState<string | null>(null);

const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
const [userWallet, setUserWallet] = useState<{
  balance_usd: number;
  balance_ugx: number;
  total_deposited_usd: number;
  total_invested_usd: number;
  total_returns_usd: number;
  total_withdrawn_usd: number;
} | null>(null);
const [walletLoading, setWalletLoading] = useState(false);
const [walletError, setWalletError] = useState("");


  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("profiles")
      .select(
  "id, full_name, phone, country, role, status, referral_code, created_at, updated_at"
)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("USERS ERROR:", error);
      setError(error.message);
      setUsers([]);
      setLoading(false);
      return;
    }

    const reactivateUser = async (userId: string) => {
  setReactivatingUserId(userId);

  const { error } = await supabase.rpc(
    "reactivate_dormant_account",
    { p_user_id: userId }
  );

  setReactivatingUserId(null);

  if (error) {
    alert(error.message);
    return;
  }

  await loadUsers();

  setSelectedUser((current) =>
    current?.id === userId
      ? {
          ...current,
          status: "active",
          updated_at: new Date().toISOString(),
        }
      : current
  );
};

    setUsers((data || []) as Profile[]);
    setLoading(false);
  }, []);

const reactivateUser = async (userId: string) => {
  setReactivatingUserId(userId);

  const { error } = await supabase.rpc(
    "reactivate_dormant_account",
    { p_user_id: userId }
  );

  setReactivatingUserId(null);

  if (error) {
    alert(error.message);
    return;
  }

  await loadUsers();

  setSelectedUser((current) =>
    current?.id === userId
      ? {
          ...current,
          status: "active",
          updated_at: new Date().toISOString(),
        }
      : current
  );
};


const loadUserWallet = async (user: Profile) => {
  setSelectedUser(user);
  setUserWallet(null);
  setWalletError("");
  setWalletLoading(true);

  const { data, error } = await supabase.rpc(
    "get_admin_user_wallet",
    {
      p_user_id: user.id,
    }
  );

  if (error) {
    console.error("USER WALLET ERROR:", error);
    setWalletError(error.message);
    setWalletLoading(false);
    return;
  }

  setUserWallet(data?.[0] || null);
  setWalletLoading(false);
};


  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      (user.full_name || "")
        .toLowerCase()
        .includes(value) ||
      (user.phone || "").toLowerCase().includes(value) ||
      (user.country || "").toLowerCase().includes(value) ||
      (user.role || "").toLowerCase().includes(value) ||
      (user.status || "").toLowerCase().includes(value)
    );
  });

  return (
    <div>
      <PageIntro
        eyebrow="Subscriber Management"
        title="Users"
        description="View and manage subscriber accounts."
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, country..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={() => setSearch("")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => void loadUsers()}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Loading users...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="font-bold text-red-600">
              Unable to load users
            </p>

            <p className="mt-2 break-words text-sm text-slate-500">
              {error}
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="font-bold text-slate-700">
              No users found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
              >
                
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-extrabold text-blue-700">
                      {(user.full_name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-extrabold">
                        {user.full_name || "No name"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {user.phone || "No phone"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.country || "No country"}
                      </p>

                      <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
  {user.id}
</p>

<p className="mt-1 text-xs text-slate-500">
  Referral Code:{" "}
  <span className="font-semibold text-slate-700">
    {user.referral_code || "—"}
  </span>
</p>

</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                   
<div className="flex flex-wrap items-center gap-2">
  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase text-blue-700">
    {user.role || "user"}
  </span>

  <span
    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
      user.status === "active"
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    {user.status || "unknown"}
  </span>

  <span className="text-xs text-slate-400">
    Joined {formatDate(user.created_at)}
  </span>

  <button
    type="button"
    onClick={() => void loadUserWallet(user)}
    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
  >
    View Details
  </button>
</div>

                  </div>
                </div>
              </div>
            ))}
                </div>
    )}

    {selectedUser && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                User Details
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                {selectedUser.full_name || "No name"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedUser.phone || "No phone"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setUserWallet(null);
                setWalletError("");
              }}
              className="rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-100"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Account Status
              </p>

              <p className="mt-1 font-extrabold text-slate-900">
  {selectedUser.status || "unknown"}
</p>

{selectedUser.status === "dormant" && (
  <button
    type="button"
    onClick={() => reactivateUser(selectedUser.id)}
    disabled={reactivatingUserId === selectedUser.id}
    className="mt-3 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {reactivatingUserId === selectedUser.id
      ? "Reactivating..."
      : "Reactivate Account"}
  </button>
)}
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Referral Code
              </p>

              <p className="mt-1 font-extrabold text-slate-900">
                {selectedUser.referral_code || "—"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-extrabold text-slate-900">
              Wallet Summary
            </p>

            {walletLoading ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  Loading wallet...
                </p>
              </div>
            ) : walletError ? (
              <div className="mt-3 rounded-xl bg-red-50 p-4">
                <p className="font-bold text-red-600">
                  Unable to load wallet
                </p>

                <p className="mt-1 break-words text-sm text-red-500">
                  {walletError}
                </p>
              </div>
            ) : userWallet ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-600">
                    Balance USD
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-blue-700">
                    ${Number(userWallet.balance_usd || 0).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Balance UGX
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    UGX{" "}
                    {Number(
                      userWallet.balance_ugx || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Total Deposited
                  </p>

                  <p className="mt-1 font-extrabold text-slate-900">
                    $
                    {Number(
                      userWallet.total_deposited_usd || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Total Invested
                  </p>

                  <p className="mt-1 font-extrabold text-slate-900">
                    $
                    {Number(
                      userWallet.total_invested_usd || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Total Returns
                  </p>

                  <p className="mt-1 font-extrabold text-green-700">
                    $
                    {Number(
                      userWallet.total_returns_usd || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Total Withdrawn
                  </p>

                  <p className="mt-1 font-extrabold text-slate-900">
                    $
                    {Number(
                      userWallet.total_withdrawn_usd || 0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  No wallet record found for this user.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
}



/* =========================================================
   PACKAGES
========================================================= */

function Packages() {
  const [packages, setPackages] = useState<
    {
      id: string;
      name: string;
      min_usd: number;
      max_usd: number;
      displayed_roi_percent: number;
      is_active: boolean;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPackage, setEditingPackage] = useState<{
    id: string;
    name: string;
    min_usd: string;
    max_usd: string;
    displayed_roi_percent: string;
    is_active: boolean;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("packages")
      .select(
        "id, name, min_usd, max_usd, displayed_roi_percent, is_active"
      )
      .order("min_usd", { ascending: true });

    if (error) {
      console.error("PACKAGES ERROR:", error);
      setError(error.message);
      setPackages([]);
      setLoading(false);
      return;
    }

    setPackages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  function openEdit(packageItem: (typeof packages)[number]) {
    setMessage("");

    setEditingPackage({
      id: packageItem.id,
      name: packageItem.name,
      min_usd: String(packageItem.min_usd),
      max_usd: String(packageItem.max_usd),
      displayed_roi_percent: String(
        packageItem.displayed_roi_percent
      ),
      is_active: packageItem.is_active,
    });
  }

  function closeEdit() {
    if (saving) return;

    setEditingPackage(null);
  }

  async function savePackage() {
    if (!editingPackage) return;

    setError("");
    setMessage("");

    const minUsd = Number(editingPackage.min_usd);
    const maxUsd = Number(editingPackage.max_usd);
    const roi = Number(
      editingPackage.displayed_roi_percent
    );

    if (!editingPackage.name.trim()) {
      setError("Package name is required.");
      return;
    }

    if (
      !Number.isFinite(minUsd) ||
      !Number.isFinite(maxUsd) ||
      !Number.isFinite(roi)
    ) {
      setError("Please enter valid package values.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.rpc(
      "admin_update_package",
      {
        p_package_id: editingPackage.id,
        p_name: editingPackage.name.trim(),
        p_min_usd: minUsd,
        p_max_usd: maxUsd,
        p_displayed_roi_percent: roi,
        p_is_active: editingPackage.is_active,
      }
    );

    if (error) {
      console.error("UPDATE PACKAGE ERROR:", error);
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Package updated successfully.");
    setEditingPackage(null);
    setSaving(false);

    await loadPackages();
  }

  return (
    <div>
      <PageIntro
        eyebrow="Package Management"
        title="Investment Packages"
        description="Manage the package ranges and displayed rates."
      />

      {message && (
        <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-bold text-red-600">
            Unable to process package
          </p>

          <p className="mt-1 break-words text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Loading packages...
          </p>
        </div>
      ) : packages.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="font-bold text-slate-700">
            No packages found
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((packageItem) => (
            <div
              key={packageItem.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold">
                  {packageItem.name}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    packageItem.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {packageItem.is_active
                    ? "ACTIVE"
                    : "INACTIVE"}
                </span>
              </div>

              <p className="mt-5 text-2xl font-extrabold text-blue-700">
                ${Number(packageItem.min_usd).toFixed(0)} – $
                {Number(packageItem.max_usd).toFixed(0)}
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Daily displayed rate
                </p>

                <p className="mt-1 text-xl font-extrabold">
                  {Number(
                    packageItem.displayed_roi_percent
                  )}
                  %
                </p>
              </div>

              <button
                type="button"
                onClick={() => openEdit(packageItem)}
                className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Edit Package
              </button>
            </div>
          ))}
        </div>
      )}

      {editingPackage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Package Management
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Edit Package
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Package Name
                </label>

                <input
                  type="text"
                  value={editingPackage.name}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Minimum USD
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingPackage.min_usd}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        min_usd: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Maximum USD
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingPackage.max_usd}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        max_usd: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Daily ROI %
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    editingPackage.displayed_roi_percent
                  }
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      displayed_roi_percent: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Package Status
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Allow subscribers to use this package.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={editingPackage.is_active}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      is_active: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void savePackage()}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DAILY TASKS
========================================================= */

function DailyTasks() {
  const [tasks, setTasks] = useState([
    "Account Check",
    "Daily Information",
    "Knowledge Question",
    "Account Review",
    "Transaction Check",
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    const value = newTask.trim();

    if (!value) return;

    setTasks((current) => [...current, value]);
    setNewTask("");
  };

  return (
    <div>
      <PageIntro
        eyebrow="Activity Management"
        title="Daily Tasks"
        description="Manage the daily activities displayed to subscribers."
      />

      <div className="mt-6 rounded-2xl bg-blue-600 p-5 text-white sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
          Daily Task Limit
        </p>

        <div className="mt-2">
          <p className="text-4xl font-extrabold">
            {tasks.length}
          </p>

          <p className="mt-1 text-sm text-blue-100">
            configured activities
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="Add task..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={addTask}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((task, index) => (
          <div
            key={`${task}-${index}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-extrabold text-blue-700">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-words font-extrabold">
                {task}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Active task
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setTasks((current) =>
                  current.filter((_, i) => i !== index)
                )
              }
              className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   NOTICES
========================================================= */

function Notices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotices = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("notices")
      .select(
        "id,title,message,audience,is_published,published_at,created_at,is_active"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setNotices([]);
    } else {
      setNotices(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadNotices();
  }, []);

  const addNotice = async () => {
    if (!title.trim()) {
      setError("Enter a notice title.");
      return;
    }

    if (!text.trim()) {
      setError("Enter a notice message.");
      return;
    }

    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("notices").insert({
      title: title.trim(),
      message: text.trim(),
      audience: "all",
      target_user_id: null,
      recipient_id: null,
      is_published: true,
      published_at: new Date().toISOString(),
      created_by: user.id,
      is_active: true,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setTitle("");
    setText("");
    setSaving(false);

    await loadNotices();
  };

  const deleteNotice = async (id: string) => {
  setError("");

  const { data, error } = await supabase
    .from("notices")
    .update({
      is_active: false,
    })
    .eq("id", id)
    .select("id,title,is_active");

  console.log("DEACTIVATE RESULT:", { data, error });

  if (error) {
    setError(error.message);
    return;
  }

  if (!data || data.length === 0) {
    setError("Notice was not updated. No row was returned.");
    return;
  }

  await loadNotices();
};

  return (
    <div>
      <PageIntro
        eyebrow="Communication"
        title="Subscriber Notices"
        description="Create and manage messages shown to subscribers."
      />

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-extrabold">Create Notice</h2>

        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notice title"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Notice message"
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />

          <button
            type="button"
            onClick={addNotice}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Publishing..." : "+ Publish Notice"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
            No notices found.
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${
                !notice.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold">
                      {notice.title}
                    </h2>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                      {notice.audience || "All"}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        notice.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {notice.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {notice.message}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {notice.created_at
                      ? new Date(notice.created_at).toLocaleString()
                      : ""}
                  </p>
                </div>

                {notice.is_active && (
                  <button
                    type="button"
                    onClick={() => void deleteNotice(notice.id)}
                    className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
/* =========================================================
TRANSACTIONS
========================================================= */

function Transactions() {
  type Transaction = {
    id: string;
    user_id: string;
    type: string;
    amount_usd: number;
    amount_ugx: number | null;
    reference_id: string | null;
    description: string | null;
    status: string;
    created_at: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        user_id,
        type,
        amount_usd,
        amount_ugx,
        reference_id,
        description,
        status,
        created_at,
        profiles:user_id (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("TRANSACTIONS ERROR:", error);
      setError(error.message);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const userIds = [
      ...new Set(
        (data || []).map((item) => item.user_id)
      ),
    ];

    let emailMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: authEmails, error: emailError } =
        await supabase.rpc("get_admin_user_emails", {
          p_user_ids: userIds,
        });

      if (emailError) {
        console.error("TRANSACTION EMAIL ERROR:", emailError);
      } else {
        (authEmails || []).forEach(
          (item: {
            id: string;
            email: string | null;
          }) => {
            emailMap[item.id] = item.email || "";
          }
        );
      }
    }

    const formatted = (data || []).map((item) => {
      const profile = Array.isArray(item.profiles)
        ? item.profiles[0]
        : item.profiles;

      return {
        id: item.id,
        user_id: item.user_id,
        type: item.type,
        amount_usd: Number(item.amount_usd || 0),
        amount_ugx:
          item.amount_ugx === null
            ? null
            : Number(item.amount_ugx || 0),
        reference_id: item.reference_id,
        description: item.description,
        status: item.status,
        created_at: item.created_at,
        email: emailMap[item.user_id] || null,
        full_name: profile?.full_name || null,
        phone: profile?.phone || null,
      };
    });

    setTransactions(formatted);
    setLoading(false);
  }, []);

  

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        (transaction.full_name || "")
          .toLowerCase()
          .includes(query) ||
        (transaction.email || "")
          .toLowerCase()
          .includes(query) ||
        (transaction.phone || "")
          .toLowerCase()
          .includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        (transaction.reference_id || "")
          .toLowerCase()
          .includes(query);

      const matchesType =
        typeFilter === "all" ||
        transaction.type.toLowerCase() === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status.toLowerCase() === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    }
  );

  const formatUSD = (amount: number) =>
    `$${Number(amount || 0).toFixed(2)}`;

  const formatUGX = (amount: number | null) =>
    amount === null
      ? "—"
      : `UGX ${Number(amount).toLocaleString()}`;

  return (
    <div>
      <PageIntro
        eyebrow="Financial Records"
        title="Transactions"
        description="Review platform transaction records."
      />

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          type="text"
          placeholder="Search name, email, phone, ID or reference..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="return">Returns</option>
          <option value="referral_commission">
            Referral Commission
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setStatusFilter("all");
            }}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() =>
              void loadTransactions()
            }
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
          {filteredTransactions.length} records
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
          Total:{" "}
          {formatUSD(
            filteredTransactions.reduce(
              (sum, item) =>
                sum + Number(item.amount_usd || 0),
              0
            )
          )}
        </span>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-bold text-red-600">
            Unable to load transactions
          </p>

          <p className="mt-1 break-words text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Loading transaction ledger...
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="text-3xl">▤</div>

          <h2 className="mt-3 font-extrabold text-slate-800">
            No transactions found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredTransactions.map(
            (transaction) => (
              <div
                key={transaction.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-extrabold text-blue-700">
                        $
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900">
                            {transaction.type
                              .replace(/_/g, " ")
                              .replace(
                                /\b\w/g,
                                (letter) =>
                                  letter.toUpperCase()
                              )}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                              transaction.status.toLowerCase() ===
                                "completed" ||
                              transaction.status.toLowerCase() ===
                                "approved"
                                ? "bg-green-50 text-green-700"
                                : transaction.status.toLowerCase() ===
                                  "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(
                            transaction.created_at
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-blue-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                        Subscriber
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs text-slate-400">
                            Full name
                          </p>

                          <p className="font-bold text-slate-900">
                            {transaction.full_name ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Email
                          </p>

                          <p className="break-all font-bold text-slate-900">
                            {transaction.email ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Phone
                          </p>

                          <p className="font-bold text-slate-900">
                            {transaction.phone ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[280px]">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Amount USD
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-slate-900">
                        {formatUSD(
                          transaction.amount_usd
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Amount UGX
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-slate-900">
                        {formatUGX(
                          transaction.amount_ugx
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {transaction.description && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Description
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {transaction.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-600">
                      {transaction.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-slate-400">
                      Reference ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-600">
                      {transaction.reference_id ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}