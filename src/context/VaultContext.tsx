import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { vaultService } from "../services/vaultService";
import type { NewSecretInput, Secret } from "../types/vault";

interface VaultContextValue {
  isLocked: boolean;
  hasVault: boolean;
  secrets: Secret[];
  isBusy: boolean;
  error: string | null;
  clearError: () => void;
  createVault: (password: string, confirmPassword: string) => Promise<void>;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  addSecret: (input: NewSecretInput) => Promise<void>;
  deleteSecret: (id: string) => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasVault = vaultService.hasVault();

  const clearError = useCallback(() => setError(null), []);

  const syncSecrets = useCallback(() => {
    setSecrets(vaultService.getSecrets());
  }, []);

  const createVault = useCallback(
    async (password: string, confirmPassword: string) => {
      if (password.length < 8) {
        throw new Error("Master password must be at least 8 characters.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      setIsBusy(true);
      setError(null);
      try {
        await vaultService.createVault(password);
        setIsLocked(false);
        syncSecrets();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create vault.";
        setError(message);
        throw err;
      } finally {
        setIsBusy(false);
      }
    },
    [syncSecrets],
  );

  const unlock = useCallback(
    async (password: string) => {
      setIsBusy(true);
      setError(null);
      try {
        await vaultService.unlock(password);
        setIsLocked(false);
        syncSecrets();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to unlock vault.";
        setError(message);
        throw err;
      } finally {
        setIsBusy(false);
      }
    },
    [syncSecrets],
  );

  const lock = useCallback(() => {
    vaultService.lock();
    setSecrets([]);
    setIsLocked(true);
    setError(null);
  }, []);

  const addSecret = useCallback(
    async (input: NewSecretInput) => {
      setIsBusy(true);
      setError(null);
      try {
        await vaultService.addSecret(input);
        syncSecrets();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add secret.";
        setError(message);
        throw err;
      } finally {
        setIsBusy(false);
      }
    },
    [syncSecrets],
  );

  const deleteSecret = useCallback(
    async (id: string) => {
      setIsBusy(true);
      setError(null);
      try {
        await vaultService.deleteSecret(id);
        syncSecrets();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete secret.";
        setError(message);
        throw err;
      } finally {
        setIsBusy(false);
      }
    },
    [syncSecrets],
  );

  const value = useMemo(
    () => ({
      isLocked,
      hasVault,
      secrets,
      isBusy,
      error,
      clearError,
      createVault,
      unlock,
      lock,
      addSecret,
      deleteSecret,
    }),
    [
      isLocked,
      hasVault,
      secrets,
      isBusy,
      error,
      clearError,
      createVault,
      unlock,
      lock,
      addSecret,
      deleteSecret,
    ],
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within VaultProvider");
  }
  return context;
}
