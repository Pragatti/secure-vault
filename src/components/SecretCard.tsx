import { useState, type ReactNode } from "react";
import { useClipboard } from "../hooks/useClipboard";
import type { Secret } from "../types/vault";

interface SecretCardProps {
  secret: Secret;
  onDelete: (id: string) => Promise<void>;
  isBusy: boolean;
}

export default function SecretCard({ secret, onDelete, isBusy }: SecretCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { copiedField, copy } = useClipboard();

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete(secret.id);
  };

  return (
    <article className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 transition hover:border-emerald-500/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{secret.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{secret.username}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
        >
          {expanded ? "Hide" : "View"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
          <DetailRow
            label="Username"
            value={secret.username}
            fieldId={`${secret.id}-username`}
            copiedField={copiedField}
            onCopy={copy}
          />
          <DetailRow
            label="Password"
            value={secret.password}
            fieldId={`${secret.id}-password`}
            copiedField={copiedField}
            onCopy={copy}
            masked={!showPassword}
            action={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-xs text-slate-400 hover:text-emerald-300"
              >
                {showPassword ? "Hide" : "Reveal"}
              </button>
            }
          />
          {secret.notes && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Notes</p>
              <p className="rounded-lg bg-slate-950/70 px-3 py-2 text-sm text-slate-300">{secret.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={handleDelete}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                confirmDelete
                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "border border-slate-700 text-slate-400 hover:border-red-500/40 hover:text-red-300"
              }`}
            >
              {confirmDelete ? "Confirm delete" : "Delete"}
            </button>
            {confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function DetailRow({
  label,
  value,
  fieldId,
  copiedField,
  onCopy,
  masked = false,
  action,
}: {
  label: string;
  value: string;
  fieldId: string;
  copiedField: string | null;
  onCopy: (value: string, fieldId: string) => Promise<void>;
  masked?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-slate-950/70 px-3 py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {action}
      </div>
      <div className="flex items-center justify-between gap-3">
        <code className="break-all text-sm text-slate-200">
          {masked ? "•".repeat(Math.min(value.length, 16)) : value}
        </code>
        <button
          type="button"
          onClick={() => onCopy(value, fieldId)}
          className="shrink-0 rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-emerald-300 hover:bg-slate-700"
        >
          {copiedField === fieldId ? "Copied" : "Copy"}
        </button>
      </div>
      {copiedField === fieldId && (
        <p className="mt-1 text-[11px] text-slate-500">Clipboard clears automatically in 30s</p>
      )}
    </div>
  );
}
