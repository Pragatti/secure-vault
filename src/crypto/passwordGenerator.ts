export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

export const defaultPasswordOptions: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

export function generatePassword(options: PasswordOptions): string {
  let charset = "";
  const required: string[] = [];

  if (options.uppercase) {
    charset += UPPER;
    required.push(pickRandom(UPPER));
  }
  if (options.lowercase) {
    charset += LOWER;
    required.push(pickRandom(LOWER));
  }
  if (options.numbers) {
    charset += NUMBERS;
    required.push(pickRandom(NUMBERS));
  }
  if (options.symbols) {
    charset += SYMBOLS;
    required.push(pickRandom(SYMBOLS));
  }

  if (!charset) {
    throw new Error("Select at least one character set.");
  }

  const length = Math.max(options.length, required.length);
  const bytes = crypto.getRandomValues(new Uint8Array(length - required.length));
  const chars = [...required];

  for (const byte of bytes) {
    chars.push(charset[byte % charset.length]);
  }

  return shuffle(chars).join("");
}

function pickRandom(charset: string): string {
  const index = crypto.getRandomValues(new Uint8Array(1))[0] % charset.length;
  return charset[index];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = crypto.getRandomValues(new Uint8Array(1))[0] % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
