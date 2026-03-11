import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      last_password_change: new Date().toISOString(),
      force_password_reset: false,
      force_logout_at: null
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message || "Unable to update profile flags" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
