# Secure Vault

A frontend-only secure vault application (password-manager style) built with **React**, the **Web Crypto API**, and **localStorage**. No backend, no third-party crypto libraries, and no plaintext secret storage.

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Features

- **Encrypted vault** — secrets are encrypted before persistence
- **Master password unlock** — vault starts locked; auto-locks on refresh
- **Secret management** — create, view, and delete secrets (name, username, password, optional notes)
- **Password generator** — configurable length and character sets
- **Clipboard copy** — copy username/password with auto-clear after 30 seconds
- **Search** — filter decrypted secrets in memory only

## Architectural decisions

### Separation of concerns

| Layer | Responsibility |
| --- | --- |
| `src/crypto/` | Key derivation, AES-GCM encrypt/decrypt, password generation |
| `src/storage/` | Read/write encrypted blob to `localStorage` only |
| `src/services/vaultService.ts` | Vault lifecycle, in-memory session, business rules |
| `src/context/VaultContext.tsx` | React state and UI orchestration |
| `src/components/` | Presentation only |

### Encryption design

1. **Key derivation** — `PBKDF2` with SHA-256, **310,000 iterations** (OWASP-aligned), random 16-byte salt
2. **Encryption** — `AES-256-GCM` with a fresh 12-byte IV per save
3. **Storage format** — only `{ version, salt, iv, ciphertext }` is written to `localStorage`
4. **In-memory only** — decrypted vault JSON and `CryptoKey` exist only while unlocked

### Security assumptions & limits

- This is a **client-side demo**. Anyone with device access and the master password can decrypt the vault.
- `localStorage` is not protected from XSS; production apps should add CSP, input sanitization, and additional hardening.
- The master password is **never** stored. Losing it means the vault cannot be recovered.
- Clipboard auto-clear is best-effort (browser permissions may block read/clear).
- Page refresh clears the in-memory session by design (auto-lock).

### What is never persisted

- Master password
- Derived encryption key (`CryptoKey`)
- Plaintext secrets
- Decrypted vault JSON

## Project structure

```
src/
├── crypto/          # Web Crypto helpers
├── storage/         # localStorage adapter
├── services/        # Vault domain logic
├── context/         # React provider
├── hooks/           # Clipboard helper
├── components/      # UI
└── types/           # Shared TypeScript types
```

## Usage flow

1. **First visit** — create a master password (min. 8 characters)
2. **Unlock** — enter master password to decrypt vault in memory
3. **Add secrets** — data is re-encrypted on every change
4. **Lock** — click “Lock vault” or refresh the page

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Browser Web Crypto API
- localStorage


