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

function createHouseState() {
  return {
    founder: { id: "founder", name: "Your House", initials: "YH", score: 52, logo: "" },
    competitor: {
      id: "competitor",
      name: "Sable Consortium",
      initials: "SC",
      score: 52,
      logo: "",
    },
    disruptor: {
      id: "disruptor",
      name: "Mirage League",
      initials: "ML",
      score: 48,
      logo: "",
    },
  };
}

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
  history: [],
  houses: createHouseState(),
  ambition: {
    businessTypes: [],
    revenueTarget: 0,
    timeHorizon: 0,
    milestoneNotes: "",
    model: "",
    houseTitle: "",
    houseInitials: "",
    founderLogo: "",
    competitorName: "",
    competitorInitials: "",
    competitorLogo: "",
    disruptorName: "",
    disruptorInitials: "",
    disruptorLogo: "",
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
const metricsChart = document.getElementById("metrics-chart");
const chartLegend = document.getElementById("chart-legend");
const houseRow = document.getElementById("house-row");
const founderNameInput = document.getElementById("founder-name");
const founderLogoInput = document.getElementById("founder-logo");
const competitorNameInput = document.getElementById("competitor-name");
const competitorLogoInput = document.getElementById("competitor-logo");
const disruptorNameInput = document.getElementById("disruptor-name");
const disruptorLogoInput = document.getElementById("disruptor-logo");

const chartSeries = [
  { key: "revenue", label: "Revenue", color: "#f4c27f" },
  { key: "customers", label: "Customers", color: "#ff8a65" },
  { key: "product", label: "Product", color: "#6ed3c2" },
  { key: "competitorPressure", label: "Competitor Pressure", color: "#ff5f7a" },
];

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

function renderLegend() {
  if (!chartLegend) return;
  chartLegend.innerHTML = "";
  chartSeries.forEach((series) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-swatch" style="--swatch:${series.color}"></span>
      <span>${series.label}</span>
    `;
    chartLegend.appendChild(item);
  });
}

function renderChart() {
  if (!metricsChart) return;
  const history = state.history;
  const width = metricsChart.clientWidth;
  const height = metricsChart.clientHeight;
  if (!width || !height) return;
  const dpr = window.devicePixelRatio || 1;
  metricsChart.width = width * dpr;
  metricsChart.height = height * dpr;
  const ctx = metricsChart.getContext("2d");
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const padding = 28;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const values = history.flatMap((entry) =>
    chartSeries.map((series) => Math.max(0, entry.metrics?.[series.key] ?? 0))
  );
  const maxValue = values.length ? Math.max(10, ...values) : 10;
  const stepX = history.length > 1 ? usableWidth / (history.length - 1) : 0;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(244, 194, 127, 0.18)";
  ctx.fillStyle = "rgba(245, 237, 225, 0.5)";
  ctx.font = "10px 'Inter', system-ui, sans-serif";

  const gridLines = 4;
  for (let i = 0; i <= gridLines; i += 1) {
    const y = padding + (usableHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    const labelValue = Math.round(maxValue - (maxValue / gridLines) * i);
    ctx.fillText(labelValue.toString(), 6, y + 3);
  }

  ctx.strokeStyle = "rgba(244, 194, 127, 0.35)";
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  chartSeries.forEach((series) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = series.color;
    history.forEach((entry, index) => {
      const value = Math.max(0, entry.metrics?.[series.key] ?? 0);
      const x = padding + stepX * index;
      const ratio = maxValue ? value / maxValue : 0;
      const y = height - padding - ratio * usableHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    history.forEach((entry, index) => {
      const value = Math.max(0, entry.metrics?.[series.key] ?? 0);
      const x = padding + stepX * index;
      const ratio = maxValue ? value / maxValue : 0;
      const y = height - padding - ratio * usableHeight;
      ctx.beginPath();
      ctx.fillStyle = series.color;
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  ctx.restore();
}

function recordHistory() {
  const snapshot = {};
  Object.entries(state.metrics).forEach(([key, value]) => {
    snapshot[key] = Math.max(0, Number(value) || 0);
  });
  state.history.push({ turn: state.turn, metrics: snapshot });
  const limit = 20;
  if (state.history.length > limit) {
    state.history.splice(0, state.history.length - limit);
  }
  renderChart();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function deriveInitials(name) {
  if (!name) return "YH";
  const tokens = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!tokens.length) return "YH";
  return tokens
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2) || "YH";
}

function resolveHouseName(key, fallback) {
  if (key === "founder") {
    return state.ambition.houseTitle || fallback;
  }
  const property = `${key}Name`;
  return state.ambition[property] || fallback;
}

function resolveHouseLogo(key) {
  const property = `${key}Logo`;
  if (Object.prototype.hasOwnProperty.call(state.ambition, property)) {
    return state.ambition[property] || "";
  }
  return "";
}

function resolveHouseInitials(key, name, fallback) {
  if (key === "founder") {
    return state.ambition.houseInitials || fallback || deriveInitials(name);
  }
  const property = `${key}Initials`;
  const stored = state.ambition[property];
  if (stored) return stored;
  if (name) return deriveInitials(name);
  return fallback || "";
}

function renderHouses() {
  if (!houseRow) return;
  houseRow.innerHTML = "";
  const houses = Object.values(state.houses);
  const maxScore = houses.reduce((max, house) => Math.max(max, house.score || 0), 1);
  houses.forEach((house) => {
    const scale = clamp(0.85 + (house.score / maxScore) * 0.45, 0.9, 1.45);
    const card = document.createElement("article");
    card.className = "house";
    card.style.setProperty("--house-scale", scale.toFixed(2));
    if (house.score === maxScore) {
      card.classList.add("is-leading");
    }

    const logoWrapper = document.createElement("div");
    logoWrapper.className = "house-logo";
    if (house.logo) {
      const logoImg = document.createElement("img");
      logoImg.src = house.logo;
      logoImg.alt = `${house.name} logo`;
      logoImg.addEventListener("error", () => {
        logoImg.remove();
        logoWrapper.textContent = house.initials || "";
        logoWrapper.classList.add("fallback");
      });
      logoWrapper.appendChild(logoImg);
    }

    if (!house.logo) {
      logoWrapper.textContent = house.initials || "";
      logoWrapper.classList.add("fallback");
    }

    const meta = document.createElement("div");
    meta.className = "house-meta";

    const name = document.createElement("p");
    name.className = "house-name";
    name.textContent = house.name;

    const score = document.createElement("p");
    score.className = "house-score";
    score.textContent = Math.round(house.score);

    meta.append(name, score);
    card.append(logoWrapper, meta);
    houseRow.appendChild(card);
  });
}

function updateHouseScores({ drift = false, reset = false } = {}) {
  if (!state.houses) {
    state.houses = createHouseState();
  }

  const defaults = createHouseState();

  if (reset) {
    Object.keys(defaults).forEach((key) => {
      const baseline = defaults[key];
      const name = resolveHouseName(key, baseline.name);
      const initials = resolveHouseInitials(key, name, baseline.initials);
      const logo = resolveHouseLogo(key);
      state.houses[key] = {
        ...baseline,
        name,
        initials,
        logo,
        score: baseline.score,
      };
    });
  }

  const focusMetrics = ["revenue", "customers", "product", "retention", "brand", "cash"];
  const founderMomentum =
    focusMetrics.reduce((total, key) => total + Math.max(0, state.metrics[key] || 0), 0) /
    focusMetrics.length;
  const competitorEdge = 55 + state.metrics.competitorPressure * 1.2;
  const disruptorBase = (state.houses.disruptor?.score || 48) + (drift ? Math.random() * 8 - 4 : Math.random() * 6 - 3);

  const founderName = resolveHouseName("founder", defaults.founder.name);
  const founderInitials = resolveHouseInitials("founder", founderName, defaults.founder.initials);
  const founderLogo = resolveHouseLogo("founder");

  const competitorName = resolveHouseName("competitor", defaults.competitor.name);
  const competitorInitials = resolveHouseInitials(
    "competitor",
    competitorName,
    defaults.competitor.initials
  );
  const competitorLogo = resolveHouseLogo("competitor");

  const disruptorName = resolveHouseName("disruptor", defaults.disruptor.name);
  const disruptorInitials = resolveHouseInitials(
    "disruptor",
    disruptorName,
    defaults.disruptor.initials
  );
  const disruptorLogo = resolveHouseLogo("disruptor");

  state.houses.founder = {
    ...state.houses.founder,
    name: founderName,
    initials: founderInitials,
    logo: founderLogo,
    score: clamp(founderMomentum, 20, 120),
  };

  state.houses.competitor = {
    ...state.houses.competitor,
    name: competitorName,
    initials: competitorInitials,
    logo: competitorLogo,
    score: clamp(competitorEdge, 25, 120),
  };

  state.houses.disruptor = {
    ...state.houses.disruptor,
    name: disruptorName,
    initials: disruptorInitials,
    logo: disruptorLogo,
    score: clamp(disruptorBase + state.turn * 1.5, 30, 120),
  };

  renderHouses();
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
  recordHistory();
  updateHouseScores();
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
  updateHouseScores({ drift: true });
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
  state.history = [];
  updateHouseScores({ reset: true });
  recordHistory();
  turnNumber.textContent = "0";
  totalTurns.textContent = state.totalTurns;
  eventLog.innerHTML = "";
  cardRow.innerHTML = "";
  nextTurnButton.textContent = "Begin Campaign";
  nextTurnButton.disabled = false;
  renderMetrics();
  renderChart();
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

  const primaryIdentity = state.ambition.businessTypes[0] || "Your House";
  const submittedFounderName = founderNameInput ? founderNameInput.value.trim() : "";
  const submittedFounderLogo = founderLogoInput ? founderLogoInput.value.trim() : "";
  const submittedCompetitorName = competitorNameInput ? competitorNameInput.value.trim() : "";
  const submittedCompetitorLogo = competitorLogoInput ? competitorLogoInput.value.trim() : "";
  const submittedDisruptorName = disruptorNameInput ? disruptorNameInput.value.trim() : "";
  const submittedDisruptorLogo = disruptorLogoInput ? disruptorLogoInput.value.trim() : "";

  const founderName = submittedFounderName || primaryIdentity;
  state.ambition.houseTitle = founderName;
  state.ambition.houseInitials = deriveInitials(founderName);
  state.ambition.founderLogo = submittedFounderLogo || "";

  const competitorName = submittedCompetitorName || "Sable Consortium";
  state.ambition.competitorName = competitorName;
  state.ambition.competitorInitials = deriveInitials(competitorName);
  state.ambition.competitorLogo = submittedCompetitorLogo || "";

  const disruptorName = submittedDisruptorName || "Mirage League";
  state.ambition.disruptorName = disruptorName;
  state.ambition.disruptorInitials = deriveInitials(disruptorName);
  state.ambition.disruptorLogo = submittedDisruptorLogo || "";

  const blocks = analyzeBusinessModel(state.ambition.model);
  renderReinforcement(blocks);
  state.initialized = true;
  resetGame();
  logEvent("Blueprint received. Campaign ready. Press Begin Campaign.");
});

renderLegend();
updateHouseScores({ reset: true });
state.history = [];
recordHistory();
populateChips();
renderMetrics();
window.addEventListener("resize", renderChart);
