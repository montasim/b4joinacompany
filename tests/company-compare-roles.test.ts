import { describe, expect, it } from "vitest";

import {
  roleKey,
  roleOptionsFor,
} from "../lib/compare-roles";

function salaryRole(id: string, role: string) {
  return {
    id,
    role,
    range: {
      minimumBdt: 50_000,
      maximumBdt: 70_000,
      currency: "BDT" as const,
      payPeriod: "unspecified" as const,
    },
    sampleSize: 3,
  };
}

function salaryEvidence(...roles: ReturnType<typeof salaryRole>[]) {
  return {
    observedAt: "2026-07-26T00:00:00.000Z",
    roles,
  };
}

describe("compare salary-role normalization", () => {
  it("normalizes Sr. and Senior to the same role key", () => {
    expect(roleKey("Sr. Software Engineer")).toBe(
      roleKey("Senior Software Engineer"),
    );
    expect(roleKey("Sr. Software Engineer")).toBe(
      "senior software engineer",
    );
  });

  it("keeps Senior and Junior roles distinct", () => {
    expect(roleKey("Senior Software Engineer")).not.toBe(
      roleKey("Junior Software Engineer"),
    );
  });
});

describe("compare salary-role options", () => {
  it("treats Sr. and Senior spellings as a shared role", () => {
    const options = roleOptionsFor(
      salaryEvidence(salaryRole("first-senior", "Sr. Software Engineer")),
      salaryEvidence(salaryRole("second-senior", "Senior Software Engineer")),
      "Alpha",
      "Beta",
    );

    expect(options).toEqual([
      {
        value: "senior software engineer",
        role: "Sr. Software Engineer",
        label: "Sr. Software Engineer",
        availability: "both",
      },
    ]);
  });

  it("labels one-company roles with the company that has evidence", () => {
    const options = roleOptionsFor(
      salaryEvidence(salaryRole("first-product", "Product Designer")),
      salaryEvidence(salaryRole("second-analyst", "Business Analyst")),
      "Alpha",
      "Beta",
    );

    expect(options).toEqual([
      expect.objectContaining({
        label: "Business Analyst — Beta only",
        availability: "second",
      }),
      expect.objectContaining({
        label: "Product Designer — Alpha only",
        availability: "first",
      }),
    ]);
  });

  it("orders shared roles before alphabetically earlier one-company roles", () => {
    const options = roleOptionsFor(
      salaryEvidence(
        salaryRole("first-accountant", "Accountant"),
        salaryRole("first-engineer", "Software Engineer"),
      ),
      salaryEvidence(
        salaryRole("second-analyst", "Business Analyst"),
        salaryRole("second-engineer", "Software Engineer"),
      ),
      "Alpha",
      "Beta",
    );

    expect(options.map(({ role, availability }) => ({ role, availability })))
      .toEqual([
        { role: "Software Engineer", availability: "both" },
        { role: "Accountant", availability: "first" },
        { role: "Business Analyst", availability: "second" },
      ]);
  });

  it("keeps the first record when one company has duplicate normalized roles", () => {
    const options = roleOptionsFor(
      salaryEvidence(
        salaryRole("preferred", "Sr. Software Engineer"),
        salaryRole("duplicate", "Senior Software Engineer"),
      ),
      salaryEvidence(salaryRole("second", "Senior Software Engineer")),
      "Alpha",
      "Beta",
    );

    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({
      value: "senior software engineer",
      role: "Sr. Software Engineer",
      label: "Sr. Software Engineer",
      availability: "both",
    });
  });

  it("returns no options when both companies have no salary roles", () => {
    expect(
      roleOptionsFor(
        salaryEvidence(),
        salaryEvidence(),
        "Alpha",
        "Beta",
      ),
    ).toEqual([]);
  });
});
