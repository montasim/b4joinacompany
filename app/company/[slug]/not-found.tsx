import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="mx-auto w-[calc(100%_-_40px)] max-w-290 py-15 max-sm:w-[calc(100%_-_28px)] max-sm:py-9"><p className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Company not found</p><h1 className="max-w-190 font-display text-[clamp(40px,5.6vw,64px)] leading-none font-bold tracking-tight">We could not resolve that company.</h1><p className="my-5 text-[15px] leading-relaxed text-ink-soft">Try another name, alias, website, or LinkedIn address.</p><Button asChild><Link href="/">Change search</Link></Button></main>;
}
