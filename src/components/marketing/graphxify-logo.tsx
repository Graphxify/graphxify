import Image from "next/image";
import { cn } from "@/lib/utils";

type GraphxifyLogoProps = {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function GraphxifyLogo({
  alt = "Graphxify",
  width = 246,
  height = 68,
  className,
  priority = false,
  sizes
}: GraphxifyLogoProps): JSX.Element {
  return (
    <>
      <Image
        src="/images/branding/graphxify-logo-dark.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn("dark:hidden", className)}
      />
      <Image
        src="/images/branding/graphxify-logo-light.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
