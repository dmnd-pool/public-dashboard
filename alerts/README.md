# Hashrate alert bot

Checks the DMND pool's total hashrate every 10 minutes (GitHub Actions) and sends a Telegram message when it moves about 10% from its recent baseline. It sends nothing while things are normal.

State (recent readings, alert status) lives in the Actions cache, not in git, so the pool's hashrate history is never published.

## Files

- `hashrate-alert.mjs` — fetch, evaluate, send, save state
- `evaluate.mjs` — pure decision logic
- `evaluate.test.mjs` — tests (`node --test alerts/`)
- `../.github/workflows/hashrate-alert.yml` — schedule

## Setup

1. **Bot token.** Create a bot with [@BotFather](https://t.me/BotFather) (`/newbot`), or reuse the existing DMND bot token.
2. **Chat ID.** Send any message to the bot (or add it to the target group and post there), then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and read `message.chat.id`. Group IDs are negative.
3. **Secrets.** In the repo go to Settings > Secrets and variables > Actions and add:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

   The API URL reuses the existing `VITE_API_URL` repository variable.

4. **Verify.** Actions > "Hashrate alert" > Run workflow with `test_message` checked. The chat should receive "DMND hashrate bot connected".

## Alert behaviour

- Baseline is the median of readings from the last `BASELINE_HOURS`. No alerts until `MIN_HISTORY_HOURS` of history exists.
- A move of `ALERT_PCT` or more from the baseline sends an UP/DOWN alert.
- While in alert, the baseline is frozen. Recovery means coming back within `RECOVER_PCT` of it. A further `ALERT_PCT` move from the last reported level sends an update.
- After `NEW_NORMAL_HOURS` in alert at a stable level, the bot accepts it as the new normal and rebuilds the baseline.
- `FAIL_LIMIT` consecutive failed fetches send one warning, and one message when it recovers. A hashrate of `0` is a valid reading (pool down), not a failure.

Environment variables with defaults: `ALERT_PCT=10`, `RECOVER_PCT=5`, `BASELINE_HOURS=6`, `MIN_HISTORY_HOURS=2`, `NEW_NORMAL_HOURS=24`, `FAIL_LIMIT=3`. Optional `API_AUTH_HEADER` (e.g. `Authorization: Bearer xyz`) is sent with the stats request if the endpoint is ever locked.

## Testing locally

```bash
node --test alerts/
API_URL=<api base url> node alerts/hashrate-alert.mjs --dry-run
```

`--dry-run` prints messages instead of sending them but still reads and writes `alerts/state.json` (git-ignored). `--test-message` sends one test message and exits.

## Known limitations

- GitHub cron often runs late, sometimes 10 to 30 minutes, so alerts can lag. The median is computed by timestamp, so the logic itself is unaffected. The "failing for 30 min" wording assumes the nominal 10-minute interval.
- GitHub disables scheduled workflows in public repos after 60 days without repo activity. GitHub emails the repo owner before it does this. If alerts go quiet, check the Actions tab first.
