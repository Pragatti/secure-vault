import { useState, type FormEvent } from "react";
import { useVault } from "../context/VaultContext";

export default function UnlockScreen() {
  const { hasVault, isBusy, error, clearError, createVault, unlock } = useVault();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSetup = !hasVault;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();

    try {
      if (isSetup) {
        await createVault(password, confirmPassword);
      } else {
        await unlock(password);
      }
      setPassword("");
      setConfirmPassword("");
    } catch {
      /* Error surfaced via context */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-white">Secure Vault</h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSetup
              ? "Create your master password to initialize an encrypted vault."
              : "Enter your master password to unlock secrets in memory."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="master-password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Master password
            </label>
            <div className="relative">
              <input
                id="master-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-24 text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                placeholder={isSetup ? "At least 8 characters" : "Your master password"}
                autoComplete={isSetup ? "new-password" : "current-password"}
                required
                minLength={isSetup ? 8 : 1}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-emerald-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {isSetup && (
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                placeholder="Repeat master password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Please wait…" : isSetup ? "Create Vault" : "Unlock Vault"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
          Secrets are encrypted with AES-256-GCM. Your master password and encryption key are never stored.
          The vault locks automatically on page refresh.
        </p>
      </div>
    </div>
  );
}
