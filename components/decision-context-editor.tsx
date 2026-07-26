"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DecisionContext {
  stage: string;
  role: string;
  priority: string;
}

export function DecisionContextEditor({ stage, role, priority }: DecisionContext) {
  const initial = { stage, role, priority };
  const [context, setContext] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [open, setOpen] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setContext(draft);
    setOpen(false);
  }

  function cancel() {
    setDraft(context);
    setOpen(false);
  }

  return (
    <section className="border-b border-line py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-amber-soft px-2.5 py-1.5 text-[9px] font-bold text-amber-dark">{context.stage}</span>
        <span className="rounded-md bg-amber-soft px-2.5 py-1.5 text-[9px] font-bold text-amber-dark">{context.role || "Role not specified"}</span>
        <span className="rounded-md bg-amber-soft px-2.5 py-1.5 text-[9px] font-bold text-amber-dark">Priority: {context.priority}</span>
        <button className="ml-auto cursor-pointer border-0 bg-transparent text-[10px] font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3" type="button" onClick={() => setOpen((value) => !value)}>
          {open ? "Close context" : "Change context"}
        </button>
      </div>

      {open && (
        <form className="mt-4 rounded-xl border border-line-strong bg-white p-5" onSubmit={submit}>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <label className="grid gap-2 text-[10px] font-extrabold">
              Where are you in the process?
              <select className="min-h-11.25 w-full appearance-none rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
                value={draft.stage}
                onChange={(event) => setDraft({ ...draft, stage: event.target.value })}
              >
                <option>Reviewing an offer</option>
                <option>Interviewing</option>
                <option>Applying</option>
              </select>
            </label>
            <label className="grid gap-2 text-[10px] font-extrabold">
              Role or team
              <Input
                value={draft.role}
                placeholder="e.g. Software Engineer"
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-[10px] font-extrabold">
              What matters most?
              <select className="min-h-11.25 w-full appearance-none rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
                value={draft.priority}
                onChange={(event) => setDraft({ ...draft, priority: event.target.value })}
              >
                <option>Job stability</option>
                <option>Manager and team</option>
                <option>Salary and benefits</option>
                <option>Growth and learning</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={cancel}>Cancel</Button>
            <Button type="submit">Update checkpoint</Button>
          </div>
        </form>
      )}
    </section>
  );
}
