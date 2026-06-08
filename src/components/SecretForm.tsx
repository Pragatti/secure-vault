import { useState, type FormEvent } from "react";
import type { NewSecretInput } from "../types/vault";
import PasswordGenerator from "./PasswordGenerator";

interface SecretFormProps {
  isBusy: boolean;
  onSubmit: (input: NewSecretInput) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: NewSecretInput = {
  name: "",
  username: "",
  password: "",
  notes: "",
};

export default function SecretForm({ isBusy, onSubmit, onCancel }: SecretFormProps) {
  const [form, setForm] = useState<NewSecretInput>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof NewSecretInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.username.trim() || !form.password) {
      setError("Name, username, and password are required.");
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        notes: form.notes?.trim() || undefined,
      });
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save secret.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Add secret</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" id="secret-name" value={form.name} onChange={(v) => update("name", v)} />
          <Field label="Username" id="secret-username" value={form.username} onChange={(v) => update("username", v)} />

          <div>
            <label htmlFor="secret-password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="secret-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-emerald-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <PasswordGenerator onUse={(password) => update("password", password)} />

          <div>
            <label htmlFor="secret-notes" className="mb-1.5 block text-sm font-medium text-slate-300">
              Notes (optional)
            </label>
            <textarea
              id="secret-notes"
              value={form.notes ?? ""}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {isBusy ? "Saving…" : "Save secret"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
        required
      />
    </div>
  );
}
