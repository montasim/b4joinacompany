import { describe, expect, it } from "vitest";
import { cn, initials, normalizeText } from "../lib/utils";

describe("research utilities", () => {
  it("normalizes company aliases and partial-search text", () => {
    expect(normalizeText("  TechnoNe><t   Ltd ")).toBe("technonet ltd");
    expect(normalizeText("টেকনোনেক্সট লিমিটেড")).toBe("টেকনোনেক্সট লিমিটেড");
  });
  it("builds readable initials", () => {
    expect(initials("TechnoNext Ltd")).toBe("TL");
    expect(initials("Betopia")).toBe("B");
  });
  it("merges shadcn-compatible classes predictably", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
