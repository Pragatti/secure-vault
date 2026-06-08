import type { StoredVaultPayload } from "../types/vault";

const STORAGE_KEY = "secure-vault-encrypted";

export function vaultExists(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function loadEncryptedVault(): StoredVaultPayload | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredVaultPayload;
    if (
      parsed.version !== 1 ||
      typeof parsed.salt !== "string" ||
      typeof parsed.iv !== "string" ||
      typeof parsed.ciphertext !== "string"
    ) {
      throw new Error("Invalid vault format.");
    }
    return parsed;
  } catch {
    throw new Error("Vault data is corrupted or unreadable.");
  }
}

export function saveEncryptedVault(payload: StoredVaultPayload): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearEncryptedVault(): void {
  localStorage.removeItem(STORAGE_KEY);
}
