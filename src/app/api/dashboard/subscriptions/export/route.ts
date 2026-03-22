import { NextRequest, NextResponse } from "next/server";
import { getNewsletterSubscribersForExport } from "@/db/queries/admin";
import { requireApiPermission } from "@/lib/auth/requireRole";

export const runtime = "nodejs";

function csvValue(value: string | null | undefined): string {
  const text = value ?? "";
  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, "\"\"")}"`;
}

export async function GET(request: NextRequest) {
  await requireApiPermission("leads.view");

  const search = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const status = request.nextUrl.searchParams.get("status")?.trim() ?? "";
  const rows = await getNewsletterSubscribersForExport(search, status);

  const csvRows = [
    ["email", "status", "source", "subscribed_at", "unsubscribed_at", "welcome_email_sent_at", "created_at"].join(","),
    ...rows.map((row) =>
      [
        csvValue(row.email),
        csvValue(row.status),
        csvValue(row.source),
        csvValue(row.subscribed_at),
        csvValue(row.unsubscribed_at),
        csvValue(row.welcome_email_sent_at),
        csvValue(row.created_at)
      ].join(",")
    )
  ];

  const filename = `graphxify-subscribers-${status || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(`${csvRows.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store"
    }
  });
}
