import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

type NewsletterInput = {
  email: string;
  source?: string;
};

function getWriteClient() {
  return createAdminClient() ?? createClient();
}

export async function subscribeToNewsletter(input: NewsletterInput): Promise<{ alreadySubscribed: boolean }> {
  const client = getWriteClient();
  const email = input.email.trim().toLowerCase();

  const { error } = await client.from("newsletter_subscribers").insert({
    email,
    source: input.source ?? "blog",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (!error) {
    return { alreadySubscribed: false };
  }

  if (error.code === "23505") {
    return { alreadySubscribed: true };
  }

  logger.error("Newsletter subscription failed", {
    route: "newsletter.subscribe",
    error: error.message,
    code: error.code ?? null
  });
  throw error;
}
