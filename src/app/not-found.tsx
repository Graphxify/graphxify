import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-[rgba(242,240,235,0.75)]">The requested page does not exist.</p>
      <Link href="/" className="mt-4 inline-block text-accentA">
        Back home
      </Link>
    </div>
  );
}
