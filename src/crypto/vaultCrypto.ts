import { fromBase64, toBase64 } from "./encoding";

const PBKDF2_ITERATIONS = 310_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export async function deriveEncryptionKey(
  masterPassword: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_BYTES));
}

export async function encryptString(
  plaintext: string,
  key: CryptoKey,
): Promise<{ iv: Uint8Array; ciphertext: ArrayBuffer }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    textEncoder.encode(plaintext),
  );
  return { iv, ciphertext };
}

export async function decryptString(
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey,
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    ciphertext,
  );
  return textDecoder.decode(decrypted);
}

export function packEncryptedPayload(
  salt: Uint8Array,
  iv: Uint8Array,
  ciphertext: ArrayBuffer,
) {
  return {
    version: 1 as const,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  };
}

export function unpackEncryptedPayload(payload: {
  salt: string;
  iv: string;
  ciphertext: string;
}) {
  return {
    salt: fromBase64(payload.salt),
    iv: fromBase64(payload.iv),
    ciphertext: fromBase64(payload.ciphertext).buffer as ArrayBuffer,
  };
}
