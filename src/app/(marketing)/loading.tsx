export default function MarketingLoading() {
  return (
    <main className="relative z-10">
      <section className="container animate-pulse pb-16 pt-10 md:pb-20 md:pt-12">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="h-4 w-32 rounded-full bg-card/70" />
          <div className="space-y-3">
            <div className="h-14 rounded-2xl bg-card/70" />
            <div className="h-14 w-11/12 rounded-2xl bg-card/55" />
          </div>
          <div className="h-5 w-3/4 rounded-full bg-card/55" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-[1.5rem] bg-card/60" />
            <div className="h-40 rounded-[1.5rem] bg-card/60" />
            <div className="h-40 rounded-[1.5rem] bg-card/60" />
          </div>
        </div>
      </section>
    </main>
  );
}
