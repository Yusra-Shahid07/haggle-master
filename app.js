const memFallback = {};
async function storageGet(key) {
  try {
    if (window.storage && typeof window.storage.get === "function") {
      const r = await window.storage.get(key, false);
      return r ? r.value : null;
    }
  } catch (e) {
    /* not found or unsupported, fall through */
  }
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (e) {}
  return memFallback[key] !== undefined ? memFallback[key] : null;
}
async function storageSet(key, value) {
  memFallback[key] = value;
  try {
    if (window.storage && typeof window.storage.set === "function") {
      await window.storage.set(key, value, false);
      return true;
    }
  } catch (e) {}
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {}
  return true;
}
async function storageDelete(key) {
  delete memFallback[key];
  try {
    if (window.storage && typeof window.storage.delete === "function") {
      await window.storage.delete(key, false);
    }
  } catch (e) {}
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

/* =========================================================
   DATA: scenarios (buy & earn), personalities
========================================================= */
const BUY_ITEMS = [
  {
    key: "cotton shirt",
    emoji: "👕",
    label: "Cotton Shirt",
    range: [1200, 2000],
    counterpart: "Shopkeeper",
  },
  {
    key: "mangoes",
    emoji: "🥭",
    label: "Mangoes ",
    range: [150, 280],
    counterpart: "Shopkeeper",
  },
  {
    key: "taxi fare to downtown",
    emoji: "🚕",
    label: "Taxi Fare",
    range: [150, 250],
    counterpart: "Taxi Driver",
  },
  {
    key: "leather sandals",
    emoji: "👞",
    label: "Leather Sandals",
    range: [900, 1600],
    counterpart: "Shopkeeper",
  },
  {
    key: "scarf",
    emoji: "🧣",
    label: "Scarf",
    range: [400, 900],
    counterpart: "Shopkeeper",
  },
  {
    key: "wooden showpiece",
    emoji: "🪵",
    label: "Wooden Showpiece",
    range: [500, 1200],
    counterpart: "Shopkeeper",
  },
];

const EARN_ITEMS = [
  {
    key: "job salary offer",
    emoji: "💼",
    label: "Job Salary Offer",
    range: [50000, 120000],
    counterpart: "Hiring Manager",
  },
  {
    key: "freelance project rate",
    emoji: "💻",
    label: "Freelance Rate",
    range: [15000, 60000],
    counterpart: "Client",
  },
  {
    key: "salary raise request",
    emoji: "📈",
    label: "Salary Raise",
    range: [5000, 25000],
    counterpart: "Manager",
  },
  {
    key: "tutoring fee",
    emoji: "📚",
    label: "Tutoring Fee/month",
    range: [5000, 15000],
    counterpart: "Parent",
  },
];

const BUY_KEYWORDS = [
  {
    words: [
      "shirt",
      "jeans",
      "suit",
      "dress",
      "jacket",
      "scarf",
      "stole",
      "trousers",
    ],
    range: [800, 2500],
    counterpart: "Shopkeeper",
  },
  {
    words: [
      "mango",
      "banana",
      "apple",
      "watermelon",
      "vegetable",
      "fruit",
      "orange",
      "grape",
    ],
    range: [100, 350],
    counterpart: "Shopkeeper",
  },
  {
    words: ["taxi", "fare", "ride", "cab", "bike"],
    range: [100, 400],
    counterpart: "Driver",
  },
  {
    words: ["sandal", "shoes", "sneaker", "slipper", "boots"],
    range: [600, 1800],
    counterpart: "Shopkeeper",
  },
  {
    words: [
      "showpiece",
      "handicraft",
      "decoration",
      "art",
      "vase",
      "pottery",
      "frame",
    ],
    range: [400, 1500],
    counterpart: "Shopkeeper",
  },
  {
    words: ["jewelry", "jewellery", "bangles", "earrings", "necklace", "ring"],
    range: [300, 2000],
    counterpart: "Shopkeeper",
  },
];
const BUY_DEFAULT = { range: [500, 1500], counterpart: "Shopkeeper" };

const EARN_KEYWORDS = [
  {
    words: ["salary", "job", "wage", "pay", "offer"],
    range: [50000, 120000],
    counterpart: "Hiring Manager",
  },
  {
    words: ["freelance", "project", "gig", "contract"],
    range: [15000, 60000],
    counterpart: "Client",
  },
  {
    words: ["raise", "increment", "promotion"],
    range: [5000, 25000],
    counterpart: "Manager",
  },
  {
    words: ["tuition", "tutor", "class fee", "lesson"],
    range: [5000, 15000],
    counterpart: "Parent",
  },
];
const EARN_DEFAULT = { range: [10000, 50000], counterpart: "Client" };

function guessItemMeta(name, direction) {
  const lower = name.toLowerCase();
  const table = direction === "buy" ? BUY_KEYWORDS : EARN_KEYWORDS;
  for (const c of table) {
    if (c.words.some((w) => lower.includes(w)))
      return { range: c.range, counterpart: c.counterpart };
  }
  return direction === "buy" ? BUY_DEFAULT : EARN_DEFAULT;
}

const PERSONALITIES = {
  tough: {
    name: "The Tough One",
    desc: "Rarely budges — holds firm on numbers",
    emojiBg: "#7A1F3D",
    avatarEmoji: "😠",
    inflation: [1.6, 1.9],
    marginOverFair: [1.15, 1.25],
    earnOpening: [0.45, 0.55],
    earnCeiling: [0.75, 0.85],
    softness: [0.15, 0.25],
  },
  soft: {
    name: "The Soft-Hearted One",
    desc: "Warm and flexible — moves quickly",
    emojiBg: "#0E7C7B",
    avatarEmoji: "😊",
    inflation: [1.3, 1.5],
    marginOverFair: [1.0, 1.05],
    earnOpening: [0.6, 0.7],
    earnCeiling: [1.0, 1.1],
    softness: [0.4, 0.5],
  },
  sly: {
    name: "The Sly One",
    desc: "Full of excuses and clever tactics",
    emojiBg: "#D98A1F",
    avatarEmoji: "😏",
    inflation: [1.7, 2.0],
    marginOverFair: [1.1, 1.2],
    earnOpening: [0.5, 0.6],
    earnCeiling: [0.85, 0.95],
    softness: [0.25, 0.35],
  },
};

/* =========================================================
   DIALOGUE BANKS
========================================================= */
const DIALOGUE = {
  buy: {
    opening: {
      tough: [
        "This {item} is {price} rupees — final quality, don't ask for less.",
      ],
      soft: [
        "This {item} is lovely, {price} rupees — I can adjust a little for you.",
      ],
      sly: [
        "Honestly, {price} rupees is barely my cost price for this {item}.",
      ],
    },
    counter: {
      tough: [
        "Can't go below {price}, I'd be running a loss.",
        "The best I can do is {price} — not one rupee less.",
      ],
      soft: [
        "Alright, {price} rupees for you — deal?",
        "I'll let it go for {price}, just for you.",
      ],
      sly: [
        "You'll put me out of business! Fine, {price} — just this once.",
        "The next stall charges more — take it at {price}.",
      ],
    },
    excuse: {
      sly: [
        "That really is close to my cost price — my supplier raised rates.",
        "Transport costs went up, that's why it's priced this way.",
      ],
    },
    finalOffer: {
      tough: ["Final word — {price} rupees. Take it or leave it."],
      soft: ["Okay, {price} rupees is my final offer, just for you."],
      sly: ["I really can't go lower than {price} — final."],
    },
    accept: {
      tough: [
        "Fine, deal — {price} rupees.",
        "Alright, deal's done at {price}.",
      ],
      soft: [
        "Deal! {price} rupees — enjoy!",
        "Happy to do business — {price} it is.",
      ],
      sly: [
        "Okay fine, {price} — don't tell anyone I went this low!",
        "Alright, {price} — special discount just for you.",
      ],
    },
    goodOfferAccept: {
      tough: ["That much? Deal at {price}."],
      soft: ["More than enough — deal at {price}!"],
      sly: ["Absolutely, {price} works — you've made my day!"],
    },
  },
  earn: {
    opening: {
      tough: [
        "Our budget for this {item} is {price} — that's what we're working with.",
      ],
      soft: [
        "We'd love to have you — we're thinking {price} for this {item}, and there's room to talk.",
      ],
      sly: [
        "Company policy caps this {item} at {price} right now, unfortunately.",
      ],
    },
    counter: {
      tough: [
        "I can stretch to {price}, but that's close to our ceiling.",
        "The most I can approve right now is {price}.",
      ],
      soft: [
        "Let me push for {price} on your behalf — sound fair?",
        "I can get you to {price}, you've earned it.",
      ],
      sly: [
        "I'll have to fight for this, but let's say {price}.",
        "Between us, I can quietly get you to {price}.",
      ],
    },
    excuse: {
      sly: [
        "Budget approvals are slow right now, that's really holding us back.",
        "It's not me — finance is being strict on numbers this quarter.",
      ],
    },
    finalOffer: {
      tough: ["This is as high as I can go — {price}, final."],
      soft: ["Okay, {price} is the best I can offer — I really tried."],
      sly: ["I genuinely can't push past {price} — that's my final answer."],
    },
    accept: {
      tough: [
        "Alright, {price} — let's finalize it.",
        "Deal — {price}, welcome aboard.",
      ],
      soft: [
        "Wonderful, {price} it is — excited to have you!",
        "Done — {price}, and welcome to the team!",
      ],
      sly: [
        "Okay, {price} — but let's keep this between us.",
        "Fine, {price} — you drive a hard bargain!",
      ],
    },
    goodOfferAccept: {
      tough: ["That works for us — deal at {price}."],
      soft: ["Perfect, {price} is great — deal!"],
      sly: ["That's very reasonable — {price}, deal!"],
    },
  },
};

const NEED_NUMBER = {
  tough: ["Just give me a number — what are you thinking?"],
  soft: ["What number did you have in mind?"],
  sly: ["Come on, name a number — how else will we settle this?"],
};
const WALK_AWAY = {
  tough: ["No problem, maybe another time."],
  soft: ["No worries, the door's always open."],
  sly: ["Wait, don't rush off... alright, fine, go then."],
};

const HINTS = [
  "Never reveal your maximum (or minimum) upfront — leave room to negotiate.",
  "If the other side won't budge, act like you're ready to walk away — it often moves the number.",
  "Ask about bundling or a longer commitment — it's a natural way to justify a better number.",
  "Silence is a tool — after you state your number, stop talking and let them respond first.",
  "Use comparisons — mention what a similar deal elsewhere looks like.",
  "Stay polite but confident — sounding unsure won't get you a better number.",
  "Anchor first if you can — the first number said often shapes where the deal lands.",
  "Offer specific numbers with intent (like 75,000 instead of a round 80,000) — it sounds more deliberate.",
];

/* =========================================================
   STATE
========================================================= */
let state = {};
let recognition = null;
let isListening = false;
let voiceBuffer = "";
let homeDirection = "buy";
let selectedItemData = null;

function newState() {
  return {
    item: null,
    itemLabel: "",
    counterpart: "Shopkeeper",
    direction: "buy",
    mode: null,
    personality: null,
    fairValue: 0,
    openingPrice: 0,
    limitPrice: 0,
    currentPrice: 0,
    round: 1,
    maxRounds: 5,
    dealReached: false,
    dealPrice: null,
    walked: false,
    log: [],
  };
}
function isBuy() {
  return state.direction === "buy";
}

/* =========================================================
   INIT / RENDER STATIC PARTS
========================================================= */
function renderBunting(container, n) {
  container.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const f = document.createElement("div");
    f.className = "flag";
    container.appendChild(f);
  }
}

function initHome() {
  renderBunting(document.getElementById("signboardBunting"), 9);
  document.getElementById("dirOptBuy").onclick = () => switchDirTab("buy");
  document.getElementById("dirOptEarn").onclick = () => switchDirTab("earn");
  renderItemGrid();
  document
    .getElementById("customItemInput")
    .addEventListener("input", onCustomItemInput);
}

function switchDirTab(dir) {
  homeDirection = dir;
  document
    .getElementById("dirOptBuy")
    .classList.toggle("selected", dir === "buy");
  document
    .getElementById("dirOptEarn")
    .classList.toggle("selected", dir === "earn");
  document.getElementById("customItemLabel").textContent =
    dir === "buy"
      ? "Or type something else you want to buy"
      : 'Or type what you\'re negotiating (e.g. "graphic design rate")';
  document.getElementById("customItemInput").placeholder =
    dir === "buy" ? "e.g. leather jacket" : "e.g. UX design contract rate";
  document.getElementById("itemGridHeading").textContent =
    dir === "buy" ? "Pick something to buy" : "Pick an earning scenario";
  document.getElementById("customItemInput").value = "";
  selectedItemData = null;
  document.getElementById("toSetupBtn").disabled = true;
  renderItemGrid();
}

function renderItemGrid() {
  const grid = document.getElementById("itemGrid");
  grid.innerHTML = "";
  const list = homeDirection === "buy" ? BUY_ITEMS : EARN_ITEMS;
  list.forEach((it) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `<span class="emoji">${it.emoji}</span><span class="name">${it.label}</span>`;
    card.onclick = () => selectPresetItem(it, card);
    grid.appendChild(card);
  });
}

function selectPresetItem(it, cardEl) {
  document
    .querySelectorAll(".item-card")
    .forEach((c) => c.classList.remove("selected"));
  cardEl.classList.add("selected");
  document.getElementById("customItemInput").value = "";
  selectedItemData = {
    key: it.key,
    label: it.label,
    range: it.range,
    counterpart: it.counterpart,
    direction: homeDirection,
  };
  document.getElementById("toSetupBtn").disabled = false;
}

function onCustomItemInput(e) {
  const val = e.target.value.trim();
  if (val.length > 1) {
    document
      .querySelectorAll(".item-card")
      .forEach((c) => c.classList.remove("selected"));
    const meta = guessItemMeta(val, homeDirection);
    selectedItemData = {
      key: val.toLowerCase(),
      label: val,
      range: meta.range,
      counterpart: meta.counterpart,
      direction: homeDirection,
    };
    document.getElementById("toSetupBtn").disabled = false;
  } else if (
    val.length === 0 &&
    !document.querySelector(".item-card.selected")
  ) {
    selectedItemData = null;
    document.getElementById("toSetupBtn").disabled = true;
  }
}

function initSetup() {
  const persGrid = document.getElementById("persGrid");
  persGrid.innerHTML = "";
  Object.keys(PERSONALITIES).forEach((key) => {
    const p = PERSONALITIES[key];
    const card = document.createElement("div");
    card.className = "pers-card";
    card.innerHTML = `<div class="pers-avatar" style="background:${p.emojiBg}22;">${p.avatarEmoji}</div>
      <div class="pers-info"><b>${p.name}</b><span>${p.desc}</span></div>`;
    card.onclick = () => {
      document
        .querySelectorAll(".pers-card")
        .forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.personality = key;
      checkEnterBazaarReady();
    };
    persGrid.appendChild(card);
  });

  const modeToggle = document.getElementById("modeToggle");
  modeToggle.innerHTML = `
    <div class="toggle-opt" id="modeOptText"><b>Text Mode</b><span>Type your offers</span></div>
    <div class="toggle-opt" id="modeOptVoice"><b>Voice Mode</b><span>Speak your offers</span></div>
  `;
  document.getElementById("modeOptText").onclick = () => selectMode("text");
  document.getElementById("modeOptVoice").onclick = () => selectMode("voice");
}

function selectMode(m) {
  state.mode = m;
  document
    .getElementById("modeOptText")
    .classList.toggle("selected", m === "text");
  document
    .getElementById("modeOptVoice")
    .classList.toggle("selected", m === "voice");
  checkEnterBazaarReady();
}

function checkEnterBazaarReady() {
  document.getElementById("enterBazaarBtn").disabled = !(
    state.personality && state.mode
  );
}

/* =========================================================
   SCREEN NAV
========================================================= */
function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("screen-" + id);
  target.classList.add("active");

  // naya screen hamesha top se open ho, chahe pichli screen ya
  // is screen ka last scroll position kahin bhi tha
  target.scrollTop = 0;
  requestAnimationFrame(() => {
    target.scrollTop = 0;
  });

  document.getElementById("backBtn").style.display =
    id === "home" ? "none" : "block";
  document.getElementById("histBtnTop").style.display =
    id === "history" ? "none" : "block";
  if (id === "history") renderHistory();
}

function goHome() {
  selectedItemData = null;
  document
    .querySelectorAll(".item-card")
    .forEach((c) => c.classList.remove("selected"));
  const ci = document.getElementById("customItemInput");
  if (ci) ci.value = "";
  document.getElementById("toSetupBtn").disabled = true;
  showScreen("home");
}

function goToSetup() {
  if (!selectedItemData) return;
  state = newState();
  state.item = selectedItemData.key;
  state.itemLabel = selectedItemData.label;
  state.counterpart = selectedItemData.counterpart;
  state.direction = selectedItemData.direction;
  state._range = selectedItemData.range;
  initSetup();
  document.getElementById("enterBazaarBtn").disabled = true;
  showScreen("setup");
}

function goToSetupSameItem() {
  const keep = {
    key: state.item,
    label: state.itemLabel,
    range: state._range,
    counterpart: state.counterpart,
    direction: state.direction,
  };
  state = newState();
  state.item = keep.key;
  state.itemLabel = keep.label;
  state._range = keep.range;
  state.counterpart = keep.counterpart;
  state.direction = keep.direction;
  initSetup();
  document.getElementById("enterBazaarBtn").disabled = true;
  showScreen("setup");
}

/* =========================================================
   NEGOTIATION ENGINE
========================================================= */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function roundSmart(n) {
  if (n < 2000) return Math.round(n / 10) * 10;
  if (n < 20000) return Math.round(n / 50) * 50;
  return Math.round(n / 100) * 100;
}

function startNegotiation() {
  const range = state._range;
  const p = PERSONALITIES[state.personality];
  state.fairValue = roundSmart(rand(range[0], range[1]));

  if (isBuy()) {
    state.openingPrice = roundSmart(
      state.fairValue * rand(p.inflation[0], p.inflation[1]),
    );
    state.limitPrice = roundSmart(
      state.fairValue * rand(p.marginOverFair[0], p.marginOverFair[1]),
    );
    if (state.limitPrice >= state.openingPrice)
      state.limitPrice = roundSmart(state.openingPrice * 0.7);
  } else {
    state.openingPrice = roundSmart(
      state.fairValue * rand(p.earnOpening[0], p.earnOpening[1]),
    );
    state.limitPrice = roundSmart(
      state.fairValue * rand(p.earnCeiling[0], p.earnCeiling[1]),
    );
    if (state.limitPrice <= state.openingPrice)
      state.limitPrice = roundSmart(state.openingPrice * 1.3);
  }
  state.currentPrice = state.openingPrice;
  state.round = 1;
  state.log = [];
  state.dealReached = false;
  state.walked = false;

  renderNegotiateStatic();
 const opening = pickDirLine("opening", state.personality)
  .replace("{item}", state.itemLabel)
  .replace("{price}", state.currentPrice);
pushLog("shop", opening, true);  

  // reset voice state for the fresh round
  voiceBuffer = "";
  lastInterim = "";
  isListening = false;
  if (recognition) {
    try {
      recognition.onend = null;
      recognition.stop();
    } catch (e) {}
    recognition = null;
  }
  const voiceActionsRowEl = document.getElementById("voiceActionsRow");
  if (voiceActionsRowEl) voiceActionsRowEl.classList.remove("show");
  const micBtnEl = document.getElementById("micBtn");
  if (micBtnEl) micBtnEl.classList.remove("listening");
  const micStageEl = document.getElementById("micStage");
  if (micStageEl) micStageEl.classList.remove("listening");
  const listeningTagEl = document.getElementById("listeningTag");
  if (listeningTagEl) listeningTagEl.style.display = "none";

  if (state.mode === "voice") {
    document.getElementById("textModePanel").style.display = "none";
    document.getElementById("voiceModePanel").style.display = "block";
    const vtd = document.getElementById("voiceTranscriptDisplay");
    vtd.value = "";
    vtd.setAttribute("readonly", true);
    setupSpeechRecognition();
  } else {
    document.getElementById("textModePanel").style.display = "block";
    document.getElementById("voiceModePanel").style.display = "none";
  }

  renderRoundUI();
  showScreen("negotiate");
  speakIfVoice(opening);
}

function renderNegotiateStatic() {
  const p = PERSONALITIES[state.personality];
  document.getElementById("shopName").textContent =
    `${p.name.replace("The ", "")} ${state.counterpart}`;
  document.getElementById("shopRole").textContent = p.desc;
  document.getElementById("shopAvatar").innerHTML =
    `<div style="width:100%;height:100%;border-radius:50%;background:${p.emojiBg}22;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2px solid ${p.emojiBg}55;">${p.avatarEmoji}</div>`;
  document.getElementById("itemLabel").textContent = capitalize(
    state.itemLabel,
  );
  document.getElementById("transcript").innerHTML = "";
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickDirLine(bank, personality) {
  const arr =
    DIALOGUE[state.direction][bank][personality] ||
    DIALOGUE[state.direction][bank]["tough"];
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickFlatLine(bank, personality) {
  const arr = bank[personality] || bank["tough"];
  return arr[Math.floor(Math.random() * arr.length)];
}

function pushLog(who, text, skipScroll) {
  state.log.push({ who, text });
  const t = document.getElementById("transcript");
  const div = document.createElement("div");
  div.className = "tmsg " + (who === "shop" ? "shop" : "user");
  div.textContent = text;
  t.appendChild(div);

  if (!skipScroll) {
    const screen = document.getElementById("screen-negotiate");
    setTimeout(() => {
      screen.scrollTop = screen.scrollHeight;
    }, 10);
  }

  if (who === "shop") document.getElementById("shopBubble").textContent = text;
}
function renderRoundUI() {
  const suffix = isBuy() ? "their ask" : "their offer";
  document.getElementById("priceLabel").innerHTML =
    `${state.currentPrice}<small>${suffix}</small>`;
  document.getElementById("roundLabel").textContent =
    `Round ${Math.min(state.round, state.maxRounds)} / ${state.maxRounds}`;
  const tracker = document.getElementById("roundTracker");
  tracker.innerHTML = "";
  for (let i = 1; i <= state.maxRounds; i++) {
    const f = document.createElement("div");
    f.className =
      "rflag" +
      (i < state.round ? " done" : i === state.round ? " current" : "");
    tracker.appendChild(f);
  }
  renderSuggestions();
}

function renderSuggestions() {
  const row = document.getElementById("suggestRow");
  row.innerHTML = "";
  if (state.mode !== "text") {
    row.style.display = "none";
    return;
  }
  row.style.display = "flex";
  let opts;
  if (isBuy()) {
    opts = [
      Math.max(state.fairValue, roundSmart(state.currentPrice * 0.55)),
      roundSmart((state.fairValue + state.limitPrice) / 2),
      roundSmart(state.currentPrice * 0.8),
    ];
  } else {
    opts = [
      roundSmart(state.currentPrice * 1.15),
      roundSmart((state.fairValue + state.limitPrice) / 2),
      roundSmart(state.limitPrice * 0.95),
    ];
  }
  const uniq = [...new Set(opts)].sort((a, b) => a - b);
  uniq.forEach((v) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = isBuy() ? `Offer ${v}` : `Ask for ${v}`;
    chip.onclick = () => {
      document.getElementById("offerInput").value =
        (isBuy() ? "I can give " : "I'm asking for ") + v;
      submitOffer();
    };
    row.appendChild(chip);
  });
}

function extractOfferPrice(text) {
  // Speech-to-text kabhi kabhi filler words ko digits bana deta hai
  // (jaise "for" -> "4", "to" -> "2", "won" -> "1"). Isliye sirf pehla
  // number pakadne ke bajaye, jitne bhi numbers sentence mein milein
  // un mein se sabse bada number hi asli offer maante hain — kyunke
  // asli price in chhote filler digits se hamesha bara hota hai.
  const lower = text.toLowerCase().replace(/,/g, "");
  const regex = /(\d+(?:\.\d+)?)\s*(k\b|thousand\b|lac\b|lakh\b|hundred\b)?/g;
  let match;
  let best = null;
  while ((match = regex.exec(lower)) !== null) {
    let num = parseFloat(match[1]);
    if (isNaN(num)) continue;
    const unit = match[2];
    if (unit === "k" || unit === "thousand") num *= 1000;
    else if (unit === "lac" || unit === "lakh") num *= 100000;
    else if (unit === "hundred") num *= 100;
    if (best === null || num > best) best = num;
  }
  return best !== null ? Math.round(best) : null;
}

function submitOffer() {
  const input = document.getElementById("offerInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  processUserOffer(text);
}

const ACCEPT_WORDS = [
  "deal",
  "okay",
  "ok",
  "agreed",
  "agree",
  "yes",
  "sure",
  "sold",
  "accept",
  "accepted",
  "done",
  "fine",
  "yep",
  "yeah",
];
const REJECT_WORDS = [
  "no deal",
  "not interested",
  "no thanks",
  "never mind",
  "forget it",
  "walk away",
  "i'm out",
  "im out",
  "no way",
  "nope",
  "cancel",
];

function isRejectionPhrase(text) {
  const t = " " + text.toLowerCase() + " ";
  return REJECT_WORDS.some((w) => t.includes(" " + w + " ") || t.includes(w));
}
function isAcceptancePhrase(text) {
  const t = text.toLowerCase();
  if (isRejectionPhrase(text)) return false;
  return ACCEPT_WORDS.some((w) => new RegExp("\\b" + w + "\\b").test(t));
}

function processUserOffer(text) {
  pushLog("user", text);
  const offer = extractOfferPrice(text);
  const p = PERSONALITIES[state.personality];

  if (offer === null) {
    // no number said — check if it's an acceptance/rejection phrase
    // like "ok deal done" or "no deal" instead of just asking again
    if (isRejectionPhrase(text)) {
      finalizeWalk();
      return;
    }
    if (isAcceptancePhrase(text)) {
      const line = pickDirLine("accept", state.personality).replace(
        "{price}",
        state.currentPrice,
      );
      replyShop(line);
      finalizeDeal(state.currentPrice);
      return;
    }
    const line = pickFlatLine(NEED_NUMBER, state.personality);
    replyShop(line);
    return;
  }

  // Final round already given -> this response is accept/reject
  if (state.round > state.maxRounds) {
    const accepted = isBuy()
      ? offer >= state.currentPrice
      : offer <= state.currentPrice;
    if (accepted) finalizeDeal(state.currentPrice);
    else finalizeWalk();
    return;
  }

  const instantGood = isBuy()
    ? offer >= state.currentPrice
    : offer <= state.currentPrice;
  if (instantGood) {
    const line = pickDirLine("goodOfferAccept", state.personality).replace(
      "{price}",
      state.currentPrice,
    );
    replyShop(line);
    finalizeDeal(state.currentPrice);
    return;
  }

  const withinLimit = isBuy()
    ? offer >= state.limitPrice
    : offer <= state.limitPrice;
  if (withinLimit) {
    const acceptPrice = isBuy()
      ? Math.max(offer, state.limitPrice)
      : Math.min(offer, state.limitPrice);
    const line = pickDirLine("accept", state.personality).replace(
      "{price}",
      acceptPrice,
    );
    replyShop(line);
    finalizeDeal(acceptPrice);
    return;
  }

  // not close enough yet
  if (state.round >= state.maxRounds) {
    const finalPrice = isBuy()
      ? Math.max(
          state.limitPrice,
          roundSmart((state.currentPrice + state.limitPrice) / 2),
        )
      : Math.min(
          state.limitPrice,
          roundSmart((state.currentPrice + state.limitPrice) / 2),
        );
    state.currentPrice = finalPrice;
    const line = pickDirLine("finalOffer", state.personality).replace(
      "{price}",
      finalPrice,
    );
    replyShop(line);
    state.round = state.maxRounds + 1;
    renderRoundUI();
    return;
  }

  // sly occasionally throws an excuse instead of moving the number
  if (state.personality === "sly" && state.round === 2 && Math.random() < 0.5) {
    const line = pickDirLine("excuse", "sly");
    replyShop(line);
    state.round += 1;
    renderRoundUI();
    return;
  }

  const step = Math.max(10, Math.round(state.currentPrice * 0.02));

  let isAbsurd = false;
  if (isBuy() && offer < state.limitPrice * 0.5) isAbsurd = true;
  if (!isBuy() && offer > state.limitPrice * 1.5) isAbsurd = true;

  if (isAbsurd) {
    const shocked = isBuy()
      ? `Are you joking? ${offer} is an insult! `
      : `Be realistic. ${offer} is way beyond any budget here! `;
    let newPrice = isBuy()
      ? state.currentPrice - step
      : state.currentPrice + step;
    state.currentPrice = newPrice;
    state.round += 1;
    replyShop(shocked + `The best I can consider is ${newPrice}.`);
    renderRoundUI();
    return;
  }

  const target = isBuy()
    ? Math.max(offer, state.limitPrice)
    : Math.min(offer, state.limitPrice);
  const softness = rand(p.softness[0], p.softness[1]);
  let newPrice = state.currentPrice + (target - state.currentPrice) * softness;

  if (isBuy()) {
    newPrice = Math.max(roundSmart(newPrice), state.limitPrice);
    if (newPrice >= state.currentPrice) newPrice = state.currentPrice - step;
  } else {
    newPrice = Math.min(roundSmart(newPrice), state.limitPrice);
    if (newPrice <= state.currentPrice) newPrice = state.currentPrice + step;
  }
  state.currentPrice = newPrice;
  state.round += 1;
  const line = pickDirLine("counter", state.personality).replace(
    "{price}",
    newPrice,
  );
  replyShop(line);
  renderRoundUI();
}

function replyShop(line) {
  pushLog("shop", line);
  document.getElementById("shopBubble").textContent = line;
  const suffix = isBuy() ? "their ask" : "their offer";
  document.getElementById("priceLabel").innerHTML =
    `${state.currentPrice}<small>${suffix}</small>`;
  speakIfVoice(line);
}

function finalizeDeal(price) {
  state.dealReached = true;
  state.dealPrice = price;
  setTimeout(() => showResult(), 350);
}

function finalizeWalk() {
  const line = pickFlatLine(WALK_AWAY, state.personality);
  replyShop(line);
  state.dealReached = false;
  state.walked = true;
  setTimeout(() => showResult(), 600);
}

/* =========================================================
   HINT
========================================================= */
function showHint() {
  const tip = HINTS[Math.floor(Math.random() * HINTS.length)];
  const toast = document.getElementById("hintToast");
  toast.textContent = "💡 " + tip;
  toast.classList.add("show");
  clearTimeout(window._hintTimer);
  window._hintTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

/* =========================================================
   VOICE MODE (Web Speech API)
   — Continuous listening: mic click shuru karta hai, aur
   jab tak "Done, Send Offer" button na dabao, sunta rehta
   hai (agar browser beech mein khud ruk bhi jaye, ye
   background mein restart karke sunna jaari rakhta hai).
========================================================= */
let lastInterim = "";

function setupSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    const box = document.getElementById("voiceTranscriptDisplay");
    box.textContent =
      "This browser doesn't support voice recognition — try Chrome, or switch to Text Mode.";
    return;
  }
  recognition = new SR();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (e) => {
    let interimChunk = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) {
        voiceBuffer =
          (voiceBuffer ? voiceBuffer + " " : "") + res[0].transcript.trim();
        lastInterim = "";
      } else {
        interimChunk += res[0].transcript;
      }
    }
    lastInterim = interimChunk;
    const box = document.getElementById("voiceTranscriptDisplay");
    // agar user khud is box mein edit kar rahi hai, to uske edits ko
    // overwrite mat karo — sirf tab update karo jab box par focus na ho
    if (document.activeElement !== box) {
      const shown = (
        voiceBuffer + (interimChunk ? " " + interimChunk : "")
      ).trim();
      box.value = shown;
    }
  };

  recognition.onerror = (e) => {
    // ignore no-speech / aborted etc, keep listening —
    // only stop for a genuine permission issue
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      const box = document.getElementById("voiceTranscriptDisplay");
      box.value = "";
      box.placeholder =
        "Mic permission needed — please check your browser settings.";
      isListening = false;
      document.getElementById("micStage").classList.remove("listening");
      document.getElementById("micBtn").classList.remove("listening");
      document.getElementById("listeningTag").style.display = "none";
      document.getElementById("voiceActionsRow").classList.remove("show");
    }
  };

  recognition.onend = () => {
    // agar user ne abhi "Done" nahi dabaya, to khud restart kar do —
    // kai browsers thodi der khamoshi ke baad session khud hi band kar dete hain.
    // Restart se pehle, jo bhi interim (unfinalized) suna tha,
    // usko bhi buffer mein mehfooz kar lo taake beech ka lafz na chhoote.
    if (isListening) {
      if (lastInterim.trim()) {
        voiceBuffer =
          (voiceBuffer ? voiceBuffer + " " : "") + lastInterim.trim();
        lastInterim = "";
      }
      try {
        recognition.start();
      } catch (e) {}
    }
  };
}

function focusTranscriptBox() {
  const box = document.getElementById("voiceTranscriptDisplay");
  box.removeAttribute("readonly");
  box.focus();
  box.select();
}
function toggleListening() {
  if (!recognition) {
    setupSpeechRecognition();
    if (!recognition) return;
  }
  if (!isListening) {
    voiceBuffer = "";
    lastInterim = "";
    try {
      recognition.start();
      isListening = true;
      document.getElementById("micStage").classList.add("listening");
      document.getElementById("micBtn").classList.add("listening");
      document.getElementById("listeningTag").style.display = "inline-flex";
      document.getElementById("voiceActionsRow").classList.add("show");
      const box = document.getElementById("voiceTranscriptDisplay");
      box.value = "";
    } catch (e) {}
  }
  // agar pehle se listening ho rahi hai, dobara mic click par kuch nahi karte —
  // galat sunne par "Clear & Retry", box ko edit karne, aur rokne/bhejne ke
  // liye "Done" button use hoga.
}

function retryListening() {
  voiceBuffer = "";
  lastInterim = "";
  const box = document.getElementById("voiceTranscriptDisplay");
  box.value = "";
  box.blur();
}

function doneListening() {
  isListening = false;
  document.getElementById("voiceActionsRow").classList.remove("show");
  document.getElementById("micStage").classList.remove("listening");
  document.getElementById("micBtn").classList.remove("listening");
  document.getElementById("listeningTag").style.display = "none";
  try {
    if (recognition) recognition.stop();
  } catch (e) {}

  const box = document.getElementById("voiceTranscriptDisplay");
  // box mein jo bhi is waqt dikh raha hai (chahe voice se aaya ho ya
  // manually edit kiya gaya ho) wahi asli offer maana jayega
  const finalText = box.value.trim();
  voiceBuffer = "";
  lastInterim = "";
  box.value = "";

  if (finalText) {
    processUserOffer(finalText);
  }
}

function speakIfVoice(text) {
  if (state.mode !== "voice") return;
  if (!window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.98;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

/* =========================================================
   RESULT + BADGES
========================================================= */
function computeBadge(pct, mode) {
  if (mode === "voice") {
    if (pct >= 30) return { emoji: "🏆", name: "Bargain Master" };
    if (pct >= 12) return { emoji: "👍", name: "Decent Haggler" };
    return { emoji: "😅", name: "Overcharged Newbie" };
  } else {
    if (pct >= 35) return { emoji: "✍️", name: "Sharp Negotiator" };
    if (pct >= 15) return { emoji: "📝", name: "Getting There" };
    return { emoji: "🙂", name: "Needs Practice" };
  }
}

async function showResult() {
  const finalPrice = state.walked ? state.openingPrice : state.dealPrice;
  let pct = 0;
  if (!state.walked) {
    pct = isBuy()
      ? ((state.openingPrice - finalPrice) / state.openingPrice) * 100
      : ((finalPrice - state.openingPrice) / state.openingPrice) * 100;
    pct = Math.max(0, Math.round(pct));
  }

  let emoji, name;
  if (state.walked) {
    emoji = "🚶";
    name = "No Deal";
  } else {
    const b = computeBadge(pct, state.mode);
    emoji = b.emoji;
    name = b.name;
  }

  document.getElementById("resultEmoji").textContent = emoji;
  document.getElementById("resultBadgeName").textContent = name;
  document.getElementById("resultModePill").textContent =
    state.mode === "voice" ? "🎤 VOICE MODE" : "✍️ TEXT MODE";
  document.getElementById("savingsNum").textContent = pct + "%";
  document.getElementById("savingsSub").textContent = isBuy()
    ? "saved off their opening price"
    : "gained above their opening offer";
  document.getElementById("statAsking").textContent = state.openingPrice;
  document.getElementById("statFinal").textContent = state.walked
    ? "—"
    : finalPrice;
  document.getElementById("statRounds").textContent = Math.min(
    state.round,
    state.maxRounds,
  );

  const noteEl = document.getElementById("modeNote");
  if (state.walked) {
    noteEl.textContent =
      "No deal this time — that happens in real negotiations too. Try again and push harder!";
  } else if (state.mode === "voice") {
    noteEl.textContent =
      "🎤 Voice mode is as tough as a real conversation — this badge reflects your real-world negotiating ability more closely!";
  } else {
    noteEl.textContent =
      "✍️ This is your Text Mode score. Speaking out loud is harder in real life — try Voice Mode next!";
  }

  if (!state.walked) launchConfetti();

  await saveToHistory({
    item: state.itemLabel,
    mode: state.mode,
    personality: state.personality,
    direction: state.direction,
    pct,
    badge: name,
    emoji,
    walked: state.walked,
    date: new Date().toISOString(),
  });

  showScreen("result");
}

function launchConfetti() {
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  const emojis = ["🎉", "✨", "🪙", "🎊"];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    s.style.fontSize = 0.9 + Math.random() * 0.8 + "rem";
    wrap.appendChild(s);
  }
  document.getElementById("screen-result").appendChild(wrap);
  setTimeout(() => wrap.remove(), 3000);
}

/* =========================================================
   HISTORY
========================================================= */
const HISTORY_KEY = "haggle_master_history_v2";

async function saveToHistory(entry) {
  let list = [];
  try {
    const raw = await storageGet(HISTORY_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    list = [];
  }
  list.unshift(entry);
  if (list.length > 50) list = list.slice(0, 50);
  await storageSet(HISTORY_KEY, JSON.stringify(list));
}

async function renderHistory() {
  const el = document.getElementById("histList");
  el.innerHTML =
    '<div class="empty-state"><span class="e">⏳</span>Loading...</div>';
  let list = [];
  try {
    const raw = await storageGet(HISTORY_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    list = [];
  }

  if (!list.length) {
    el.innerHTML =
      '<div class="empty-state"><span class="e">🤝</span>No negotiations yet — go complete your first practice round!</div>';
    return;
  }
  el.innerHTML = "";
  list.forEach((h) => {
    const d = new Date(h.date);
    const dateStr = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    const div = document.createElement("div");
    div.className = "hist-item";
    div.innerHTML = `
      <div>
        <div class="hname">${capitalize(h.item)}</div>
        <div class="hl">${h.mode === "voice" ? "Voice" : "Text"} · ${capitalize(h.personality)} · ${dateStr}</div>
      </div>
      <div style="text-align:right;">
        <div class="hpct">${h.walked ? "No deal" : h.pct + "%"}</div>
      </div>`;
    el.appendChild(div);
  });
}

async function clearHistory() {
  if (
    !confirm("Delete your entire negotiation history? This cannot be undone.")
  )
    return;
  await storageDelete(HISTORY_KEY);
  renderHistory();
}

/* =========================================================
   BOOT
========================================================= */
initHome();