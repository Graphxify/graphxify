import Link from "next/link";
import { MailCheck, MailX, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function NewsletterUnsubscribePage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const token = getString(resolvedSearchParams.token).trim();
  const status = getString(resolvedSearchParams.status).trim();

  const isSuccess = status === "success";
  const isAlready = status === "already";
  const isError = status === "error";
  const isConfirm = Boolean(token) && !status;

  return (
    <main className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl section-shell border-border/18 bg-card/78 p-8 md:p-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg/56">
          <span className="h-2 w-2 rounded-full bg-accentA" />
          Newsletter
        </div>

        {isConfirm ? (
          <>
            <h1 className="mt-4 text-3xl font-semibold">Unsubscribe from Graphxify emails?</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg/60">
              If you confirm, we&apos;ll remove this address from future newsletter sends. You can subscribe again any time from the blog page.
            </p>
            <form action="/api/newsletter/unsubscribe" method="post" className="mt-6 flex flex-wrap gap-3">
              <input type="hidden" name="token" value={token} />
              <Button type="submit" size="lg" className="min-w-[180px]">
                <MailX className="mr-2 h-4 w-4" />
                Confirm unsubscribe
              </Button>
              <Button asChild type="button" size="lg" variant="secondary">
                <Link href="/blog">Keep subscription</Link>
              </Button>
            </form>
          </>
        ) : isSuccess ? (
          <>
            <h1 className="mt-4 text-3xl font-semibold">You&apos;re unsubscribed.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg/60">
              You won&apos;t receive future Graphxify newsletter emails from this subscription. If you change your mind later, you can subscribe again from the blog page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/blog">
                  <Undo2 className="mr-2 h-4 w-4" />
                  Subscribe again
                </Link>
              </Button>
            </div>
          </>
        ) : isAlready ? (
          <>
            <h1 className="mt-4 text-3xl font-semibold">This address is already unsubscribed.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg/60">
              There&apos;s nothing else you need to do. If you want to join again later, you can subscribe again from the blog page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/blog">
                  <MailCheck className="mr-2 h-4 w-4" />
                  Return to blog
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-3xl font-semibold">
              {isError ? "We couldn't process that unsubscribe request." : "Invalid unsubscribe link."}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg/60">
              {isError
                ? "Please try again from the email you received, or contact Graphxify directly if you need help being removed from the list."
                : "That unsubscribe link is missing or no longer valid. Open the link from your email again, or contact Graphxify directly."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/blog">Return to blog</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
