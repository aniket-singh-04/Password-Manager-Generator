const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const NUMBERS = '23456789';
const SPECIAL = '!@#$%^&*()-_=+[]{};:,.?';

export function generatePassword(options) {
  const pools = [];
  if (options.uppercase) pools.push(UPPER);
  if (options.lowercase) pools.push(LOWER);
  if (options.numbers) pools.push(NUMBERS);
  if (options.special) pools.push(SPECIAL);

  const pool = pools.join('');
  if (!pool) return '';

  const bytes = new Uint32Array(options.length);
  crypto.getRandomValues(bytes);

  const required = pools.map((set, index) => set[bytes[index] % set.length]);
  const rest = Array.from(bytes)
    .slice(required.length)
    .map((value) => pool[value % pool.length]);

  return [...required, ...rest]
    .sort(() => crypto.getRandomValues(new Uint32Array(1))[0] - 2147483648)
    .join('')
    .slice(0, options.length);
}

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Weak', color: 'bg-red-300', value: 35 };
  if (score <= 4) return { label: 'Good', color: 'bg-amber-500', value: 70 };
  return { label: 'Strong', color: 'bg-green-800', value: 100 };
}

