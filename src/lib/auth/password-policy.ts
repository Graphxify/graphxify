export type PasswordPolicy = {
  requireStrongPasswords: boolean;
};

export const STRONG_PASSWORD_HINT =
  "Minimum 8 characters with at least one uppercase letter, one lowercase letter, and one number.";

export function validatePasswordAgainstPolicy(
  password: string,
  policy: PasswordPolicy
): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!policy.requireStrongPasswords) {
    return null;
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }

  return null;
}
