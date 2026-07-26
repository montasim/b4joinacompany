import { describe, expect, it } from "vitest";

import { resolveAdminRole } from "../lib/admin-role";
import { safeAuthNext } from "../lib/auth-next";

describe("authentication destination policy", () => {
  it("allows only known same-origin destinations", () => {
    expect(safeAuthNext("/saved")).toBe("/saved");
    expect(safeAuthNext("/company/example-company?from=compare")).toBe(
      "/company/example-company?from=compare"
    );
    expect(safeAuthNext("https://example.com")).toBe("/saved");
    expect(safeAuthNext("//example.com")).toBe("/saved");
    expect(safeAuthNext("/api/v1/admin/review-queue")).toBe("/saved");
    expect(safeAuthNext("/account")).toBe("/saved");
  });

  it("uses the first value when a query parameter repeats", () => {
    expect(safeAuthNext(["/compare", "/admin"])).toBe("/compare");
  });
});

describe("admin role policy", () => {
  it("derives owner access from the configured Google email", () => {
    expect(
      resolveAdminRole(
        { user: { email: "Owner@Example.com", role: "user" } },
        "owner@example.com"
      )
    ).toBe("owner");
  });

  it("allows stored operators but rejects ordinary users", () => {
    expect(
      resolveAdminRole(
        { user: { email: "operator@example.com", role: "operator" } },
        "owner@example.com"
      )
    ).toBe("operator");
    expect(
      resolveAdminRole(
        { user: { email: "user@example.com", role: "user" } },
        "owner@example.com"
      )
    ).toBeNull();
  });

  it("does not invent an owner when OWNER_EMAIL is absent", () => {
    expect(
      resolveAdminRole(
        { user: { email: "montasimmamun@gmail.com", role: "user" } },
        undefined
      )
    ).toBeNull();
  });
});
