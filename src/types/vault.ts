export interface Secret {
  id: string;
  name: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface VaultData {
  secrets: Secret[];
}

export interface StoredVaultPayload {
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

export type NewSecretInput = Omit<
  Secret,
  "id" | "createdAt" | "updatedAt"
>;
