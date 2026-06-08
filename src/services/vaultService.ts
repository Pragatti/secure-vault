import {
  decryptString,
  deriveEncryptionKey,
  encryptString,
  generateSalt,
  packEncryptedPayload,
  unpackEncryptedPayload,
} from "../crypto/vaultCrypto";
import {
  loadEncryptedVault,
  saveEncryptedVault,
  vaultExists,
} from "../storage/vaultStorage";
import type { NewSecretInput, Secret, VaultData } from "../types/vault";

interface UnlockedSession {
  key: CryptoKey;
  salt: Uint8Array;
  vault: VaultData;
}

export class VaultService {
  private session: UnlockedSession | null = null;

  hasVault(): boolean {
    return vaultExists();
  }

  isUnlocked(): boolean {
    return this.session !== null;
  }

  getSecrets(): Secret[] {
    return this.session?.vault.secrets ?? [];
  }

  async createVault(masterPassword: string): Promise<void> {
    if (vaultExists()) {
      throw new Error("A vault already exists on this device.");
    }

    const salt = generateSalt();
    const key = await deriveEncryptionKey(masterPassword, salt);
    const vault: VaultData = { secrets: [] };
    await this.persistVault(vault, key, salt);
    this.session = { key, salt, vault };
  }

  async unlock(masterPassword: string): Promise<void> {
    const stored = loadEncryptedVault();
    if (!stored) {
      throw new Error("No vault found. Create one first.");
    }

    const { salt, iv, ciphertext } = unpackEncryptedPayload(stored);
    const key = await deriveEncryptionKey(masterPassword, salt);

    let plaintext: string;
    try {
      plaintext = await decryptString(ciphertext, iv, key);
    } catch {
      throw new Error("Incorrect master password.");
    }

    const vault = JSON.parse(plaintext) as VaultData;
    if (!Array.isArray(vault.secrets)) {
      throw new Error("Decrypted vault data is invalid.");
    }

    this.session = { key, salt, vault };
  }

  lock(): void {
    this.session = null;
  }

  async addSecret(input: NewSecretInput): Promise<Secret> {
    const session = this.requireSession();
    const now = Date.now();
    const secret: Secret = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    session.vault.secrets.unshift(secret);
    await this.persistVault(session.vault, session.key, session.salt);
    return secret;
  }

  async deleteSecret(id: string): Promise<void> {
    const session = this.requireSession();
    const nextSecrets = session.vault.secrets.filter((secret) => secret.id !== id);
    if (nextSecrets.length === session.vault.secrets.length) {
      throw new Error("Secret not found.");
    }

    session.vault.secrets = nextSecrets;
    await this.persistVault(session.vault, session.key, session.salt);
  }

  private requireSession(): UnlockedSession {
    if (!this.session) {
      throw new Error("Vault is locked.");
    }
    return this.session;
  }

  private async persistVault(
    vault: VaultData,
    key: CryptoKey,
    salt: Uint8Array,
  ): Promise<void> {
    const plaintext = JSON.stringify(vault);
    const { iv, ciphertext } = await encryptString(plaintext, key);
    saveEncryptedVault(packEncryptedPayload(salt, iv, ciphertext));
  }
}

export const vaultService = new VaultService();
