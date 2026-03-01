"use client";

export default function GlobalError() {
  return (
    <html>
      <body className="app-shell min-h-screen bg-bg text-fg">
        <div className="container py-20">
          <h1 className="text-3xl font-semibold">Critical application error</h1>
          <p className="mt-3 text-sm text-fg/68">Please restart the app and check server logs.</p>
        </div>
      </body>
    </html>
  );
}
