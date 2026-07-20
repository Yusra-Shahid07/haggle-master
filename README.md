# Haggle Master 🤝

**Practice your negotiation skills before the real deal.**

Haggle Master is an AI-powered negotiation trainer that lets you practice bargaining in a safe, judgment-free space. Pick a scenario, choose a personality to negotiate against, and haggle it out — either by typing your offers or speaking them out loud.

The idea came from a simple, everyday frustration: standing at a stall in Lahore, staring at a price tag, wanting to bargain but freezing because I never knew what to say next. Haggle Master turns that moment into low-stakes practice, so the next time it happens for real, you've already got a script running in your head.

---

##  Features

- **Two negotiation modes** — *Buying Something* (haggle down a price) or *Earning Something* (negotiate a salary/rate).
- **Preset scenarios** — cotton shirt, mangoes, taxi fare, leather sandals, job salary offer, freelance rate, salary raise, tutoring fee, and more.
- **Custom items** — type anything you want to negotiate and the app intelligently guesses a fair price range and counterpart based on keywords.
- **Three distinct AI personalities:**
  - 😠 **The Tough One** — rarely budges, holds firm on numbers.
  - 😊 **The Soft-Hearted One** — warm and flexible, moves quickly.
  - 😏 **The Sly One** — full of excuses and clever tactics.
- **Voice or text mode** — speak your offers using the Web Speech API, or type them.
- **Live negotiation engine** — a round-based system that reacts to your offers with counters, excuses, walk-aways, or acceptances, based on the chosen personality's behavior curve.
- **Smart offer detection** — parses numbers out of natural speech/text (handles "k", "thousand", "lakh", etc., and filters out speech-to-text noise).
- **Results & badges** — see how much you saved (or gained), how many rounds it took, and earn a badge like *Bargain Master* or *Sharp Negotiator*.
- **Negotiation history** — every session is saved so you can track your progress over time.
- **In-app hints** — quick tactical tips you can pull up mid-negotiation.

---

##  How the negotiation engine works

1. A **fair value** is randomly generated within a realistic range for the chosen item.
2. Based on the selected **personality**, an **opening price** (inflated for buying, lowballed for earning) and a **limit price** (the AI's true walk-away point) are calculated.
3. Each time you submit an offer:
   - If it's already good enough, the AI accepts immediately.
   - If it's within the AI's limit, a deal is struck at a fair midpoint.
   - If it's too far off, the AI counters, sometimes with a personality-flavored excuse (the Sly One especially).
   - After the max number of rounds, the AI gives a final take-it-or-leave-it offer.
4. Dialogue lines are pulled from personality-specific banks (`opening`, `counter`, `excuse`, `finalOffer`, `accept`, `goodOfferAccept`) so the *same* situation reads differently depending on who you're negotiating with.
5. At the end, your savings percentage is calculated and turned into a badge, and the session is logged to history.

---

## 🎙️ Voice Mode

Voice Mode uses the browser's native **Web Speech API** (`SpeechRecognition` + `speechSynthesis`):
- Continuous listening with automatic restart if the browser session times out.
- Live transcript display that you can edit before sending.
- Text-to-speech playback of the AI's responses for a more realistic back-and-forth.
- Falls back gracefully with a message if the browser doesn't support speech recognition (works best in Chrome).

---

## 🗂️ Project structure

```
├── index.html      # App shell — screens for home, setup, negotiation, result, history
├── styles.css      # Visual styling (referenced, not shown here)
└── app.js          # All app logic: scenarios, personalities, dialogue banks,
                     # negotiation engine, voice mode, history storage
```

### Screens
- **Home** — choose to buy or earn, then pick or type a scenario.
- **Setup** — choose a personality and negotiation mode (voice/text).
- **Negotiate** — the live back-and-forth with round tracker, transcript, and input.
- **Result** — final price, savings %, rounds taken, and badge earned.
- **History** — a saved log of past negotiation attempts.

---

## 💾 Data & storage

History is persisted using a `window.storage` API with a graceful fallback chain:
`window.storage` → `localStorage` → in-memory object — so the app keeps working even in environments where persistent storage isn't available.

---

## 🚀 Running it

Just open `index.html` in a modern browser (Chrome recommended for full voice support). No build step or backend required — everything runs client-side.

---

## 💡 Why it exists

This project is small in scope, but it solves a real, everyday problem: giving people a low-stakes way to build negotiation confidence — whether that's haggling at a stall, negotiating a taxi fare, or asking for a raise.