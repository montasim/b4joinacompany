import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";

export function AuthShell({ callbackURL = "/saved" }: { callbackURL?: string }) {
  return (
    <>
      <AuthHeader />
      <main className="mx-auto grid min-h-[calc(100vh-69px)] w-[calc(100%_-_40px)] max-w-290 grid-cols-[minmax(0,1fr)_410px] items-center gap-20 py-15 max-lg:grid-cols-1 max-lg:gap-9 max-sm:w-[calc(100%_-_28px)] max-sm:py-9.5">
        <section className="max-w-165">
          <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">b4join private workspace</p>
          <h1 className="font-display text-[clamp(44px,5vw,64px)] leading-[.99] font-bold tracking-[-.03em]">Keep the questions behind your next decision.</h1>
          <p className="mt-4 max-w-125 text-sm leading-[1.7] text-ink-soft">Save company checkpoints, record what you learn in interviews, and return when the evidence changes.</p>
          <div className="mt-6 max-w-140 overflow-hidden rounded-xl border border-line-strong bg-white/75">
            <header className="flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-4">
              <div className="grid gap-1">
                <span className="font-mono text-[8px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">Your decision checkpoint</span>
                <strong className="font-display text-lg">What still needs an answer?</strong>
              </div>
              <span className="inline-flex rounded-[5px] bg-jade-soft px-2 py-1 font-mono text-[8px] font-bold text-jade-dark uppercase">Private</span>
            </header>
            <ol className="m-0 grid list-none px-5">
              {[
                ["1", "Questions stay attached to the right company.", "Company · role · decision stage", "bg-ink text-white"],
                ["2", "Interview answers stay yours.", "Record what was confirmed and what remains unclear", "bg-jade text-white"],
                ["3", "New evidence never replaces a saved revision silently.", "You decide when to refresh the checkpoint", "bg-amber text-ink"]
              ].map(([number, title, detail, tone], index) => (
                <li className={`grid grid-cols-[24px_1fr] items-start gap-3 py-4 ${index ? "border-t border-line" : ""}`} key={number}>
                  <span className={`grid size-5.75 place-items-center rounded-full font-mono text-[9px] font-bold ${tone}`}>{number}</span>
                  <div className="grid gap-1">
                    <strong className="text-[11px] leading-snug">{title}</strong>
                    <small className="text-[9px] leading-snug text-muted">{detail}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="rounded-[14px] border border-line-strong bg-white p-6.5 shadow-panel max-lg:max-w-130 max-sm:p-5">
          <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">Continue your research</p>
          <h2 className="font-display text-[28px] leading-tight font-bold tracking-[-.03em]">Open your b4join workspace.</h2>
          <p className="mt-2 mb-5 text-[11px] leading-relaxed text-muted">One Google step creates your private workspace or returns you to it.</p>
          <AuthForm callbackURL={callbackURL} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
          <p className="mt-4 text-center text-[10px] leading-relaxed text-muted [&_a]:font-extrabold [&_a]:text-jade-dark">
            By continuing, you agree to the Terms and acknowledge the Privacy notice.
            <br />
            b4join never receives or stores your Google password.
            <br />
            <Link href="/extension">Using the extension?</Link> It works without an account.
          </p>
        </section>
      </main>
    </>
  );
}

export function AuthHeader() {
  return <SiteHeader active="Sign in" mode="public" />;
}
