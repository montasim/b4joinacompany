"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DatasetUpdateState } from "@/lib/dataset-update-contract";

const stateLabel: Record<DatasetUpdateState["status"], string> = {
  idle: "Ready",
  running: "Running locally",
  success: "Completed",
  error: "Stopped with an error"
};

export function DatasetUpdatePanel({ initial, enabled = true }: { initial: DatasetUpdateState; enabled?: boolean }) {
  const [state, setState] = useState(initial);
  const [requesting, setRequesting] = useState(false);
  const previousStatus = useRef(initial.status);
  const running = state.status === "running";

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(async () => {
      const response = await fetch("/api/v1/admin/dataset-update", { cache: "no-store" });
      if (response.ok) setState(await response.json() as DatasetUpdateState);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const completedThisSession = previousStatus.current === "running";
    previousStatus.current = state.status;
    if (!completedThisSession || state.status !== "success" || !state.finishedAt) return;
    const timer = window.setTimeout(() => window.location.reload(), 1200);
    return () => window.clearTimeout(timer);
  }, [state.status, state.finishedAt]);

  async function start() {
    setRequesting(true);
    const response = await fetch("/api/v1/admin/dataset-update", { method: "POST" });
    const payload = await response.json();
    if (response.ok) setState(payload as DatasetUpdateState);
    else setState((current) => ({ ...current, status: "error", error: payload?.error?.message ?? "Could not start the update." }));
    setRequesting(false);
  }

  const tone = state.status === "error" ? "coral" : state.status === "running" ? "amber" : "jade";

  return (
    <section className="relative overflow-hidden rounded-[12px] border border-ink bg-ink p-5 text-white shadow-[8px_8px_0_rgba(31,42,47,.08)]" aria-labelledby="dataset-update-title">
      <div className="absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden="true" />
      <div className="flex flex-wrap items-start justify-between gap-4 pl-2">
        <div>
          <p className="font-mono text-[9px] font-bold tracking-[.13em] text-amber uppercase">Local operation</p>
          <h3 id="dataset-update-title" className="mt-2 font-display text-[25px] leading-none font-extrabold tracking-[-.03em]">Update the evidence base</h3>
          <p className="mt-2 max-w-[560px] text-[11px] leading-[1.55] text-white/65">Fetch new stories, comments, and company records, rebuild the release files, validate them, and sync the result into this app&apos;s local database.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{stateLabel[state.status]}</Badge>
          <Button type="button" size="sm" variant="amber" disabled={!enabled || running || requesting} onClick={start}>
            {!enabled ? "Disabled here" : running ? "Update running…" : state.status === "success" ? "Run again" : "Update records"}
          </Button>
        </div>
      </div>
      <div className="mt-5 grid gap-3 pl-2 sm:grid-cols-[minmax(0,1fr)_180px]">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-[9px] leading-[1.65] text-white/70" aria-live="polite">
          {state.logs.length ? state.logs.slice(-6).map((line, index) => <div key={`${line}-${index}`} className={line.startsWith("✕") ? "text-coral" : line.startsWith("✓") ? "text-amber" : ""}>{line}</div>) : <div className="text-white/40">No run yet. The release folder is unchanged until you start one.</div>}
        </div>
        <div className="rounded-lg border border-white/10 p-3 text-[10px] text-white/60">
          <span className="font-mono text-[8px] font-bold tracking-[.1em] text-white/40 uppercase">Current step</span>
          <strong className="mt-2 block text-white">{state.step ?? "Waiting for a local run"}</strong>
          {state.error ? <p className="mt-2 text-coral">{state.error}</p> : <p className="mt-2">The page will keep this panel live while the local process runs.</p>}
        </div>
      </div>
    </section>
  );
}
