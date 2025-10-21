export function formatHashrate(hashrate) {
  console.log("Formatting hashrate:", hashrate);
  const units = [
    { value: 1e12, label: "TH/s" },
    { value: 1e9, label: "GH/s" },
    { value: 1e6, label: "MH/s" },
    { value: 1e3, label: "kH/s" },
    { value: 1, label: "H/s" },
  ];

  for (const unit of units) {
    if (hashrate >= unit.value) {
      return (hashrate / unit.value).toFixed(2) + " " + unit.label;
    }
  }
}
