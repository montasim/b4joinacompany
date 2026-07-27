const pages = [
  ["Research", "index.html", "research"],
  ["Compare", "compare.html", "compare"],
  ["Saved", "saved.html", "saved"],
  ["Extension", "extension.html", "extension"],
  ["Support", "support.html", "support"],
];

const page = document.body.dataset.page || "";
const pageParams = new URLSearchParams(window.location.search);
const readPrototypeRole = () => {
  try {
    return window.sessionStorage.getItem("b4join-prototype-role") || "";
  } catch {
    return "";
  }
};
const writePrototypeRole = (role) => {
  try {
    if (role) window.sessionStorage.setItem("b4join-prototype-role", role);
    else window.sessionStorage.removeItem("b4join-prototype-role");
  } catch {
    // Query-string previews still work when storage is unavailable.
  }
};

if (pageParams.get("signedOut") === "1") writePrototypeRole("");
if (
  page === "saved" &&
  ["signed-in", "empty"].includes(pageParams.get("preview"))
) {
  writePrototypeRole("user");
}
if (page === "admin" && pageParams.get("preview") === "signed-in") {
  writePrototypeRole("admin");
}

const prototypeRole = readPrototypeRole();
const signedInUser = prototypeRole === "user";
const signedInAdmin = prototypeRole === "admin";
const adminWorkspacePreview = page === "admin" && signedInAdmin;
const navigationPages = signedInAdmin
  ? [
      ["Review queue", "admin.html?preview=signed-in", "admin"],
      ["Public research", "index.html", "research"],
      ["Method", "method.html", "method"],
    ]
  : pages;
const icon = `
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8 7.5h10.5a5.5 5.5 0 0 1 0 11H13"></path>
    <path d="M8 7.5v17M8 24.5h8"></path>
    <path d="m20 22 2.5 2.5L27 19"></path>
  </svg>`;

document.querySelectorAll("[data-site-header]").forEach((target) => {
  target.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="shell header-inner">
        <a class="brand" href="./index.html" aria-label="b4join home">
          <span class="brand-mark">${icon}</span>
          <span class="brand-word">b4join</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Open navigation">
          <span></span><span></span>
        </button>
        <nav class="site-nav" aria-label="Primary navigation">
          ${navigationPages
            .map(
              ([label, href, key]) =>
                `<a href="./${href}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`,
            )
            .join("")}
          ${
            signedInAdmin
              ? '<a class="mobile-signin" href="./admin.html?preview=signed-in">Admin workspace</a><a class="mobile-check" data-signout href="./admin.html?signedOut=1">Sign out</a>'
              : signedInUser
                ? '<a class="mobile-signin" href="./saved.html?preview=signed-in">Private workspace</a><a class="mobile-check" data-signout href="./saved.html?signedOut=1">Sign out</a>'
              : '<a class="mobile-signin" href="./auth.html">Sign in</a>'
          }
        </nav>
        <div class="header-actions">
          ${
            signedInAdmin
              ? '<a class="admin-header-role" href="./admin.html?preview=signed-in"><span></span>Admin workspace</a><a class="button button-small" data-signout href="./admin.html?signedOut=1">Sign out</a>'
              : signedInUser
                ? '<a class="quiet-link" href="./saved.html?preview=signed-in">Private workspace</a><a class="button button-small" data-signout href="./saved.html?signedOut=1">Sign out</a>'
              : '<a class="quiet-link" href="./auth.html">Sign in</a>'
          }
        </div>
      </div>
    </header>`;

  const toggle = target.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    target.querySelector(".site-nav")?.classList.toggle("is-open", !open);
  });
});

document.addEventListener("click", (event) => {
  const rolePreview = event.target.closest("[data-prototype-role]");
  if (rolePreview) writePrototypeRole(rolePreview.dataset.prototypeRole);
  if (event.target.closest("[data-signout]")) writePrototypeRole("");
});

document.querySelectorAll("[data-site-footer]").forEach((target) => {
  target.innerHTML = `
    <footer class="site-footer">
      <div class="shell footer-inner">
        <div>
          <a class="brand footer-brand" href="./index.html">
            <span class="brand-mark">${icon}</span><span class="brand-word">b4join</span>
          </a>
          <p>Company research for better questions—not automatic verdicts.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="./method.html">How evidence works</a>
          <a href="./support.html">Support & corrections</a>
        </nav>
      </div>
    </footer>`;
});

const companies = [
  {
    name: "TechnoNext Ltd",
    slug: "technonext-ltd",
    meta: "81 workplace stories · 12 salary roles",
    initials: "TN",
    storyCount: 81,
    salaryRoles: 12,
    thirdPartyReviews: 85,
    topics: ["Compensation", "Leadership clarity"],
    storyMix: { positive: 7, mixed: 6, negative: 68 },
    salaries: {
      "Software Engineer": { min: 62300, max: 72300, sample: 10 },
      "Senior Software Engineer": { min: 110000, max: 130000, sample: 4 },
      "Junior Software Engineer": { min: 25000, max: 35000, sample: 7 },
      "Business Analyst": { min: 35000, max: 45000, sample: 8 },
    },
    work: {
      summary: "3 hybrid · 2 remote sources",
      meta: "5 distinct work-mode sources · high-confidence derivation · current policy unverified",
    },
    questions: [
      "How is performance feedback and decision-making documented?",
      "What work mode and overtime terms apply to this role?",
      "What pay period and complete package does the submitted amount represent?",
    ],
    official: "3 verified official destinations",
    briefAvailable: true,
  },
  {
    name: "bKash",
    slug: "bkash",
    meta: "10 workplace stories · 39 salary roles",
    initials: "BK",
    storyCount: 10,
    salaryRoles: 39,
    thirdPartyReviews: 329,
    topics: ["Team culture", "Compensation"],
    storyMix: { positive: 1, mixed: 1, negative: 8 },
    salaries: {
      "Software Engineer": { min: 70000, max: 80000, sample: 3 },
      "Senior Software Engineer": { min: 92000, max: 102000, sample: 5 },
    },
    work: {
      summary: "No repeated work-mode evidence found",
      meta: "Unknown does not mean onsite · ask for the current team policy",
    },
    questions: [
      "What work mode and schedule apply to this team now?",
      "How does this team handle feedback and performance reviews?",
      "What pay period and complete package does the submitted amount represent?",
    ],
    official: "2 provisional destinations · review status pending",
    briefAvailable: false,
  },
  {
    name: "Brain Station 23",
    slug: "brain-station-23",
    meta: "36 workplace stories · 21 salary roles",
    initials: "BS",
    storyCount: 36,
    salaryRoles: 21,
    thirdPartyReviews: 516,
    topics: ["Compensation", "Team culture"],
    storyMix: { positive: 6, mixed: 9, negative: 21 },
    salaries: {
      "Software Engineer": { min: 50000, max: 60000, sample: 11 },
      "Senior Software Engineer": { min: 96000, max: 116000, sample: 17 },
      "Junior Software Engineer": { min: 31000, max: 41000, sample: 6 },
    },
    work: {
      summary: "2 hybrid · 1 remote mentions",
      meta: "Only 2 distinct mode sources · categories overlap · current policy unverified",
    },
    questions: [
      "What is the current hybrid policy for this specific team?",
      "How are team placement and learning opportunities decided?",
      "What pay period and complete package does the submitted amount represent?",
    ],
    official: "1 provisional careers destination · review status pending",
    briefAvailable: false,
  },
  {
    name: "BJIT",
    slug: "bjit",
    meta: "22 workplace stories · 12 salary roles",
    initials: "BJ",
    storyCount: 22,
    salaryRoles: 12,
    thirdPartyReviews: 407,
    topics: ["Compensation", "Team culture"],
    storyMix: { positive: 2, mixed: 4, negative: 16 },
    salaries: {
      "Software Engineer": { min: 38000, max: 48000, sample: 15 },
      "Senior Software Engineer": { min: 75000, max: 85000, sample: 9 },
    },
    work: {
      summary: "2 hybrid · 1 remote sources",
      meta: "3 distinct mode sources · medium-confidence derivation · current policy unverified",
    },
    questions: [
      "What is the current hybrid policy for this role and project?",
      "How are team expectations and leadership decisions communicated?",
      "What pay period and complete package does the submitted amount represent?",
    ],
    official: "2 provisional destinations · review status pending",
    briefAvailable: false,
  },
  {
    name: "10 Minute School",
    slug: "10-minute-school",
    meta: "16 workplace stories · 24 salary roles",
    initials: "10",
    storyCount: 16,
    salaryRoles: 24,
    thirdPartyReviews: 91,
    topics: ["Team culture", "Learning & growth"],
    storyMix: { positive: 0, mixed: 0, negative: 16 },
    salaries: {
      "Software Engineer": { min: 25000, max: 35000, sample: 3 },
    },
    work: {
      summary: "No repeated work-mode evidence found",
      meta: "Unknown does not mean onsite · ask for the current team policy",
    },
    questions: [
      "What work mode and schedule apply to this team now?",
      "How are learning opportunities and team feedback handled?",
      "What pay period and complete package does the submitted amount represent?",
    ],
    official: "3 verified official destinations",
    briefAvailable: false,
  },
];

document.querySelectorAll("[data-company-search]").forEach((form) => {
  const input = form.querySelector("input");
  const results = form.querySelector("[data-search-results]");
  const feedback = form.querySelector("[data-search-feedback]");
  if (!input || !results) return;

  const selectCompany = (company) => {
    input.value = company.name;
    input.dataset.selectedCompany = company.name;
    if (feedback) feedback.textContent = "";
  };

  const render = () => {
    const query = input.value.trim().toLowerCase();
    const matches = companies.filter((company) =>
      company.name.toLowerCase().includes(query),
    );
    const visibleCompanies = query ? matches : companies.slice(0, 3);
    results.innerHTML = visibleCompanies.length
      ? visibleCompanies
          .map(
            (company) => `
          <button type="button" data-company="${company.name}">
            <span class="company-avatar">${company.initials}</span>
            <span><strong>${company.name}</strong><small>${company.meta}</small></span>
            <span aria-hidden="true">→</span>
          </button>`,
          )
          .join("")
      : '<p class="search-results-empty">No matching company in this snapshot.</p>';
    results.hidden = false;
  };

  input.addEventListener("focus", render);
  input.addEventListener("input", () => {
    delete input.dataset.selectedCompany;
    if (feedback) feedback.textContent = "";
    render();
  });
  results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-company]");
    if (!button) return;
    selectCompany(
      companies.find((company) => company.name === button.dataset.company),
    );
    results.hidden = true;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const company = companies.find(
      (candidate) => candidate.name.toLowerCase() === input.value.trim().toLowerCase(),
    );
    if (!company) {
      if (feedback) feedback.textContent = "Choose one of the matching companies first.";
      render();
      input.focus();
      return;
    }
    if (company.name === "TechnoNext Ltd") {
      window.location.href = "./company.html";
      return;
    }
    if (feedback) {
      feedback.textContent =
        `A complete brief for ${company.name} is not available in this snapshot yet. Try another company or open the TechnoNext example.`;
    }
  });
  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) results.hidden = true;
  });
});

document.querySelectorAll("[data-save-company]").forEach((button) => {
  const savedPreview =
    new URLSearchParams(window.location.search).get("state") === "saved";
  if (savedPreview) {
    button.setAttribute("aria-pressed", "true");
    button.textContent = "Saved";
    button.disabled = true;
  }
  button.addEventListener("click", () => {
    if (button.disabled) return;
    window.location.href = "./auth.html?reason=save&return=company.html";
  });
});

document.querySelectorAll("[data-google-signin]").forEach((button) => {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");
  const allowedReturns = new Set([
    "company.html",
    "compare.html",
    "index.html",
    "saved.html",
    "admin.html",
  ]);
  const requestedReturn = params.get("return");
  const safeReturn = allowedReturns.has(requestedReturn)
    ? requestedReturn
    : "saved.html";
  const headline = document.querySelector("[data-auth-headline]");
  const copy = document.querySelector("[data-auth-copy]");
  const returnNote = document.querySelector("[data-auth-return-note]");
  const status = document.querySelector("[data-auth-status]");
  const label = button.querySelector("[data-google-label]");

  if (reason === "save") {
    if (headline) headline.innerHTML = "Keep this brief <em>for later.</em>";
    if (copy) {
      copy.textContent =
        "Sign in to keep this company checkpoint, its questions, and the exact evidence revision you reviewed.";
    }
    if (returnNote) returnNote.hidden = false;
  } else if (reason === "admin") {
    if (headline) headline.innerHTML = "Enter the evidence <em>review desk.</em>";
    if (copy) {
      copy.textContent =
        "Google confirms whether the signed-in account has permission to review withheld evidence changes.";
    }
    if (returnNote) {
      returnNote.textContent =
        "Only the configured admin account can open the review workspace.";
      returnNote.hidden = false;
    }
  }

  button.addEventListener("click", () => {
    button.disabled = true;
    if (label) label.textContent = "Opening Google…";
    if (status) status.hidden = true;

    window.setTimeout(() => {
      button.disabled = false;
      if (label) label.textContent = "Continue with Google";
      if (!status) return;
      const target =
        reason === "save"
          ? `./${safeReturn}${safeReturn === "company.html" ? "?state=saved" : ""}`
          : reason === "admin"
            ? "./admin.html?preview=signed-in"
            : "./saved.html?preview=signed-in";
      const action =
        reason === "save"
          ? "Return to the saved brief preview →"
          : reason === "admin"
            ? "Preview the admin review desk →"
            : "Preview the user workspace →";
      status.innerHTML =
        `Prototype handoff: Google authorization would open here. <a data-prototype-role="${reason === "admin" ? "admin" : "user"}" href="${target}">${action}</a>`;
      status.hidden = false;
    }, 700);
  });
});

const roleSalary = {
  "Software Engineer": {
    range: "৳62.3k–72.3k",
    sample: "10 reported submissions",
    start: "41.5%",
    width: "6.7%",
  },
  "Senior Software Engineer": {
    range: "৳110k–130k",
    sample: "4 reported submissions · limited",
    start: "73.3%",
    width: "13.4%",
  },
  "Junior Software Engineer": {
    range: "৳25k–35k",
    sample: "7 reported submissions",
    start: "16.7%",
    width: "6.7%",
  },
  "Business Analyst": {
    range: "৳35k–45k",
    sample: "8 reported submissions",
    start: "23.3%",
    width: "6.7%",
  },
};

document.querySelectorAll("[data-role-select]").forEach((select) => {
  select.addEventListener("change", () => {
    const salary = roleSalary[select.value];
    if (!salary) return;
    document.querySelectorAll("[data-role-select]").forEach((other) => {
      other.value = select.value;
    });
    document.querySelector("[data-selected-salary]").textContent = salary.range;
    document.querySelector("[data-selected-sample]").textContent = salary.sample;
    document.querySelectorAll("[data-selected-role]").forEach((label) => {
      label.textContent = select.value;
    });
    const miniRange = document.querySelector(".mini-range");
    miniRange?.style.setProperty("--mini-start", salary.start);
    miniRange?.style.setProperty("--mini-width", salary.width);
    document.querySelectorAll("[data-salary-role]").forEach((row) => {
      row.classList.toggle("is-selected", row.dataset.salaryRole === select.value);
    });
  });
});

document.querySelectorAll("[data-ask-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = form.parentElement.querySelector("[data-answer]");
    answer.hidden = false;
    answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

const showSavedState = (state) => {
  const gate = document.querySelector("[data-saved-gate]");
  const content = document.querySelector("[data-saved-content]");
  const empty = document.querySelector("[data-saved-empty]");
  if (gate) gate.hidden = state !== "gate";
  if (content) content.hidden = state !== "signed-in";
  if (empty) empty.hidden = state !== "empty";
};

document.querySelectorAll("[data-saved-toggle]").forEach((button) => {
  button.addEventListener("click", () => showSavedState("signed-in"));
});

if (document.querySelector("[data-saved-content]")) {
  const preview = pageParams.get("preview");
  if (preview === "signed-in" || (signedInUser && preview !== "empty")) {
    showSavedState("signed-in");
  }
  else if (preview === "empty") showSavedState("empty");
  else showSavedState("gate");
}

document.querySelectorAll("[data-saved-checkpoint]").forEach((checkpoint) => {
  checkpoint.addEventListener("toggle", () => {
    if (!checkpoint.open) return;
    document.querySelectorAll("[data-saved-checkpoint]").forEach((other) => {
      if (other !== checkpoint) other.open = false;
    });
  });
});

const adminGate = document.querySelector("[data-admin-gate]");
const adminWorkspace = document.querySelector("[data-admin-workspace]");
if (adminGate && adminWorkspace) {
  adminGate.hidden = adminWorkspacePreview;
  adminWorkspace.hidden = !adminWorkspacePreview;
  if (!adminWorkspacePreview && signedInUser) {
    const eyebrow = adminGate.querySelector("[data-admin-gate-eyebrow]");
    const title = adminGate.querySelector("[data-admin-gate-title]");
    const copy = adminGate.querySelector("[data-admin-gate-copy]");
    const signIn = adminGate.querySelector("[data-admin-gate-signin]");
    const returnLink = adminGate.querySelector("[data-admin-gate-return]");
    const note = adminGate.querySelector("[data-admin-gate-note]");
    if (eyebrow) eyebrow.textContent = "Admin access required";
    if (title) title.innerHTML = "This workspace belongs to <em>the review team.</em>";
    if (copy) {
      copy.textContent =
        "Your Google account is signed in for personal research, but it does not have permission to view withheld evidence changes.";
    }
    if (signIn) signIn.hidden = true;
    if (returnLink) returnLink.hidden = false;
    if (note) note.textContent = "Admin access is assigned by verified Google account";
  }
}

const adminQueue = document.querySelector(".admin-queue");
const adminDecisionForm = document.querySelector("[data-admin-decision-form]");
if (adminQueue && adminDecisionForm) {
  const items = [...adminQueue.querySelectorAll("[data-admin-item]")];
  const panels = [...document.querySelectorAll("[data-admin-panel]")];
  const filters = [...adminQueue.querySelectorAll("[data-admin-filter]")];
  const reason = adminDecisionForm.querySelector("[data-admin-reason]");
  const note = adminDecisionForm.querySelector("textarea");
  const status = adminDecisionForm.querySelector("[data-admin-decision-status]");
  const decisionButtons = [
    ...adminDecisionForm.querySelectorAll("[data-admin-decision]"),
  ];

  const updateQueueCount = () => {
    const remaining = items.filter((item) => !item.dataset.reviewed).length;
    document.querySelectorAll("[data-admin-queue-count]").forEach((target) => {
      target.textContent = String(remaining);
    });
  };

  const selectAdminItem = (item) => {
    if (!item || item.hidden) return;
    items.forEach((other) => {
      const selected = other === item;
      other.classList.toggle("is-selected", selected);
      other.setAttribute("aria-pressed", String(selected));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.adminPanel !== item.dataset.adminItem;
    });
    adminDecisionForm.reset();
    const reviewed = Boolean(item.dataset.reviewed);
    decisionButtons.forEach((button) => {
      button.disabled = reviewed;
    });
    if (reviewed) {
      status.textContent =
        `${item.dataset.reviewed}. Prototype decision only; no published record changed.`;
      status.className = "admin-decision-status is-ready";
      status.hidden = false;
    } else {
      status.hidden = true;
      status.className = "admin-decision-status";
    }
  };

  items.forEach((item) => {
    item.addEventListener("click", () => selectAdminItem(item));
  });

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const kind = filter.dataset.adminFilter;
      filters.forEach((other) => {
        other.setAttribute("aria-pressed", String(other === filter));
      });
      items.forEach((item) => {
        item.hidden = kind !== "all" && item.dataset.adminKind !== kind;
      });
      const visibleItems = items.filter((item) => !item.hidden);
      const empty = adminQueue.querySelector("[data-admin-filter-empty]");
      if (empty) empty.hidden = visibleItems.length > 0;
      if (!visibleItems.some((item) => item.classList.contains("is-selected"))) {
        selectAdminItem(visibleItems[0]);
      }
    });
  });

  decisionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = items.find((item) => item.classList.contains("is-selected"));
      if (!selected || selected.dataset.reviewed) return;
      if (!reason.value) {
        status.textContent = "Choose the evidence basis before recording a decision.";
        status.className = "admin-decision-status is-error";
        status.hidden = false;
        reason.focus();
        return;
      }

      const approved = button.dataset.adminDecision === "approved";
      const decision = approved
        ? "Approved for the next revision"
        : "Change rejected";
      selected.dataset.reviewed = decision;
      selected.classList.add("is-reviewed");
      selected.querySelector("[data-admin-item-state]").textContent =
        approved ? "Approved" : "Rejected";
      selected.querySelector("[data-admin-item-state]").classList.add(
        approved ? "is-approved" : "is-rejected",
      );
      decisionButtons.forEach((action) => {
        action.disabled = true;
      });
      status.innerHTML =
        `<strong>${decision}.</strong> ${reason.value}. ${note.value.trim() ? "Reviewer note recorded locally." : "No reviewer note added."} Prototype only; no published record changed.`;
      status.className = "admin-decision-status is-ready";
      status.hidden = false;
      updateQueueCount();
    });
  });
}

document.querySelectorAll("[data-compare-form]").forEach((form) => {
  const inputs = {
    a: form.querySelector("#company-a"),
    b: form.querySelector("#company-b"),
  };
  const roleSelect = form.querySelector("[data-compare-role]");
  const submitButton = form.querySelector("[data-compare-submit]");
  const empty = document.querySelector("[data-compare-empty]");
  const results = document.querySelector("[data-compare-results]");
  const message = form.querySelector("[data-compare-message]");
  const selected = { a: null, b: null };
  let activeSide = "a";

  const formatAmount = (amount) => {
    const thousands = amount / 1000;
    return Number.isInteger(thousands) ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  };

  const findCompany = (value) =>
    companies.find(
      (company) =>
        company.name.toLowerCase() === value?.trim().toLowerCase() ||
        company.slug === value,
    );

  const updateBuilderState = () => {
    const ready = Boolean(
      selected.a && selected.b && selected.a.name !== selected.b.name,
    );
    submitButton.disabled = !ready;
    if (ready) {
      message.textContent =
        "Ready. The same categories will be shown for both companies.";
    } else {
      message.textContent = "Choose two different companies from the suggestions.";
    }
  };

  const selectCompany = (side, company) => {
    if (!company) return;
    const otherSide = side === "a" ? "b" : "a";
    if (selected[otherSide]?.name === company.name) {
      form.querySelector(`[data-compare-field-message="${side}"]`).textContent =
        "Choose a different company.";
      return;
    }
    selected[side] = company;
    inputs[side].value = company.name;
    form.querySelector(`[data-picker-avatar="${side}"]`).textContent = company.initials;
    form.querySelector(`[data-compare-picker="${side}"]`).classList.add("is-selected");
    form.querySelector(`[data-compare-field-message="${side}"]`).textContent = "";
    form.querySelector(`[data-compare-suggestions="${side}"]`).hidden = true;
    updateBuilderState();
  };

  const renderSuggestions = (side) => {
    const input = inputs[side];
    const suggestions = form.querySelector(`[data-compare-suggestions="${side}"]`);
    const otherSide = side === "a" ? "b" : "a";
    const query = input.value.trim().toLowerCase();
    const matches = companies.filter(
      (company) =>
        company.name !== selected[otherSide]?.name &&
        (!query || company.name.toLowerCase().includes(query)),
    );
    suggestions.innerHTML = matches.length
      ? matches
          .map(
            (company) => `
              <button type="button" data-compare-company="${company.name}">
                <span class="company-avatar">${company.initials}</span>
                <span><strong>${company.name}</strong><small>${company.meta}</small></span>
                <span aria-hidden="true">→</span>
              </button>`,
          )
          .join("")
      : '<p class="compare-suggestions-empty">No matching company in this snapshot.</p>';
    suggestions.hidden = false;
  };

  ["a", "b"].forEach((side) => {
    const input = inputs[side];
    const picker = form.querySelector(`[data-compare-picker="${side}"]`);
    const suggestions = form.querySelector(`[data-compare-suggestions="${side}"]`);
    input.addEventListener("focus", () => {
      activeSide = side;
      renderSuggestions(side);
    });
    input.addEventListener("input", () => {
      activeSide = side;
      selected[side] = null;
      picker.classList.remove("is-selected");
      form.querySelector(`[data-picker-avatar="${side}"]`).textContent =
        side.toUpperCase();
      form.querySelector(`[data-compare-field-message="${side}"]`).textContent = "";
      renderSuggestions(side);
      updateBuilderState();
    });
    suggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-compare-company]");
      if (!button) return;
      selectCompany(side, findCompany(button.dataset.compareCompany));
    });
  });

  const setComparisonSide = (side, company) => {
    document.querySelectorAll(`[data-compare-name="${side}"]`).forEach((target) => {
      target.textContent = company.name;
    });
    document.querySelectorAll(`[data-compare-side-name="${side}"]`).forEach((target) => {
      target.textContent = company.name;
    });
    document.querySelector(`[data-compare-avatar="${side}"]`).textContent = company.initials;
    document.querySelector(`[data-compare-meta="${side}"]`).textContent =
      `${company.storyCount} stories · ${company.salaryRoles} salary roles`;

    const briefLink = document.querySelector(`[data-compare-brief-link="${side}"]`);
    if (company.briefAvailable) {
      briefLink.textContent = "Open full brief →";
      briefLink.href = "./company.html";
      briefLink.removeAttribute("aria-disabled");
    } else {
      briefLink.textContent = "Full brief unavailable";
      briefLink.removeAttribute("href");
      briefLink.setAttribute("aria-disabled", "true");
    }

    document.querySelector(`[data-compare-questions="${side}"]`).innerHTML =
      company.questions.map((question) => `<li>${question}</li>`).join("");
    document.querySelector(`[data-compare-topics="${side}"]`).innerHTML =
      company.topics.map((topic) => `<span>${topic}</span>`).join("");
    document.querySelector(`[data-compare-topic-meta="${side}"]`).textContent =
      `${company.thirdPartyReviews} third-party reviews · fixed taxonomy`;
    document.querySelector(`[data-compare-work="${side}"]`).textContent =
      company.work.summary;
    document.querySelector(`[data-compare-work-meta="${side}"]`).textContent =
      company.work.meta;
    document.querySelector(`[data-compare-basis="${side}"]`).textContent =
      `${company.storyCount} workplace stories · ${company.salaryRoles} salary roles`;
    document.querySelector(`[data-compare-official="${side}"]`).textContent =
      `${company.thirdPartyReviews} third-party reviews · ${company.official}`;
  };

  const updateSalarySide = (side, company, role) => {
    const salary = company.salaries[role];
    const card = document.querySelector(`[data-compare-salary-card="${side}"]`);
    const amount = document.querySelector(`[data-compare-salary="${side}"]`);
    const meta = document.querySelector(`[data-compare-salary-meta="${side}"]`);
    const band = document.querySelector(`[data-compare-salary-band="${side}"]`);
    if (!salary) {
      card.classList.add("is-missing");
      amount.textContent = "No matched evidence for this role";
      meta.textContent = "Ask directly; missing data is not a negative signal.";
      band.style.setProperty("--salary-start", "0%");
      band.style.setProperty("--salary-width", "0%");
      return;
    }
    card.classList.remove("is-missing");
    amount.textContent = `৳${formatAmount(salary.min)}–${formatAmount(salary.max)}`;
    meta.textContent =
      `${salary.sample} reported submissions · period unknown · captured 26 Jul 2026`;
    band.style.setProperty("--salary-start", `${(salary.min / 150000) * 100}%`);
    band.style.setProperty(
      "--salary-width",
      `${((salary.max - salary.min) / 150000) * 100}%`,
    );
  };

  const renderComparison = (shouldScroll = false) => {
    if (!selected.a || !selected.b || selected.a.name === selected.b.name) return;
    const role = roleSelect.value;
    setComparisonSide("a", selected.a);
    setComparisonSide("b", selected.b);
    updateSalarySide("a", selected.a, role);
    updateSalarySide("b", selected.b, role);
    document.querySelector("[data-compare-role-label]").textContent = role;
    document.querySelector("[data-compare-role-inline]").textContent = role;
    empty.hidden = true;
    results.hidden = false;
    message.textContent =
      "Comparison built. Missing evidence remains visible.";
    const url = new URL(location.href);
    url.searchParams.set("a", selected.a.slug);
    url.searchParams.set("b", selected.b.slug);
    url.searchParams.set("role", role.toLowerCase().replaceAll(" ", "-"));
    history.replaceState({}, "", url);
    if (shouldScroll) {
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selected.a) {
      form.querySelector('[data-compare-field-message="a"]').textContent =
        "Choose a company from the suggestions.";
    }
    if (!selected.b) {
      form.querySelector('[data-compare-field-message="b"]').textContent =
        "Choose a company from the suggestions.";
    }
    renderComparison(true);
  });

  form.querySelectorAll("[data-compare-recent]").forEach((button) => {
    button.addEventListener("click", () => {
      const company = findCompany(button.dataset.compareRecent);
      const side = selected[activeSide] && !selected[activeSide === "a" ? "b" : "a"]
        ? activeSide === "a" ? "b" : "a"
        : activeSide;
      selectCompany(side, company);
      activeSide = side === "a" ? "b" : "a";
    });
  });

  form.querySelector("[data-compare-swap]").addEventListener("click", () => {
    const previousA = selected.a;
    const previousB = selected.b;
    selected.a = null;
    selected.b = null;
    if (previousB) selectCompany("a", previousB);
    else {
      inputs.a.value = "";
      form.querySelector('[data-picker-avatar="a"]').textContent = "A";
      form.querySelector('[data-compare-picker="a"]').classList.remove("is-selected");
    }
    if (previousA) selectCompany("b", previousA);
    else {
      inputs.b.value = "";
      form.querySelector('[data-picker-avatar="b"]').textContent = "B";
      form.querySelector('[data-compare-picker="b"]').classList.remove("is-selected");
    }
    updateBuilderState();
    if (!results.hidden) renderComparison();
  });

  roleSelect.addEventListener("change", () => {
    if (!results.hidden) renderComparison();
  });

  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) {
      form.querySelectorAll("[data-compare-suggestions]").forEach((target) => {
        target.hidden = true;
      });
    }
  });

  const params = new URLSearchParams(location.search);
  const initialA = findCompany(params.get("a"));
  const initialB = findCompany(params.get("b"));
  const initialRole = params.get("role")?.replaceAll("-", " ");
  const matchingRole = [...roleSelect.options].find(
    (option) => option.value.toLowerCase() === initialRole,
  );
  if (matchingRole) roleSelect.value = matchingRole.value;
  if (initialA) selectCompany("a", initialA);
  if (initialB) selectCompany("b", initialB);
  if (initialA && initialB && initialA.name !== initialB.name) renderComparison();
  updateBuilderState();
});

document.querySelectorAll(".switch").forEach((button) => {
  button.addEventListener("click", () => {
    const on = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!on));
    button.classList.toggle("on", !on);
  });
});

const openTargetDetails = (hash) => {
  if (!hash?.startsWith("#")) return;
  const target = document.querySelector(hash);
  if (target instanceof HTMLDetailsElement) target.open = true;
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => openTargetDetails(link.getAttribute("href")));
});
openTargetDetails(window.location.hash);

document.querySelectorAll("[data-method-provenance]").forEach((provenance) => {
  const tabs = [...provenance.querySelectorAll("[data-method-tab]")];
  const panels = [...provenance.querySelectorAll("[data-method-panel]")];
  const validLanes = new Set(tabs.map((tab) => tab.dataset.methodTab));

  const selectMethodLane = (
    name,
    { moveFocus = false, updateHash = false } = {},
  ) => {
    if (!validLanes.has(name)) name = "derived";
    provenance.dataset.methodActive = name;
    tabs.forEach((tab) => {
      const active = tab.dataset.methodTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.methodPanel !== name;
    });
    if (updateHash) {
      const nextUrl = new URL(window.location.href);
      nextUrl.hash = name;
      try {
        window.history.replaceState(null, "", nextUrl);
      } catch {
        // Direct file previews can reject History API changes; the lane still works.
      }
    }
  };

  provenance.classList.add("is-enhanced");
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectMethodLane(tab.dataset.methodTab, { updateHash: true });
    });
    tab.addEventListener("keydown", (event) => {
      let targetIndex = index;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) {
        targetIndex = (index + 1) % tabs.length;
      } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        targetIndex = 0;
      } else if (event.key === "End") {
        targetIndex = tabs.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      selectMethodLane(tabs[targetIndex].dataset.methodTab, {
        moveFocus: true,
        updateHash: true,
      });
    });
  });
  window.addEventListener("hashchange", () => {
    const lane = window.location.hash.slice(1);
    if (validLanes.has(lane)) {
      selectMethodLane(lane, {
        moveFocus: document.activeElement?.matches("[data-method-tab]"),
      });
    }
  });

  const initialLane = window.location.hash.slice(1);
  selectMethodLane(validLanes.has(initialLane) ? initialLane : "derived");
});

document.querySelectorAll(".extension-dock").forEach((dock) => {
  const tabs = [...dock.querySelectorAll("[data-extension-tab]")];
  const panes = [...dock.querySelectorAll("[data-extension-pane]")];

  const selectExtensionPreview = (name, moveFocus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.extensionTab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    panes.forEach((pane) => {
      const active = pane.dataset.extensionPane === name;
      pane.hidden = !active;
      pane.classList.toggle("is-active", active);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () =>
      selectExtensionPreview(tab.dataset.extensionTab),
    );
    tab.addEventListener("keydown", (event) => {
      let targetIndex = index;
      if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") targetIndex = 0;
      else if (event.key === "End") targetIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectExtensionPreview(tabs[targetIndex].dataset.extensionTab, true);
    });
  });
});

document.querySelectorAll("[data-support-form]").forEach((form) => {
  const kind = form.querySelector("#support-kind");
  const company = form.querySelector("#support-company");
  const source = form.querySelector("#support-source");
  const details = form.querySelector("#support-details");
  const message = form.querySelector("[data-support-form-message]");
  const draftState = document.querySelector("[data-support-draft-state]");
  const fields = { kind, company, source, details };

  const clearError = (name) => {
    const input = fields[name];
    const error = form.querySelector(`[data-support-error="${name}"]`);
    input?.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  };

  const setError = (name, copy) => {
    const input = fields[name];
    const error = form.querySelector(`[data-support-error="${name}"]`);
    input?.setAttribute("aria-invalid", "true");
    if (error) error.textContent = copy;
  };

  Object.entries(fields).forEach(([name, input]) => {
    input?.addEventListener("input", () => {
      clearError(name);
      if (message) {
        message.hidden = true;
        message.className = "support-form-message";
      }
      if (draftState) draftState.textContent = "Draft · not sent";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    Object.keys(fields).forEach(clearError);

    const errors = [];
    if (!kind?.value) {
      errors.push(["kind", "Choose what needs correction."]);
    }
    if ((company?.value.trim().length || 0) < 2) {
      errors.push([
        "company",
        "Add the company name or b4join page this concerns.",
      ]);
    }

    const sourceValue = source?.value.trim() || "";
    if (sourceValue) {
      try {
        const parsed = new URL(sourceValue);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        errors.push([
          "source",
          "Paste a complete URL beginning with http:// or https://.",
        ]);
      }
    }

    const detailsValue = details?.value.trim() || "";
    if (detailsValue.length < 10) {
      errors.push([
        "details",
        "Describe what is wrong and what should be checked.",
      ]);
    }

    if (errors.length) {
      errors.forEach(([name, copy]) => setError(name, copy));
      if (message) {
        message.textContent =
          "The correction note is still a draft. Review the highlighted fields.";
        message.className = "support-form-message is-error";
        message.hidden = false;
      }
      fields[errors[0][0]]?.focus();
      return;
    }

    const kindLabel = kind.options[kind.selectedIndex].text;
    const subject = `b4join correction · ${kindLabel} · ${company.value.trim()}`;
    const body = [
      `Correction type: ${kindLabel}`,
      `Company or b4join page: ${company.value.trim()}`,
      `Official source: ${sourceValue || "Not supplied"}`,
      "",
      "What should change:",
      detailsValue,
      "",
      "This email was prepared from the b4join correction-note prototype.",
    ].join("\n");

    if (message) {
      message.innerHTML =
        "<strong>Email draft prepared.</strong> Finish sending it in your email app; this page has not uploaded or queued the correction.";
      message.className = "support-form-message is-ready";
      message.hidden = false;
    }
    if (draftState) draftState.textContent = "Ready for email";
    window.location.href = `mailto:montasimmamun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

document
  .querySelector("[data-support-correction-link]")
  ?.addEventListener("click", () => {
    window.setTimeout(() => document.querySelector("#support-kind")?.focus(), 350);
  });

if (!document.querySelector('script[src*="supportkori.com/widget.js"]')) {
  const support = document.createElement("script");
  support.src = "https://www.supportkori.com/widget.js";
  support.dataset.id = "montasim";
  support.dataset.message = "Support montasim";
  support.dataset.color = "#FFDD00";
  support.dataset.position = "right";
  support.addEventListener("load", () => {
    const button = document.querySelector(".sk-widget-btn");
    button?.setAttribute("role", "button");
    button?.setAttribute("tabindex", "0");
    button?.setAttribute("aria-label", "Support montasim");
    const mobileStyle = document.createElement("style");
    mobileStyle.textContent = `
      @media (max-width: 680px) {
        .sk-widget-btn {
          width: 46px !important;
          height: 46px !important;
          justify-content: center !important;
          padding: 0 !important;
          right: 12px !important;
          bottom: 12px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity .2s ease !important;
        }
        .sk-widget-btn.sk-mobile-visible {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .sk-widget-btn span { display: none !important; }
        .sk-widget-iframe-container {
          right: 10px !important;
          bottom: 68px !important;
          width: calc(100vw - 20px) !important;
          height: min(550px, calc(100vh - 90px)) !important;
        }
      }`;
    document.head.append(mobileStyle);
    const syncMobileSupport = () => {
      button?.classList.toggle(
        "sk-mobile-visible",
        window.innerWidth > 680 || window.scrollY > 420,
      );
    };
    syncMobileSupport();
    window.addEventListener("scroll", syncMobileSupport, { passive: true });
    window.addEventListener("resize", syncMobileSupport);
  });
  document.body.append(support);
}
