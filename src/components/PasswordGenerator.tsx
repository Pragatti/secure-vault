import { useState } from "react";
import {
  defaultPasswordOptions,
  generatePassword,
  type PasswordOptions,
} from "../crypto/passwordGenerator";

interface PasswordGeneratorProps {
  onUse: (password: string) => void;
}

export default function PasswordGenerator({ onUse }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [generated, setGenerated] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    try {
      setError(null);
      setGenerated(generatePassword(options));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate password.");
    }
  };

  const toggle = (key: keyof Omit<PasswordOptions, "length">) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Password generator</h3>
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-slate-700"
        >
          Generate
        </button>
      </div>

      <label className="mb-2 block text-xs text-slate-400">
        Length: {options.length}
      </label>
      <input
        type="range"
        min={12}
        max={64}
        value={options.length}
        onChange={(e) =>
          setOptions((current) => ({ ...current, length: Number(e.target.value) }))
        }
        className="mb-3 w-full accent-emerald-500"
      />

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        {(
          [
            ["uppercase", "Uppercase"],
            ["lowercase", "Lowercase"],
            ["numbers", "Numbers"],
            ["symbols", "Symbols"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggle(key)}
              className="accent-emerald-500"
            />
            {label}
          </label>
        ))}
      </div>

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      {generated && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
          <code className="flex-1 break-all text-sm text-emerald-300">{generated}</code>
          <button
            type="button"
            onClick={() => onUse(generated)}
            className="shrink-0 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30"
          >
            Use
          </button>
        </div>
      )}
    </div>
  );
}
