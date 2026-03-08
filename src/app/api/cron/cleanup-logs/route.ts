import "server-only";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

const CRON_SECRET = process.env.CRON_SECRET;
const RETENTION_DAYS = 7;

/**
 * Deletes rows older than `RETENTION_DAYS` from:
 *  - audit_logs
 *  - post_versions
 *  - work_versions
 *
 * Protected by a CRON_SECRET bearer token.
 * Triggered weekly by Vercel Cron (see vercel.json).
 */
async function runCleanup(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    if (!admin) {
        logger.warn("Cleanup skipped: service role key is not configured");
        return NextResponse.json({ error: "Service role key missing" }, { status: 503 });
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
    const cutoffISO = cutoff.toISOString();

    const results: Record<string, number> = {};
    const errors: string[] = [];

    // 1. Audit logs
    const auditResult = await admin
        .from("audit_logs")
        .delete({ count: "exact" })
        .lt("created_at", cutoffISO);

    if (auditResult.error) {
        errors.push(`audit_logs: ${auditResult.error.message}`);
    } else {
        results.audit_logs = auditResult.count ?? 0;
    }

    // 2. Post versions
    const postVersionResult = await admin
        .from("post_versions")
        .delete({ count: "exact" })
        .lt("created_at", cutoffISO);

    if (postVersionResult.error) {
        errors.push(`post_versions: ${postVersionResult.error.message}`);
    } else {
        results.post_versions = postVersionResult.count ?? 0;
    }

    // 3. Work versions
    const workVersionResult = await admin
        .from("work_versions")
        .delete({ count: "exact" })
        .lt("created_at", cutoffISO);

    if (workVersionResult.error) {
        errors.push(`work_versions: ${workVersionResult.error.message}`);
    } else {
        results.work_versions = workVersionResult.count ?? 0;
    }

    if (errors.length > 0) {
        logger.error("Cleanup completed with errors", { errors, results });
        return NextResponse.json({ ok: false, results, errors, cutoff: cutoffISO }, { status: 207 });
    }

    logger.info("Cleanup complete", { results, cutoff: cutoffISO });
    return NextResponse.json({ ok: true, results, cutoff: cutoffISO });
}

export async function GET(request: Request) {
    return runCleanup(request);
}

export async function DELETE(request: Request) {
    return runCleanup(request);
}
