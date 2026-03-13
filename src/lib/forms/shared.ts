import { z } from "zod";

export type FormFieldErrors = Record<string, string>;

export type FormResponse<T = unknown> = {
  success: boolean;
  message: string;
  fieldErrors?: FormFieldErrors;
  data?: T;
};

export function fieldErrorsFromZod(error: z.ZodError): FormFieldErrors {
  const flattened = error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(flattened)
      .map(([key, messages]) => [key, messages?.find(Boolean) ?? "Invalid value."])
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

export function formSuccess<T>(message: string, data?: T): FormResponse<T> {
  return data === undefined
    ? { success: true, message }
    : { success: true, message, data };
}

export function formError<T = unknown>(message: string, fieldErrors?: FormFieldErrors): FormResponse<T> {
  return fieldErrors && Object.keys(fieldErrors).length > 0
    ? { success: false, message, fieldErrors }
    : { success: false, message };
}

export function normalizeFormResponse<T = unknown>(payload: unknown, fallbackMessage: string): FormResponse<T> {
  if (!payload || typeof payload !== "object") {
    return formError(fallbackMessage);
  }

  const raw = payload as {
    success?: unknown;
    message?: unknown;
    fieldErrors?: unknown;
    data?: unknown;
  };

  const success = raw.success === true;
  const message = typeof raw.message === "string" && raw.message.trim()
    ? raw.message
    : fallbackMessage;

  const fieldErrors =
    raw.fieldErrors && typeof raw.fieldErrors === "object" && !Array.isArray(raw.fieldErrors)
      ? Object.fromEntries(
        Object.entries(raw.fieldErrors as Record<string, unknown>)
          .filter(([, value]) => typeof value === "string" && value.trim())
          .map(([key, value]) => [key, String(value)])
      )
      : undefined;

  return raw.data === undefined
    ? { success, message, fieldErrors }
    : { success, message, fieldErrors, data: raw.data as T };
}

export async function submitJsonForm<T = unknown>(
  url: string,
  body: unknown,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  timeoutMs = 15000
): Promise<FormResponse<T>> {
  return submitFormRequest<T>(
    url,
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    },
    timeoutMs
  );
}

export async function submitFormDataRequest<T = unknown>(
  url: string,
  body: FormData,
  method = "POST",
  timeoutMs = 20000
): Promise<FormResponse<T>> {
  return submitFormRequest<T>(
    url,
    {
      method,
      body,
      credentials: "include",
      cache: "no-store"
    },
    timeoutMs
  );
}

async function submitFormRequest<T = unknown>(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<FormResponse<T>> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });

    const payload = await response.json().catch(() => null);
    const normalized = normalizeFormResponse<T>(
      payload,
      response.ok ? "Request completed successfully." : "Unable to process your request."
    );

    return {
      ...normalized,
      success: response.ok && normalized.success
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return formError("The request took too long. Please try again.");
    }

    return formError("We couldn't reach the server. Please check your connection and try again.");
  } finally {
    window.clearTimeout(timeout);
  }
}
