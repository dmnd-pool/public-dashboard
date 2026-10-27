const HOUR_MS = 60 * 60 * 1000;

export const DEFAULT_CONFIG = {
  alertPct: 10,
  recoverPct: 5,
  baselineHours: 6,
  minHistoryHours: 2,
  newNormalHours: 24,
  failLimit: 3,
};

export function emptyState() {
  return { readings: [], alert: null, failures: 0, failureAlerted: false };
}

export function formatHashrate(hashrate, precision = 2) {
  if (hashrate === 0) return "0 H/s";
  const units = [
    { value: 1e18, label: "EH/s" },
    { value: 1e15, label: "PH/s" },
    { value: 1e12, label: "TH/s" },
    { value: 1e9, label: "GH/s" },
    { value: 1e6, label: "MH/s" },
    { value: 1e3, label: "kH/s" },
    { value: 1, label: "H/s" },
  ];
  for (const unit of units) {
    if (hashrate >= unit.value) {
      return (hashrate / unit.value).toFixed(precision) + " " + unit.label;
    }
  }
  return hashrate.toFixed(precision) + " H/s";
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const pct = (x) => (Math.abs(x) * 100).toFixed(1) + "%";

/**
 * Pure decision logic.
 * @param state   persisted state (not mutated)
 * @param reading current total_hashrate in H/s, or null if the fetch failed
 * @param now     ms timestamp
 * @param config  thresholds (see DEFAULT_CONFIG)
 * @returns {{ newState, messages: string[] }}
 */
export function evaluate(state, reading, now, config = DEFAULT_CONFIG) {
  const c = { ...DEFAULT_CONFIG, ...config };
  const s = {
    ...emptyState(),
    ...state,
    readings: [...(state?.readings ?? [])],
    alert: state?.alert ? { ...state.alert } : null,
  };
  const messages = [];

  if (reading === null || !Number.isFinite(reading)) {
    s.failures += 1;
    if (s.failures >= c.failLimit && !s.failureAlerted) {
      messages.push(
        `Hashrate check failing: can't read pool stats for ${s.failures * 10} min`,
      );
      s.failureAlerted = true;
    }
    return { newState: s, messages };
  }

  if (s.failureAlerted) messages.push("Hashrate check working again");
  s.failures = 0;
  s.failureAlerted = false;

  s.readings = s.readings.filter((r) => now - r.t <= c.baselineHours * HOUR_MS);
  const current = { t: now, h: reading };

  const warmingUp =
    s.readings.length === 0 ||
    now - s.readings[0].t < c.minHistoryHours * HOUR_MS;
  if (warmingUp) {
    s.readings.push(current);
    return { newState: s, messages };
  }

  const baseline = median(s.readings.map((r) => r.h));
  const win = `${c.baselineHours}h`;

  if (!s.alert) {
    if (baseline > 0) {
      const change = (reading - baseline) / baseline;
      if (Math.abs(change) >= c.alertPct / 100) {
        const direction = change < 0 ? "down" : "up";
        messages.push(
          `DMND hashrate ${direction.toUpperCase()} ${pct(change)}: ${formatHashrate(reading)} vs ${formatHashrate(baseline)} (${win} median)`,
        );
        s.alert = { since: now, baseline, lastLevel: reading, direction };
      }
    }
  } else {
    const { baseline: frozen, lastLevel, since } = s.alert;
    const fromFrozen = (reading - frozen) / frozen;
    if (Math.abs(fromFrozen) < c.recoverPct / 100) {
      messages.push(
        `DMND hashrate recovered: ${formatHashrate(reading)}, back within ${c.recoverPct}% of ${formatHashrate(frozen)}`,
      );
      s.alert = null;
    } else if (
      lastLevel > 0
        ? Math.abs(reading - lastLevel) / lastLevel >= c.alertPct / 100
        : reading > 0
    ) {
      messages.push(
        `DMND hashrate update: now ${formatHashrate(reading)}, ${pct(fromFrozen)} ${fromFrozen < 0 ? "below" : "above"} ${formatHashrate(frozen)} baseline`,
      );
      s.alert.lastLevel = reading;
    } else if (now - since >= c.newNormalHours * HOUR_MS) {
      messages.push(
        `DMND hashrate new normal: ${formatHashrate(reading)} for ${c.newNormalHours}h, resetting baseline`,
      );
      s.alert = null;
      s.readings = [];
    }
  }

  s.readings.push(current);
  return { newState: s, messages };
}
