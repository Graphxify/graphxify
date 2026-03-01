import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-fg/56">404</p>
      <h1 className="mt-2 text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-fg/68">The requested page does not exist.</p>
      <Link href="/" className="link-sweep mt-4 inline-flex text-sm">
        Back home
      </Link>
    </div>
  );
}
