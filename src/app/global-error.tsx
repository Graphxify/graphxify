"use client";

export default function GlobalError() {
  return (
    <html>
      <body className="page-bg min-h-screen">
        <div className="container py-20 text-ivory">
          <h1 className="text-3xl font-semibold">Critical application error</h1>
          <p className="mt-3 text-sm text-[rgba(242,240,235,0.75)]">Please restart the app and check server logs.</p>
        </div>
      </body>
    </html>
  );
}
