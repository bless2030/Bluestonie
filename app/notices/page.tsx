"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/lib/types";

export default function NoticesPage() {
  const router = useRouter();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
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

    /*
      Show:
      1. General notices where recipient_id is NULL
      2. Personal notices where recipient_id = current user
    */

    const { data, error: noticeError } = await supabase
      .from("notices")
      .select("*")
      .or(`recipient_id.is.null,recipient_id.eq.${user.id}`)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (noticeError) {
      setError(noticeError.message);
      setLoading(false);
      return;
    }

    setNotices((data || []) as Notice[]);
    setLoading(false);
    }

    void loadNotices();
  }, [router]);

  function formatDate(date: string | null) {
    if (!date) return "";

    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading notices...
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
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-blue-600"
          >
            ← Dashboard
          </button>

          <h1 className="text-lg font-extrabold text-slate-900">
            Notices
          </h1>

          <div className="w-20" />

        </div>
      </header>


      <div className="mx-auto max-w-3xl px-4 py-6">

        {/* Page heading */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Information & Notices
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Important information and communication from the administration.
          </p>
        </section>


        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Empty state */}
        {notices.length === 0 ? (

          <section className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
              🔔
            </div>

            <h3 className="mt-4 font-extrabold text-slate-800">
              No notices yet
            </h3>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              Important announcements and messages will appear here.
            </p>

          </section>

        ) : (

          <section className="mt-6 space-y-4">

            {notices.map((notice) => (

              <article
                key={notice.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl">
                    🔔
                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-2">

                      <h3 className="font-extrabold text-slate-900">
                        {notice.title || "Notice"}
                      </h3>

                      {notice.recipient_id && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          Personal
                        </span>
                      )}

                    </div>


                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {notice.message}
                    </p>


                    <p className="mt-4 text-xs text-slate-400">
                      {formatDate(notice.created_at)}
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
