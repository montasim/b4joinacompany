export interface SalaryRole {
  id: string;
  role: string;
  range: {
    minimumBdt: number;
    maximumBdt: number;
    currency: "BDT";
    payPeriod: "unspecified";
  };
  sampleSize: number | null;
}

export interface SalaryEvidence {
  observedAt: string | null;
  roles: SalaryRole[];
}

export interface RoleOption {
  value: string;
  role: string;
  label: string;
  availability: "both" | "first" | "second";
}

export function roleKey(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\bsr\.?\b/g, "senior")
    .replace(/\bjr\.?\b/g, "junior")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function firstRoleByKey(records: SalaryRole[]) {
  const result = new Map<string, string>();
  for (const record of records) {
    const key = roleKey(record.role);
    if (key && !result.has(key)) result.set(key, record.role);
  }
  return result;
}

export function roleOptionsFor(
  first: SalaryEvidence,
  second: SalaryEvidence,
  firstCompany: string,
  secondCompany: string,
) {
  const firstRoles = firstRoleByKey(first.roles);
  const secondRoles = firstRoleByKey(second.roles);
  const keys = new Set([...firstRoles.keys(), ...secondRoles.keys()]);

  return [...keys]
    .filter(Boolean)
    .map<RoleOption>((key) => {
      const firstRole = firstRoles.get(key);
      const secondRole = secondRoles.get(key);
      const role = firstRole ?? secondRole ?? key;

      if (firstRole && secondRole) {
        return { value: key, role, label: role, availability: "both" };
      }
      if (firstRole) {
        return {
          value: key,
          role,
          label: `${role} — ${firstCompany} only`,
          availability: "first",
        };
      }
      return {
        value: key,
        role,
        label: `${role} — ${secondCompany} only`,
        availability: "second",
      };
    })
    .sort((left, right) => {
      if (left.availability === "both" && right.availability !== "both") {
        return -1;
      }
      if (right.availability === "both" && left.availability !== "both") {
        return 1;
      }
      return left.role.localeCompare(right.role);
    });
}
