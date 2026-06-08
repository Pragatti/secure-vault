import { useMemo, useState } from "react";
import { useVault } from "../context/VaultContext";
import SecretCard from "./SecretCard";
import SecretForm from "./SecretForm";

export default function VaultDashboard() {
  const { secrets, isBusy, error, lock, addSecret, deleteSecret } = useVault();
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const filteredSecrets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return secrets;

    return secrets.filter((secret) => {
      const haystack = [
        secret.name,
        secret.username,
        secret.password,
        secret.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, secrets]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Secure Vault</h1>
            <p className="text-sm text-slate-400">
              {secrets.length} secret{secrets.length === 1 ? "" : "s"} · decrypted in memory only
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              + Add secret
            </button>
            <button
              type="button"
              onClick={lock}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Lock vault
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search secrets
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decrypted secrets…"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          />
          <p className="mt-2 text-xs text-slate-500">
            Search runs only on in-memory decrypted data and never writes plaintext to storage.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {filteredSecrets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-300">
              {secrets.length === 0 ? "No secrets yet" : "No matching secrets"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {secrets.length === 0
                ? "Add your first encrypted secret to get started."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSecrets.map((secret) => (
              <SecretCard
                key={secret.id}
                secret={secret}
                onDelete={deleteSecret}
                isBusy={isBusy}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <SecretForm
          isBusy={isBusy}
          onCancel={() => setShowForm(false)}
          onSubmit={async (input) => {
            await addSecret(input);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
