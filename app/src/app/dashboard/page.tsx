import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-xs text-neutral-500">{user.email}</p>
      <p className="mt-4 text-sm text-neutral-500">
        Stub. Liste interviews + déchiffrement + Whisper WASM + export PDF signé à venir.
      </p>
    </main>
  );
}
