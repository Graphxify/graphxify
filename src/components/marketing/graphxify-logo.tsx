import Image from "next/image";

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
    <Image
      src="/images/branding/graphxify-logo-dark.svg"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
