import { describe, expect, it } from "vitest";

import { auth } from "../lib/auth";
import { safeAuthNext } from "../lib/auth-next";

describe("authentication destination policy", () => {
  it("allows only known same-origin destinations", () => {
    expect(safeAuthNext("/saved")).toBe("/saved");
    expect(safeAuthNext("/company/example-company?from=compare")).toBe(
      "/company/example-company?from=compare"
    );
    expect(safeAuthNext("https://example.com")).toBe("/saved");
    expect(safeAuthNext("//example.com")).toBe("/saved");
    expect(safeAuthNext("/api/v1/companies")).toBe("/saved");
    expect(safeAuthNext("/account")).toBe("/saved");
  });

  it("uses the first value when a query parameter repeats", () => {
    expect(safeAuthNext(["/compare", "/saved"])).toBe("/compare");
  });

  it("ignores session cookies belonging to another localhost app", async () => {
    const headers = new Headers({
      cookie: "better-auth.session_data=header.payload.signature"
    });

    await expect(auth.api.getSession({ headers })).resolves.toBeNull();
  });
});
