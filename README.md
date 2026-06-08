# Secure Vault

Secure Vault is a frontend-only password manager built with React, TypeScript, the Web Crypto API, and localStorage.

The goal of this project is to securely store sensitive information in the browser without relying on a backend service or third-party cryptography libraries. All secrets are encrypted before being stored, and the master password is never saved.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

## Features

* Create and unlock a vault using a master password
* Store secrets such as usernames, passwords, and notes
* Encrypt all data before saving it to localStorage
* Generate strong passwords with customizable options
* Search through saved secrets
* Copy usernames and passwords to the clipboard
* Automatically lock the vault when the page is refreshed

## Project Structure

```text
src/
├── crypto/          # Encryption and password generation helpers
├── storage/         # localStorage utilities
├── services/        # Vault-related business logic
├── context/         # React context and state management
├── hooks/           # Custom hooks
├── components/      # UI components
└── types/           # Shared TypeScript types
```

## How It Works

When a user creates a master password, a secure encryption key is derived using PBKDF2 with SHA-256 and a randomly generated salt.

Whenever secrets are added or updated:

1. The vault data is encrypted using AES-256-GCM.
2. Only the encrypted data, salt, and IV are stored in localStorage.
3. The decrypted data remains in memory only while the vault is unlocked.

The following information is never persisted:

* Master password
* Derived encryption key
* Plaintext secrets
* Decrypted vault data

## Security Notes

This project is designed as a frontend-only demo and learning exercise.

A few important limitations:

* localStorage is not protected against XSS attacks.
* If the master password is forgotten, the stored data cannot be recovered.
* Anyone with access to the device and the correct master password can unlock the vault.
* Clipboard clearing depends on browser permissions and may not work in every environment.

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* Web Crypto API
* localStorage

## Future Improvements

Given more time, I would add:

* Edit existing secrets
* Export/import encrypted vault backups
* Password strength indicators
* Session timeout controls
* Additional security hardening

## Author

Pragatti Harchand
