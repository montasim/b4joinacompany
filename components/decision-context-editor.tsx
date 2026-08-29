"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <div className="grid gap-2 text-[10px] font-extrabold">
              <span id="decision-stage-label">Where are you in the process?</span>
              <Select
                onValueChange={(stage) => setDraft({ ...draft, stage })}
                value={draft.stage}
              >
                <SelectTrigger
                  aria-labelledby="decision-stage-label"
                  className="bg-[#fbfdfc]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Decision stage</SelectLabel>
                    {["Reviewing an offer", "Interviewing", "Applying"].map(
                      (option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <label className="grid gap-2 text-[10px] font-extrabold">
              Role or team
              <Input
                value={draft.role}
                placeholder="e.g. Software Engineer"
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              />
            </label>
            <div className="grid gap-2 text-[10px] font-extrabold">
              <span id="decision-priority-label">What matters most?</span>
              <Select
                onValueChange={(priority) => setDraft({ ...draft, priority })}
                value={draft.priority}
              >
                <SelectTrigger
                  aria-labelledby="decision-priority-label"
                  className="bg-[#fbfdfc]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Decision priority</SelectLabel>
                    {[
                      "Job stability",
                      "Manager and team",
                      "Salary and benefits",
                      "Growth and learning",
                    ].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
