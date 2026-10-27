import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, emptyState, DEFAULT_CONFIG } from "./evaluate.mjs";

const STEP = 10 * 60 * 1000;
const HOUR = 6 * STEP;
const BASE = 1.04e18;

// Simulates a runner: feeds readings one per 10 minutes, collects messages.
function sim(state = emptyState(), t0 = 0) {
  let now = t0;
  const all = [];
  return {
    get state() {
      return state;
    },
    get now() {
      return now;
    },
    run(reading, times = 1) {
      const out = [];
      for (let i = 0; i < times; i++) {
        const r = evaluate(state, reading, now, DEFAULT_CONFIG);
        state = r.newState;
        out.push(...r.messages);
        all.push(...r.messages);
        now += STEP;
      }
      return out;
    },
  };
}

// 3 hours of steady history at BASE (past the 2h warm-up).
function steady() {
  const s = sim();
  s.run(BASE, 18);
  return s;
}

test("warm-up: no alert with less than 2h of history", () => {
  const s = sim();
  s.run(BASE, 6);
  assert.deepEqual(s.run(BASE * 0.5, 5), []);
  assert.equal(s.state.alert, null);
});

test("12% drop produces one DOWN alert", () => {
  const s = steady();
  const msgs = s.run(BASE * 0.88);
  assert.equal(msgs.length, 1);
  assert.match(
    msgs[0],
    /^DMND hashrate DOWN 12\.0%: 915\.20 PH\/s vs 1\.04 EH\/s \(6h median\)$/,
  );
  assert.equal(s.state.alert.direction, "down");
});

test("12% rise produces one UP alert", () => {
  const s = steady();
  const msgs = s.run(BASE * 1.12);
  assert.equal(msgs.length, 1);
  assert.match(msgs[0], /^DMND hashrate UP 12\.0%/);
});

test("9% move produces no alert", () => {
  const s = steady();
  assert.deepEqual(s.run(BASE * 0.91), []);
  assert.deepEqual(s.run(BASE * 1.09), []);
});

test("steady low level in alert sends no repeats", () => {
  const s = steady();
  s.run(BASE * 0.88);
  assert.deepEqual(s.run(BASE * 0.88, 60), []);
});

test("drifting live median does not cause false recovery", () => {
  const s = steady();
  s.run(BASE * 0.88);
  // 6h+ at the low level: the live median fully converges to the low level.
  const msgs = s.run(BASE * 0.88, 40);
  assert.deepEqual(msgs, []);
  assert.notEqual(s.state.alert, null);
  assert.equal(s.state.alert.baseline, BASE);
});

test("return within 5% of frozen baseline produces one recovered message", () => {
  const s = steady();
  s.run(BASE * 0.88);
  s.run(BASE * 0.88, 10);
  const msgs = s.run(BASE * 0.98);
  assert.equal(msgs.length, 1);
  assert.match(
    msgs[0],
    /^DMND hashrate recovered: 1\.02 EH\/s, back within 5% of 1\.04 EH\/s$/,
  );
  assert.equal(s.state.alert, null);
  assert.deepEqual(s.run(BASE * 0.98, 5), []);
});

test("further 10% move from lastLevel produces one update", () => {
  const s = steady();
  s.run(BASE * 0.88);
  const msgs = s.run(BASE * 0.88 * 0.89);
  assert.equal(msgs.length, 1);
  assert.match(
    msgs[0],
    /^DMND hashrate update: now 814\.53 PH\/s, 21\.7% below 1\.04 EH\/s baseline$/,
  );
  assert.deepEqual(s.run(BASE * 0.88 * 0.89, 10), []);
});

test("24h at a new level sends one new-normal message and resets baseline", () => {
  const s = steady();
  s.run(BASE * 0.88);
  const msgs = s.run(BASE * 0.88, 24 * 6);
  assert.equal(msgs.length, 1);
  assert.match(
    msgs[0],
    /^DMND hashrate new normal: 915\.20 PH\/s for 24h, resetting baseline$/,
  );
  assert.equal(s.state.alert, null);
  assert.equal(s.state.readings.length, 1);
});

test("three failures warn once, fourth silent, success says working again", () => {
  const s = steady();
  assert.deepEqual(s.run(null, 2), []);
  const third = s.run(null);
  assert.equal(third.length, 1);
  assert.match(
    third[0],
    /^Hashrate check failing: can't read pool stats for 30 min$/,
  );
  assert.deepEqual(s.run(null), []);
  assert.deepEqual(s.run(BASE), ["Hashrate check working again"]);
  assert.equal(s.state.failures, 0);
  assert.equal(s.state.failureAlerted, false);
});

test("zero hashrate is a valid reading and triggers DOWN", () => {
  const s = steady();
  const msgs = s.run(0);
  assert.equal(msgs.length, 1);
  assert.match(msgs[0], /^DMND hashrate DOWN 100\.0%: 0 H\/s vs 1\.04 EH\/s/);
  assert.equal(s.state.failures, 0);
});
