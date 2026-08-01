import { describe, expect, it } from "vitest";

import {
  browseCompanyDirectory,
  getBetonkemonCompany,
  searchCompanyDirectory,
} from "@/lib/research";

describe("company evidence directory", () => {
  it("accounts for every record without requiring a cross-source match", async () => {
    const directory = await browseCompanyDirectory({ limit: 1 });

    expect(directory.total).toBe(2403);
    expect(directory.counts).toEqual({
      both: 267,
      deshimula_only: 453,
      betonkemon_only: 1622,
      review: 61,
    });
  });

  it("keeps an uncertain same-name pair as two distinct records", async () => {
    const results = await searchCompanyDirectory("ACI", 10, "all");

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "deshimula:aci",
          coverage: "review",
          href: "/company/aci",
        }),
        expect.objectContaining({
          id: "betonkemon:aci",
          coverage: "betonkemon_only",
          href: "/salary-company/aci",
        }),
      ]),
    );
  });

  it("returns an accepted match only through its Deshi Mula company route", async () => {
    const results = await searchCompanyDirectory("10 Minute School", 10, "all");

    expect(results.filter((item) => item.slug === "10-minute-school")).toEqual([
      expect.objectContaining({
        coverage: "both",
        href: "/company/10-minute-school",
      }),
    ]);
  });

  it("exposes unmatched Beton Kemon aggregate evidence", async () => {
    await expect(getBetonkemonCompany("aci")).resolves.toEqual(
      expect.objectContaining({
        name: "ACI Limited",
        salaryEntryCount: 85,
        roleCount: 45,
        matchedCompanySlug: null,
      }),
    );
  });
});
