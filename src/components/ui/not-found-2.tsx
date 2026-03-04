import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4">
      <Empty className="max-w-xl bg-card/76 backdrop-blur-md">
        <EmptyHeader>
          <EmptyTitle
            className="font-extrabold leading-none text-[clamp(5.5rem,18vw,8.75rem)] text-fg/90"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.2) 46%, rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 70%)",
              maskImage:
                "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.2) 46%, rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 70%)"
            }}
          >
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-9 text-fg/78">
            The page you&apos;re looking for might have been <br />
            moved or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="mr-2 size-4" data-icon="inline-start" />
                Go Home
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
