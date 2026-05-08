type Props = { params: Promise<{ token: string }> };

export default async function SourcePage({ params }: Props) {
  const { token } = await params;
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Interview</h1>
      <p className="mt-2 text-xs text-neutral-500">token: {token}</p>
      <p className="mt-4 text-sm text-neutral-500">
        Stub. Question + recorder + chiffrement client + upload à venir.
      </p>
    </main>
  );
}
