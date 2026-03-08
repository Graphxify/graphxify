/**
 * Shared error‑message extraction for API routes.
 *
 * Handles Zod validation issues, Supabase / PostgREST errors
 * (including missing‑table diagnostics), and generic Error objects.
 */

function isMissingTestimonialsSchema(code?: string, message?: string): boolean {
    const normalizedMessage = (message || "").toLowerCase();
    return (
        ["42P01", "42703", "PGRST116", "PGRST204", "PGRST205"].includes(code || "") ||
        normalizedMessage.includes("could not find the table 'public.testimonials'") ||
        normalizedMessage.includes("schema cache")
    );
}

export function errorMessage(error: unknown, fallback: string): string {
    // Zod validation issues
    if (error && typeof error === "object" && "issues" in error) {
        const issues = (error as { issues?: Array<{ path?: Array<string | number>; message?: string }> }).issues;
        if (Array.isArray(issues) && issues.length > 0) {
            return issues
                .map((issue) => {
                    const key = issue.path?.join(".") || "field";
                    return `${key}: ${issue.message || "Invalid value"}`;
                })
                .join("; ");
        }
    }

    // Supabase / PostgREST structured errors
    if (error && typeof error === "object") {
        const raw = error as {
            code?: string;
            message?: unknown;
            details?: unknown;
            hint?: unknown;
        };

        const rawMessage = typeof raw.message === "string" ? raw.message : "";
        if (isMissingTestimonialsSchema(raw.code, rawMessage)) {
            return "Testimonials table is missing in Supabase schema cache. Run supabase/testimonials.sql, then run: notify pgrst, 'reload schema';";
        }

        if (typeof raw.message === "string" && raw.message.trim()) {
            return raw.message;
        }

        if (typeof raw.code === "string") {
            if (raw.code === "42501") {
                return "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
            }
        }

        const details = typeof raw.details === "string" ? raw.details.trim() : "";
        const hint = typeof raw.hint === "string" ? raw.hint.trim() : "";
        if (details || hint) {
            return [details, hint].filter(Boolean).join(" ");
        }
    }

    if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code?: string }).code;
        if (code === "42501") {
            return "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
