"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .limit(10);

      if (error) {
        console.error(error);
        setStatus(`Connection error: ${error.message}`);
        return;
      }

      console.log("Supabase data:", data);
      setStatus(`Connected successfully. Found ${data.length} packages.`);
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">
          Supabase Connection
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          {status}
        </p>
      </div>
    </main>
  );
}