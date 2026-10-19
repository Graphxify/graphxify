/** Client-safe bot-trap contract shared by the public forms and lib/forms/bot-guard.ts. */
export const HONEYPOT_FIELD = "hp_confirm_details";
export const ELAPSED_FIELD = "form_elapsed_ms";
/** No human fills and sends a form this fast. */
export const MIN_FILL_MS = 3000;
export const STARTED_ATTR = "data-form-started";

/** Adds the honeypot value and time-on-form to a payload, read from the submitted form. */
export function withBotFields<T extends object>(form: HTMLFormElement, data: T): T & Record<string, string | number> {
  const honeypot = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? "";
  const started = Number(form.getAttribute(STARTED_ATTR)) || Date.now();
  return { ...data, [HONEYPOT_FIELD]: honeypot, [ELAPSED_FIELD]: Date.now() - started };
}
