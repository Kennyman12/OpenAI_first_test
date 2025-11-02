const businessArchetypes = [
  "AI SaaS Platform",
  "Sustainable Goods",
  "Creator Economy Tool",
  "Boutique Consultancy",
  "Digital Marketplace",
  "Biotech Lab",
  "Education Tech",
];

const deck = [
  {
    name: "Deploy Sandstorm Marketing",
    description: "Launch an omnichannel campaign across influencers and ads.",
    effects: { revenue: 8, customers: 14, brand: 6, cash: -5 },
  },
  {
    name: "Refine Spice Product",
    description: "Invest in product improvements based on user feedback.",
    effects: { product: 10, retention: 6, customers: 3, cash: -4 },
  },
  {
    name: "Secure Guild Partnership",
    description: "Close a distribution alliance to access new markets.",
    effects: { revenue: 10, customers: 8, brand: 5, cash: -3 },
  },
  {
    name: "Raise Desert Capital",
    description: "Pitch investors for a strategic funding round.",
    effects: { cash: 15, brand: 3, revenue: 5, product: 2 },
  },
  {
    name: "Automate Operations",
    description: "Deploy AI automation to streamline fulfillment.",
    effects: { cash: 6, product: 4, retention: 5, customers: 2 },
  },
  {
    name: "Launch Loyalty Program",
    description: "Reward advocates to increase repeat purchases.",
    effects: { retention: 10, customers: 4, revenue: 6, cash: -3 },
  },
  {
    name: "Counter Intel Sweep",
    description: "Research competitor moves to anticipate responses.",
    effects: { brand: 4, product: 3, retention: 3 },
  },
  {
    name: "Talent Surge",
    description: "Hire specialists to shore up execution.",
    effects: { product: 6, revenue: 4, cash: -6, retention: 4 },
  },
];

const state = {
  initialized: false,
  turn: 0,
  totalTurns: 8,
  metrics: {
    revenue: 0,
    customers: 0,
    product: 0,
    retention: 0,
    brand: 0,
    cash: 20,
    competitorPressure: 0,
  },
  ambition: {
    businessTypes: [],
    revenueTarget: 0,
    timeHorizon: 0,
    milestoneNotes: "",
    model: "",
  },
};

const chipsContainer = document.getElementById("business-chips");
const businessTypeInput = document.getElementById("business-type-input");
const setupForm = document.getElementById("setup-form");
const reinforcementOutput = document.getElementById("reinforcement-output");
const nextTurnButton = document.getElementById("next-turn");
const cardRow = document.getElementById("card-row");
const eventLog = document.getElementById("event-log");
const turnNumber = document.getElementById("turn-number");
const totalTurns = document.getElementById("total-turns");
const metricsGrid = document.getElementById("metrics-grid");

function createChip(label) {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML = `<span>${label}</span>`;
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "×";
  remove.addEventListener("click", () => {
    state.ambition.businessTypes = state.ambition.businessTypes.filter((item) => item !== label);
    chip.remove();
  });
  chip.appendChild(remove);
  return chip;
}

function populateChips() {
  businessArchetypes.forEach((type) => {
    const chip = createChip(type);
    chip.addEventListener("click", () => toggleBusinessType(type, chip));
    chipsContainer.appendChild(chip);
  });
}

function toggleBusinessType(type, chip) {
  const exists = state.ambition.businessTypes.includes(type);
  if (exists) {
    state.ambition.businessTypes = state.ambition.businessTypes.filter((t) => t !== type);
    chip.classList.remove("selected");
  } else {
    state.ambition.businessTypes.push(type);
    chip.classList.add("selected");
  }
}

function addCustomBusinessType(value) {
  if (!value.trim()) return;
  const formatted = value.trim();
  if (!state.ambition.businessTypes.includes(formatted)) {
    state.ambition.businessTypes.push(formatted);
    const chip = createChip(formatted);
    chip.classList.add("selected");
    chipsContainer.appendChild(chip);
  }
  businessTypeInput.value = "";
}

businessTypeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addCustomBusinessType(businessTypeInput.value);
  }
});

function analyzeBusinessModel(model) {
  const lower = model.toLowerCase();
  const themes = [];

  if (lower.includes("subscription") || lower.includes("recurring")) {
    themes.push({
      title: "Revenue Rhythm",
      prompt:
        "Clarify pricing tiers, upgrade paths, and leading indicators to monitor churn and expansion MRR.",
    });
  }
  if (lower.includes("marketplace") || lower.includes("platform")) {
    themes.push({
      title: "Two-Sided Balance",
      prompt:
        "Define acquisition loops for both supply and demand. Outline incentives that keep liquidity resilient.",
    });
  }
  if (lower.includes("ads") || lower.includes("advertising")) {
    themes.push({
      title: "Attention Economy",
      prompt:
        "Quantify traffic pipelines and tolerance for acquisition cost. Map diversification away from single-channel risk.",
    });
  }
  if (lower.includes("hardware") || lower.includes("manufacturing")) {
    themes.push({
      title: "Supply Chain Fortification",
      prompt:
        "Document lead times, supplier redundancy, and working capital cycles so scale doesn't stall in the dunes.",
    });
  }
  if (lower.includes("ai") || lower.includes("ml")) {
    themes.push({
      title: "Model Differentiation",
      prompt:
        "State proprietary data moats, feedback loops, and evaluation cadence to stay ahead of rival models.",
    });
  }
  if (lower.includes("consult") || lower.includes("service")) {
    themes.push({
      title: "Service Capacity",
      prompt:
        "Design utilization targets, hiring ramp, and productized offerings that keep margins defensible.",
    });
  }
  if (!themes.length) {
    themes.push({
      title: "Clarity of Purpose",
      prompt:
        "Break down core customer segments, the pain you resolve, and the most direct path to monetization.",
    });
  }

  const riskReminders = buildRiskChecks(model);

  return [
    ...themes,
    buildStrategicFocus(),
    {
      title: "Signal Amplifiers",
      prompt: buildSignalAmplifiers(),
    },
    {
      title: "Risk Watch",
      prompt: riskReminders,
    },
  ];
}

function buildSignalAmplifiers() {
  const { revenueTarget, timeHorizon } = state.ambition;
  const monthlyTarget = timeHorizon ? Math.round(revenueTarget / (timeHorizon / 12 || 1)) : null;

  return [
    revenueTarget
      ? `Target annual revenue: ${formatNumber(revenueTarget)}. Track monthly run-rate toward ${formatNumber(
          Math.round(revenueTarget / 12)
        )}.`
      : "Quantify your north-star revenue and ensure each initiative ties to a leading metric.",
    timeHorizon
      ? `With ${timeHorizon} months runway, establish quarterly OKRs and guard your burn multiple.`
      : "Set an explicit horizon to align hiring, marketing, and capital plans.",
    monthlyTarget
      ? `To achieve the ambition, sustain approximately ${formatNumber(monthlyTarget)} revenue per quarter.`
      : "Model a reverse income statement: revenue goal ➜ customers ➜ conversion assumptions.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildStrategicFocus() {
  const focusPoints = [];
  if (state.ambition.businessTypes.length) {
    focusPoints.push(
      `Chosen archetypes: ${state.ambition.businessTypes.join(", ")}. Align go-to-market motions to leverage their natural strengths.`
    );
  }
  if (state.ambition.milestoneNotes) {
    focusPoints.push(
      `Milestone intent: ${state.ambition.milestoneNotes}. Translate each narrative beat into measurable checkpoints.`
    );
  }
  focusPoints.push("Explicitly decide the single metric that matters this quarter and defend calendar time around it.");

  return {
    title: "Strategic Focus",
    prompt: focusPoints.join("\n"),
  };
}

function buildRiskChecks(model) {
  const reminders = [
    "Validate customer willingness-to-pay with at least five live experiments.",
    "Track the unit economics: CAC vs. LTV, gross margin, and payback cycle.",
    "Outline fallback plays if competitor pricing undercuts you by 20%.",
  ];
  if (model.toLowerCase().includes("regulation")) {
    reminders.push("Map the regulatory landscape and buffer time for compliance approvals.");
  }
  return reminders.join("\n");
}

function renderReinforcement(blocks) {
  reinforcementOutput.innerHTML = "";
  blocks.forEach((block) => {
    const element = document.createElement("div");
    element.className = "reinforcement-block";
    const prompt = Array.isArray(block.prompt) ? block.prompt.join("\n") : block.prompt;
    element.innerHTML = `<h3>${block.title}</h3><pre>${prompt}</pre>`;
    reinforcementOutput.appendChild(element);
  });
}

function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString();
}

function logEvent(text) {
  const entry = document.createElement("p");
  entry.textContent = text;
  eventLog.prepend(entry);
}

function renderMetrics() {
  metricsGrid.innerHTML = "";
  const entries = [
    { key: "revenue", label: "Projected Revenue", suffix: "k" },
    { key: "customers", label: "Active Customers" },
    { key: "product", label: "Product Strength", suffix: "%" },
    { key: "retention", label: "Retention", suffix: "%" },
    { key: "brand", label: "Brand Momentum", suffix: "%" },
    { key: "cash", label: "Cash Reserves", suffix: "k" },
    { key: "competitorPressure", label: "Competitor Pressure", suffix: "%" },
  ];
  entries.forEach(({ key, label, suffix = "" }) => {
    const metric = document.createElement("div");
    metric.className = "metric";
    const value = Math.max(0, Math.round(state.metrics[key]));
    metric.innerHTML = `
      <span>${label}</span>
      <strong>${formatNumber(value)}${suffix}</strong>
      <small>${trendNarrative(key, value)}</small>
    `;
    metricsGrid.appendChild(metric);
  });
}

function trendNarrative(key, value) {
  if (key === "competitorPressure") {
    if (value > 70) return "Rivals closing in — deploy defensive plays.";
    if (value > 40) return "Competition is active; stay adaptive.";
    return "Maintaining edge over challengers.";
  }
  if (value > 80) return "Dominant momentum.";
  if (value > 50) return "Healthy trajectory.";
  if (value > 20) return "Early traction forming.";
  return "Needs decisive action.";
}

function drawCards(count = 3) {
  const cards = [];
  const usedIndexes = new Set();
  while (cards.length < count) {
    const idx = Math.floor(Math.random() * deck.length);
    if (!usedIndexes.has(idx)) {
      usedIndexes.add(idx);
      cards.push(deck[idx]);
    }
  }
  return cards;
}

function renderCards(cards) {
  cardRow.innerHTML = "";
  cards.forEach((card) => {
    const element = document.createElement("article");
    element.className = "card";
    element.innerHTML = `
      <h3>${card.name}</h3>
      <p>${card.description}</p>
      <div class="effect">${summarizeEffects(card.effects)}</div>
    `;
    element.addEventListener("click", () => playCard(card));
    cardRow.appendChild(element);
  });
}

function summarizeEffects(effects) {
  return Object.entries(effects)
    .map(([key, value]) => `${value > 0 ? "+" : ""}${value} ${labelForMetric(key)}`)
    .join(" • ");
}

function labelForMetric(key) {
  switch (key) {
    case "revenue":
      return "revenue";
    case "customers":
      return "customers";
    case "product":
      return "product";
    case "retention":
      return "retention";
    case "brand":
      return "brand";
    case "cash":
      return "cash";
    default:
      return key;
  }
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state.metrics[key] = (state.metrics[key] || 0) + value;
  });
}

function competitorMove() {
  const intensity = 5 + Math.random() * 10 + state.turn * 2;
  const focus = ["revenue", "customers", "brand", "product"][Math.floor(Math.random() * 4)];
  state.metrics[focus] = Math.max(0, state.metrics[focus] - intensity);
  state.metrics.competitorPressure = Math.min(100, state.metrics.competitorPressure + intensity / 2);
  logEvent(`Competitors executed a strike on your ${focus}, impact -${intensity.toFixed(1)}.`);
}

function playCard(card) {
  if (!state.initialized || state.turn === 0) return;
  applyEffects(card.effects);
  competitorMove();
  logEvent(`You played "${card.name}".`);
  renderMetrics();
  nextTurnButton.disabled = false;
  cardRow.querySelectorAll(".card").forEach((cardEl) => {
    cardEl.classList.add("inactive");
    cardEl.style.pointerEvents = "none";
  });
}

function advanceTurn() {
  if (!state.initialized) return;
  if (state.turn >= state.totalTurns) {
    nextTurnButton.disabled = true;
    logEvent("Campaign complete. Review dashboard insights to plan the next era.");
    return;
  }

  state.turn += 1;
  turnNumber.textContent = state.turn;
  totalTurns.textContent = state.totalTurns;
  logEvent(`Turn ${state.turn} begins. The desert awaits your command.`);
  const cards = drawCards();
  renderCards(cards);
  nextTurnButton.disabled = true;
}

function resetGame() {
  state.turn = 0;
  state.metrics = {
    revenue: 10,
    customers: 10,
    product: 20,
    retention: 20,
    brand: 20,
    cash: 20,
    competitorPressure: 10,
  };
  turnNumber.textContent = "0";
  totalTurns.textContent = state.totalTurns;
  eventLog.innerHTML = "";
  cardRow.innerHTML = "";
  nextTurnButton.textContent = "Begin Campaign";
  nextTurnButton.disabled = false;
  renderMetrics();
}

nextTurnButton.addEventListener("click", () => {
  if (!state.initialized) return;
  if (state.turn === 0) {
    nextTurnButton.textContent = "Next Turn";
  }
  advanceTurn();
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addCustomBusinessType(businessTypeInput.value);
  state.ambition.businessTypes = [...new Set(state.ambition.businessTypes)].slice(0, 6);
  state.ambition.revenueTarget = Number(document.getElementById("revenue-target").value) || 0;
  state.ambition.timeHorizon = Number(document.getElementById("time-horizon").value) || 0;
  state.ambition.milestoneNotes = document.getElementById("milestone-notes").value.trim();
  state.ambition.model = document.getElementById("business-model").value.trim();

  if (!state.ambition.model) {
    alert("Describe your business model to receive reinforcement.");
    return;
  }

  const blocks = analyzeBusinessModel(state.ambition.model);
  renderReinforcement(blocks);
  state.initialized = true;
  resetGame();
  logEvent("Blueprint received. Campaign ready. Press Begin Campaign.");
});

populateChips();
renderMetrics();
