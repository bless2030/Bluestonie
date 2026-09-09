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

const menuItems = [
  "Overview",
  "Deposits",
  "Withdrawals",
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

  const [toast, setToast] = useState<Toast | null>(null);
  const [search, setSearch] = useState("");

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
    }

    void verifyAdministrator();

    return () => {
      cancelled = true;
    };
  }, [loadDeposits, router]);

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
              pendingDeposits={pendingDeposits.length}
              totalVerified={totalVerified}
              onDeposits={() => setActiveSection("Deposits")}
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
   OVERVIEW
========================================================= */

function Overview({
  deposits,
  pendingDeposits,
  totalVerified,
  onDeposits,
}: {
  deposits: Deposit[];
  pendingDeposits: number;
  totalVerified: number;
  onDeposits: () => void;
}) {
  return (
    <div>
      <PageIntro
        eyebrow="Overview"
        title="Platform Overview"
        description="Monitor the main activity of the BLUESTONIE platform."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat
          title="Deposit Requests"
          value={String(deposits.length)}
          icon="↓"
          detail="Total submitted"
        />

        <AdminStat
          title="Pending Deposits"
          value={String(pendingDeposits)}
          icon="!"
          detail="Need review"
        />

        <AdminStat
          title="Verified Deposits"
          value={`$${totalVerified.toFixed(2)}`}
          icon="✓"
          detail="Verified amount"
        />

        <AdminStat
          title="System"
          value="Online"
          icon="●"
          detail="Supabase connected"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold">Recent Deposits</h2>

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
                  <p className="truncate text-sm font-bold">
                    {deposit.reference || "Deposit"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(deposit.submitted_at)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-extrabold">
                    ${Number(deposit.amount_usd || 0).toFixed(2)}
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

        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
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

            <Rule label="Capital lock" value="2 months" />

            <Rule label="Minimum investment" value="$10" />

            <Rule label="Maximum investment" value="$500" />
          </div>
        </div>
      </div>

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
                    <p className="break-all font-extrabold">
                      {deposit.reference || "No reference"}
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-400">
                      {deposit.id}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-400">
                      User: {deposit.user_id}
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, phone, country, role, status, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("USERS ERROR:", error);
      setError(error.message);
      setUsers([]);
      setLoading(false);
      return;
    }

    setUsers((data || []) as Profile[]);
    setLoading(false);
  }, []);

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
                    </div>
                  </div>

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
                  </div>
                </div>
              </div>
            ))}
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
  const packages = [
    ["Basic", "$10 – $50", "2%"],
    ["Standard", "$51 – $150", "2.5%"],
    ["Premium", "$151 – $300", "3%"],
    ["VVIP", "$301 – $500", "3.5%"],
  ];

  return (
    <div>
      <PageIntro
        eyebrow="Package Management"
        title="Investment Packages"
        description="Manage the package ranges and displayed rates."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {packages.map(([name, range, rate]) => (
          <div
            key={name}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-extrabold">
                {name}
              </h2>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                ACTIVE
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-blue-700">
              {range}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Daily displayed rate
              </p>

              <p className="mt-1 text-xl font-extrabold">
                {rate}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                window.alert(
                  `${name} package editing will be connected to the packages table next.`
                )
              }
              className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold hover:bg-slate-50"
            >
              Edit Package
            </button>
          </div>
        ))}
      </div>
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
  const [notices, setNotices] = useState([
    {
      title: "Welcome to BLUESTONIE",
      type: "General",
      text: "Welcome message shown to subscribers.",
    },
    {
      title: "Daily Activities",
      type: "Important",
      text: "Reminder about completing available daily activities.",
    },
    {
      title: "Withdrawal Information",
      type: "Wallet",
      text: "Information regarding withdrawal requests.",
    },
  ]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const addNotice = () => {
    if (!title.trim() || !text.trim()) return;

    setNotices((current) => [
      {
        title: title.trim(),
        type: "General",
        text: text.trim(),
      },
      ...current,
    ]);

    setTitle("");
    setText("");
  };

  return (
    <div>
      <PageIntro
        eyebrow="Communication"
        title="Subscriber Notices"
        description="Create and manage messages shown to subscribers."
      />

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
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            + Publish Notice
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {notices.map((notice, index) => (
          <div
            key={`${notice.title}-${index}`}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold">
                    {notice.title}
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {notice.type}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {notice.text}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotices((current) =>
                    current.filter((_, i) => i !== index)
                  )
                }
                className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   TRANSACTIONS
========================================================= */

function Transactions() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <PageIntro
        eyebrow="Financial Records"
        title="Transactions"
        description="Review platform transaction records."
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search transaction reference..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={() => setSearch("")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="text-3xl">▤</div>

        <h2 className="mt-3 font-extrabold">
          Transaction Ledger
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          The transaction interface is ready for connection
          to your exact transactions table schema.
        </p>

        {search && (
          <p className="mt-3 break-all text-xs font-bold text-blue-600">
            Filter: {search}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

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

      <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
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
}: {
  title: string;
  value: string;
  icon: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500 sm:text-sm">
          {title}
        </p>

        <span className="text-lg">{icon}</span>
      </div>

      <p className="mt-3 break-words text-2xl font-extrabold sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {detail}
      </p>
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
      <p className="text-xs text-slate-500">{title}</p>

      <p className="mt-2 text-xl font-extrabold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string | null;
}) {
  const normalized = (status || "").toLowerCase();

  let style = "bg-slate-100 text-slate-600";

  if (
    normalized === "active" ||
    normalized === "verified" ||
    normalized === "completed" ||
    normalized === "approved"
  ) {
    style = "bg-green-50 text-green-700";
  }

  if (normalized === "pending") {
    style = "bg-amber-50 text-amber-700";
  }

  if (
    normalized === "rejected" ||
    normalized === "failed"
  ) {
    style = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${style}`}
    >
      {status || "unknown"}
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
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 last:border-0">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-right text-xs font-bold text-white">
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
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

function MenuIcon({ item }: { item: string }) {
  const icons: Record<string, string> = {
    Overview: "▦",
    Deposits: "↓",
    Withdrawals: "↑",
    Users: "♙",
    Packages: "◇",
    "Daily Tasks": "✓",
    Notices: "●",
    Transactions: "▤",
  };

  return (
    <span className="flex h-6 w-6 items-center justify-center text-sm">
      {icons[item] || "•"}
    </span>
  );
}

function getStatusStyle(status: string | null) {
  switch (status?.toLowerCase()) {
    case "approved":
    case "completed":
      return "bg-green-50 text-green-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "rejected":
    case "failed":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusLabel(status: string | null) {
  if (!status) return "Pending";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}