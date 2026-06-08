# Secure Vault

A frontend-only password manager built with React, TypeScript, the Web Crypto API, and localStorage. Secrets are encrypted before storage, and the master password is never persisted.

## Setup Instructions

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Architectural Decisions

* **React + TypeScript** for a scalable and type-safe frontend.
* **Web Crypto API** for secure key derivation and AES-GCM encryption without third-party crypto libraries.
* **localStorage** used to persist only encrypted vault data.
* Application logic is separated into crypto, storage, services, and UI layers for maintainability.

## Assumptions Made

* The application is entirely client-side and does not require a backend.
* Users are responsible for remembering their master password.
* The browser supports the Web Crypto API.
* The vault automatically locks on page refresh by clearing decrypted data from memory.

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Web Crypto API
* localStorage
