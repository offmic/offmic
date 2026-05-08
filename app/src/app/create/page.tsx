import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Create interview</h1>
      <p className="mt-4 text-sm text-neutral-500">
        Stub. Question + expiration → token + clé AES-256 (URL fragment) à venir.
      </p>
    </main>
  );
}
