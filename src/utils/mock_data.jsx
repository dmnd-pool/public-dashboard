// Mock data for Bitcoin mined blocks
export const bitcoinBlocksData = [
  {
    id: 0,
    blockHeight: 867433,
    timeAgo: "Pending",
    miner: "Unknown",
    minerLogo: "https://via.placeholder.com/32x32/95a5a6/ffffff?text=?",
    transactionCount: 2847,
    satsPerVbyte: 52.8,
    blockHash: "Pending...",
    blockSize: "~1.1 MB",
    isPending: true,
  },
  {
    id: 1,
    blockHeight: 867432,
    timeAgo: "2 mins ago",
    miner: "DMND",
    minerLogo: "https://via.placeholder.com/32x32/1f9f2e/ffffff?text=AP",
    transactionCount: 3247,
    satsPerVbyte: 45.2,
    blockHash:
      "00000000000000000002a7c4c2e8af904ed63d47c7683d3ca6040c4ec7b04c42",
    blockSize: "1.2 MB",
  },
  {
    id: 2,
    blockHeight: 867431,
    timeAgo: "12 mins ago",
    miner: "DMND",
    minerLogo: "https://via.placeholder.com/32x32/ff6b35/ffffff?text=FU",
    transactionCount: 2891,
    satsPerVbyte: 38.7,
    blockHash:
      "000000000000000000034f2c8e9af904ed63d47c7683d3ca6040c4ec7b04c89",
    blockSize: "1.1 MB",
  },
  {
    id: 3,
    blockHeight: 867430,
    timeAgo: "18 mins ago",
    miner: "F2Pool",
    minerLogo: "https://via.placeholder.com/32x32/4287f5/ffffff?text=F2",
    transactionCount: 3156,
    satsPerVbyte: 42.1,
    blockHash:
      "00000000000000000001b8c3d2f7ae904ed63d47c7683d3ca6040c4ec7b04d33",
    blockSize: "1.3 MB",
  },
  {
    id: 4,
    blockHeight: 867429,
    timeAgo: "25 mins ago",
    miner: "Binance Pool",
    minerLogo: "https://via.placeholder.com/32x32/f3ba2f/ffffff?text=BP",
    transactionCount: 2743,
    satsPerVbyte: 35.8,
    blockHash:
      "00000000000000000003c9d4e3g8bf904ed63d47c7683d3ca6040c4ec7b04e44",
    blockSize: "0.9 MB",
  },
  {
    id: 5,
    blockHeight: 867428,
    timeAgo: "31 mins ago",
    miner: "ViaBTC",
    minerLogo: "https://via.placeholder.com/32x32/e74c3c/ffffff?text=VB",
    transactionCount: 3089,
    satsPerVbyte: 41.3,
    blockHash:
      "00000000000000000004d0e5f4h9cg904ed63d47c7683d3ca6040c4ec7b04f55",
    blockSize: "1.2 MB",
  },
  {
    id: 6,
    blockHeight: 867427,
    timeAgo: "43 mins ago",
    miner: "DMND",
    minerLogo: "https://via.placeholder.com/32x32/9b59b6/ffffff?text=SP",
    transactionCount: 2654,
    satsPerVbyte: 33.9,
    blockHash:
      "00000000000000000005e1f6g5i0dh904ed63d47c7683d3ca6040c4ec7b05066",
    blockSize: "1.0 MB",
  },
  {
    id: 7,
    blockHeight: 867426,
    timeAgo: "56 mins ago",
    miner: "DMND",
    minerLogo: "https://via.placeholder.com/32x32/2ecc71/ffffff?text=MP",
    transactionCount: 3321,
    satsPerVbyte: 47.6,
    blockHash:
      "00000000000000000006f2g7h6j1ei904ed63d47c7683d3ca6040c4ec7b06177",
    blockSize: "1.4 MB",
  },
  {
    id: 8,
    blockHeight: 867425,
    timeAgo: "1 hr ago",
    miner: "Poolin",
    minerLogo: "https://via.placeholder.com/32x32/34495e/ffffff?text=PL",
    transactionCount: 2987,
    satsPerVbyte: 39.4,
    blockHash:
      "00000000000000000007g3h8i7k2fj904ed63d47c7683d3ca6040c4ec7b07288",
    blockSize: "1.1 MB",
  },
  {
    id: 9,
    blockHeight: 867424,
    timeAgo: "1 hr 14 mins ago",
    miner: "BTC.com",
    minerLogo: "https://via.placeholder.com/32x32/f39c12/ffffff?text=BC",
    transactionCount: 2812,
    satsPerVbyte: 36.7,
    blockHash:
      "00000000000000000008h4i9j8l3gk904ed63d47c7683d3ca6040c4ec7b08399",
    blockSize: "1.0 MB",
  },
];

// Helper function to get mining pool colors
export const getMinerColor = (miner) => {
  const colors = {
    DMND: "#ff6b35",
    F2Pool: "#4287f5",
    "Binance Pool": "#f3ba2f",
    Poolin: "#34495e",
    "BTC.com": "#f39c12",
  };
  return colors[miner] || "#95a5a6";
};

// Helper function to format block time
export const formatBlockTime = (timeAgo) => {
  return timeAgo;
};

// Helper function to format sats per vbyte
export const formatSatsPerVbyte = (sats) => {
  return `${sats} sat/vB`;
};

export const stats = {
  poolUptime: "150 days",
  avgBlockTime: "1 day",
  lastBlockFound: "867,432",
  poolTotalHashrate: "5 EH/s",
  bitcoinPrice: "$124,405",
};

export const currentPoolStats = () => {
  return { total_machines: 150, total_hashrate: 5000000 };
};

export const poolStatsHistory = () => {
  const now = Date.now();
  const fiveMins = 5 * 60 * 1000;

  return [-2, -1, 0].map((i) => ({
    date: new Date(now + i * fiveMins),
    total_machines: (150 + i * 2 + Math.random() * 4) | 0,
    total_hashrate: (5_000_000 + i * 100_000 + Math.random() * 200_000) | 0,
  }));
};
