import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { evaluate, emptyState, DEFAULT_CONFIG } from "./evaluate.mjs";

const STATE_PATH =
  process.env.STATE_PATH ??
  fileURLToPath(new URL("./state.json", import.meta.url));
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function num(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return n;
}

function loadConfig() {
  return {
    alertPct: num("ALERT_PCT", DEFAULT_CONFIG.alertPct),
    recoverPct: num("RECOVER_PCT", DEFAULT_CONFIG.recoverPct),
    baselineHours: num("BASELINE_HOURS", DEFAULT_CONFIG.baselineHours),
    minHistoryHours: num("MIN_HISTORY_HOURS", DEFAULT_CONFIG.minHistoryHours),
    newNormalHours: num("NEW_NORMAL_HOURS", DEFAULT_CONFIG.newNormalHours),
    failLimit: num("FAIL_LIMIT", DEFAULT_CONFIG.failLimit),
  };
}

function loadState() {
  try {
    return { ...emptyState(), ...JSON.parse(readFileSync(STATE_PATH, "utf8")) };
  } catch {
    return emptyState();
  }
}

// Returns total_hashrate in H/s, or null on any failure. Never logs the URL.
async function fetchHashrate() {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL is not set");
  const headers = {};
  const auth = process.env.API_AUTH_HEADER;
  if (auth) {
    const i = auth.indexOf(":");
    if (i > 0) headers[auth.slice(0, i).trim()] = auth.slice(i + 1).trim();
  }
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/pool/stats`, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      console.error(`Fetch failed: HTTP ${res.status}`);
      return null;
    }
    const value = (await res.json())?.total_hashrate;
    if (typeof value !== "number" || !Number.isFinite(value)) {
      console.error("Fetch failed: total_hashrate is not a finite number");
      return null;
    }
    return value;
  } catch (err) {
    console.error(`Fetch failed: ${err?.name ?? "error"}`);
    return null;
  }
}

async function send(text) {
  if (dryRun) {
    console.log(`[dry-run] ${text}`);
    return;
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set");
  }
  // Error text is built by hand: the request URL contains the token.
  let res;
  try {
    res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    throw new Error(`Telegram send failed: ${err?.name ?? "error"}`);
  }
  if (!res.ok) throw new Error(`Telegram send failed: HTTP ${res.status}`);
}

async function main() {
  if (args.has("--test-message")) {
    await send("DMND hashrate bot connected");
    return;
  }

  const config = loadConfig();
  const reading = await fetchHashrate();
  const { newState, messages } = evaluate(
    loadState(),
    reading,
    Date.now(),
    config,
  );

  // Save before sending so a failed send can't cause the same alert to re-fire.
  writeFileSync(STATE_PATH, JSON.stringify(newState));

  for (const text of messages) await send(text);
  if (messages.length === 0) console.log("No alert.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
