"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  description: string | null;
  task_type: string | null;
  task_date: string;
  is_active: boolean;
  sort_order: number | null;
  display_order: number | null;
};

type Completion = {
  task_id: string;
};

type TaskResult = {
  success?: boolean;
  message?: string;
  daily_return_earned?: boolean;
  return_usd?: number | string | null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [returnEarned, setReturnEarned] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.href = "/login";
      return;
    }

    // Uganda date
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Kampala",
    }).format(new Date());

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select(
        "id, title, description, task_type, task_date, is_active, sort_order, display_order"
      )
      .eq("task_date", today)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("sort_order", { ascending: true });

    if (taskError) {
      console.error("TASK LOAD ERROR:", taskError);
      setError(taskError.message);
      setLoading(false);
      return;
    }

    const {
      data: completionData,
      error: completionError,
    } = await supabase
      .from("task_completions")
      .select("task_id")
      .eq("user_id", user.id)
      .eq("completed_on", today);

    if (completionError) {
      console.error("COMPLETION LOAD ERROR:", completionError);
      setError(completionError.message);
      setLoading(false);
      return;
    }

    setTasks((taskData || []) as Task[]);
    setCompleted((completionData || []) as Completion[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  function isCompleted(taskId: string) {
    return completed.some((item) => item.task_id === taskId);
  }

  async function completeTask(taskId: string) {
    if (completing) return;

    setCompleting(taskId);
    setMessage("");
    setError("");
    setReturnEarned(null);

    const { data, error: rpcError } = await supabase.rpc(
      "complete_daily_task",
      {
        p_task_id: taskId,
      }
    );

    console.log("TASK RPC RESULT:", data);
    console.log("TASK RPC ERROR:", rpcError);

    if (rpcError) {
      setError(rpcError.message);
      setCompleting(null);
      return;
    }

    const result = data as TaskResult | null;

    if (!result?.success) {
      setError(result?.message || "Unable to complete task.");
      setCompleting(null);
      return;
    }

    setMessage(result.message || "Task completed successfully.");

    if (result.daily_return_earned) {
      setReturnEarned(Number(result.return_usd || 0));
    }

    setCompleting(null);

    await loadTasks();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading today's activities...
          </p>
        </div>
      </main>
    );
  }

  const completedCount = completed.filter((item) =>
    tasks.some((task) => task.id === item.task_id)
  ).length;

  const progress =
    tasks.length > 0
      ? (completedCount / tasks.length) * 100
      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Daily Activities
            </p>

            <h1 className="text-xl font-extrabold text-blue-700">
              Today's Tasks
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Summary */}
        <section className="rounded-2xl bg-blue-600 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold text-blue-100">
            TODAY'S PROGRESS
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-extrabold">
                {completedCount}/{tasks.length}
              </p>

              <p className="mt-1 text-sm text-blue-100">
                activities completed
              </p>
            </div>

            {tasks.length > 0 &&
              completedCount === tasks.length && (
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                  ✓ Complete
                </span>
              )}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

        {/* Return earned */}
        {returnEarned !== null && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              Today's return earned
            </p>

            <p className="mt-1 text-2xl font-extrabold text-green-700">
              ${returnEarned.toFixed(2)}
            </p>

            <p className="mt-1 text-xs text-green-600">
              Your daily return has been credited to your account.
            </p>
          </div>
        )}

        {/* Success message */}
        {message && returnEarned === null && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tasks */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              Complete Today's Activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete all today's activities to qualify for today's return.
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
              <p className="font-bold text-slate-700">
                No activities available today.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please check again later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const done = isCompleted(task.id);
                const busy = completing === task.id;

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${
                      done
                        ? "ring-green-200"
                        : "ring-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Number */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                          done
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {done ? "✓" : index + 1}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-slate-900">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {task.description}
                          </p>
                        )}

                        {task.task_type && (
                          <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                            {task.task_type}
                          </span>
                        )}
                      </div>

                      {/* Complete button */}
                      <button
                        type="button"
                        disabled={done || busy}
                        onClick={() => {
                          void completeTask(task.id);
                        }}
                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${
                          done
                            ? "cursor-default bg-green-50 text-green-700"
                            : busy
                            ? "cursor-wait bg-blue-400 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {busy
                          ? "..."
                          : done
                          ? "Done"
                          : "Complete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Important notice */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-800">
            Important
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            Today's activities must be completed today. Missed activities
            cannot be carried forward or completed on another day, and the
            corresponding daily return is forfeited.
          </p>
        </div>
      </div>
    </main>
  );
}