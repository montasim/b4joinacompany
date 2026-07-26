import { SiteHeader } from "@/components/site-header";
import { PageHead } from "@/components/page-head";
import { AskForm } from "@/components/ask-form";
export default async function AskPage({searchParams}:{searchParams:Promise<{company?:string}>}) {
  const {company}=await searchParams;
  return <><SiteHeader purpose="Cited research"/><main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
    <nav className="mb-6 flex items-center gap-2 text-[11px] text-muted"><Link className="font-extrabold text-jade-dark no-underline" href="/company/technonext-ltd">TechnoNext checkpoint</Link><span>/</span><span>Ask the evidence</span></nav>
    <PageHead eyebrow="Company-scoped research" title="Ask one focused question." copy="b4join retrieves relevant sources for TechnoNext Ltd, then answers only from that evidence with visible citations."/>
    <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-7.5 max-lg:grid-cols-1"><AskForm companySlug={company}/><aside className="grid h-fit gap-3 max-lg:grid-cols-3 max-md:grid-cols-1">{[["Evidence used","Role: Software Engineer · Period: May–July 2026 · Relevant reports are selected at request time."],["Your generation allowance","Free beta · 5 answers daily · 50 monthly."],["Ask is not general chat","Questions stay scoped to this company. Unsupported claims return an Evidence Gap instead of a guess."]].map(([title,copy])=><section className="rounded-xl border border-line bg-white p-5" key={title}><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-[10px] leading-relaxed text-muted">{copy}</p></section>)}</aside></div>
  </main></>;
}
import Link from "next/link";
