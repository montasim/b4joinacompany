import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContextPage() {
  const selectClass = "min-h-11.25 w-full appearance-none rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10";
  return <><SiteHeader /><main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24"><PageHead eyebrow="Optional focus" title="Make the questions fit your decision." copy="Company evidence is available immediately. Add only the context that changes which questions matter most." /><Card className="max-w-195"><CardContent><form className="grid gap-4"><label className="grid gap-2 text-[10px] font-extrabold">Where are you in the process?<select className={selectClass} defaultValue="offer"><option value="offer">Reviewing an offer</option><option>Interviewing</option><option>Applying</option></select></label><label className="grid gap-2 text-[10px] font-extrabold">Role or team<Input defaultValue="Software Engineer" /></label><label className="grid gap-2 text-[10px] font-extrabold">What matters most?<select className={selectClass}><option>Job stability</option><option>Manager and team</option><option>Salary and benefits</option><option>Growth and learning</option></select></label><div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link href="/company/technonext-ltd">Cancel</Link></Button><Button asChild><Link href="/company/technonext-ltd">Update checkpoint</Link></Button></div></form></CardContent></Card></main></>;
}
