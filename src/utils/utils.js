export function formatHashrate(hashrate, precision = 2) {
  if (hashrate === 0) return "0 H/s";
  const units = [
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
}

export function formatTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export function formatUptime(uptimeDays) {
  // round to nearest day
  const days = Math.round(uptimeDays);
  return `${days} day${days !== 1 ? "s" : ""}`;
}
