import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Box, ButtonBase, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePoolStats } from "../hooks/usePoolStats";
import { formatHashrate } from "../utils/utils";

const FIVE_MINUTES = 5 * 60 * 1000;
const HASHRATE_COLOR = "#2b7fff";
const REJECTION_COLOR = "#e67c2a";
const CHART_HISTORY_KEY = "dmnd-pool-performance-history";

const readChartHistory = () => {
  try {
    const history = JSON.parse(
      window.sessionStorage.getItem(CHART_HISTORY_KEY) || "[]",
    );
    if (!Array.isArray(history)) return [];

    return history
      .filter(
        (point) =>
          Number.isFinite(point?.timestamp) &&
          Number.isFinite(point?.total_hashrate) &&
          Number.isFinite(point?.rejection_rate),
      )
      .slice(-60);
  } catch {
    return [];
  }
};

const createDataPoint = (stats) => ({
  total_hashrate: Number(stats.total_hashrate) || 0,
  rejection_rate: Number(stats.rejection_rate) || 0,
  timestamp: Date.now(),
});

const pickTicks = (points) => {
  if (points.length <= 5) return points.map((point) => point.timestamp);
  const last = points.length - 1;
  return Array.from(
    { length: 5 },
    (_, index) => points[Math.round((index * last) / 4)].timestamp,
  );
};

const getHashrateScale = (value) => {
  const scales = [
    { divisor: 1e12, unit: "TH/s" },
    { divisor: 1e9, unit: "GH/s" },
    { divisor: 1e6, unit: "MH/s" },
    { divisor: 1e3, unit: "kH/s" },
  ];
  return (
    scales.find((scale) => value >= scale.divisor) ?? {
      divisor: 1,
      unit: "H/s",
    }
  );
};

const Charts = () => {
  const theme = useTheme();
  const [data, setData] = useState(readChartHistory);
  const [showHashrate, setShowHashrate] = useState(true);
  const [showRejectionRate, setShowRejectionRate] = useState(true);
  const { poolStats, loading, error } = usePoolStats();

  useEffect(() => {
    if (!poolStats) return;
    setData((previous) => {
      const next = [...previous.slice(-59), createDataPoint(poolStats)];
      try {
        window.sessionStorage.setItem(CHART_HISTORY_KEY, JSON.stringify(next));
      } catch {
        // The chart still works when browser storage is unavailable.
      }
      return next;
    });
  }, [poolStats]);

  const peakHashrate = Math.max(
    ...data.map((point) => point.total_hashrate),
    0,
  );
  const scale = getHashrateScale(peakHashrate);
  const ticks = pickTicks(data);
  const firstTimestamp = data[0]?.timestamp ?? Date.now();
  const lastTimestamp = data.at(-1)?.timestamp ?? firstTimestamp;
  const singlePoint = firstTimestamp === lastTimestamp;
  const xDomain = singlePoint
    ? [firstTimestamp - FIVE_MINUTES, lastTimestamp + FIVE_MINUTES]
    : [firstTimestamp, lastTimestamp];
  const latest = data.at(-1);
  const gridColor = theme.palette.mode === "dark" ? "#1f2937" : "#e5e7eb";
  const tickColor = theme.palette.text.secondary;
  const tooltipBackground =
    theme.palette.mode === "dark" ? "#f5f5f5" : "#0a0a0a";
  const tooltipText = theme.palette.mode === "dark" ? "#262626" : "#e5e5e5";

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const metricButton = (label, value, color, enabled, onClick) => (
    <ButtonBase
      onClick={onClick}
      aria-pressed={enabled}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 1,
        p: 0.5,
        opacity: enabled ? 1 : 0.4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{ width: 12, height: 12, borderRadius: "2px", bgcolor: color }}
        />
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {value}
      </Typography>
    </ButtonBase>
  );

  return (
    <Card sx={theme.custom.charts.chartCard}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: { xs: 4, lg: 5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Pool performance
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={theme.custom.charts.liveIndicator} />
            <Typography variant="caption" color="text.secondary">
              Live
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, sm: 6 },
            flexWrap: "wrap",
          }}
        >
          {metricButton(
            "Hashrate",
            formatHashrate(latest?.total_hashrate || 0),
            HASHRATE_COLOR,
            showHashrate,
            () => setShowHashrate((visible) => !visible),
          )}
          {metricButton(
            "Rejection rate",
            `${(latest?.rejection_rate || 0).toFixed(2)}%`,
            REJECTION_COLOR,
            showRejectionRate,
            () => setShowRejectionRate((visible) => !visible),
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {scale.unit}
          </Typography>
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              height: 220,
            }}
          >
            {data.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  {loading
                    ? "Loading chart data…"
                    : error
                      ? "Unable to load chart data."
                      : "No chart data available."}
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="hashrate-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={HASHRATE_COLOR}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="100%"
                        stopColor={HASHRATE_COLOR}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="rejection-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={REJECTION_COLOR}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="100%"
                        stopColor={REJECTION_COLOR}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    syncWithTicks
                    stroke={gridColor}
                    strokeWidth={0.5}
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={xDomain}
                    ticks={ticks}
                    interval={0}
                    tickFormatter={formatTime}
                    axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fill: tickColor, fontSize: 12 }}
                    tickMargin={8}
                  />
                  {showHashrate && (
                    <YAxis
                      yAxisId="hashrate"
                      tickFormatter={(value) =>
                        (value / scale.divisor).toFixed(1)
                      }
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: tickColor, fontSize: 12 }}
                      width={46}
                      tickMargin={16}
                      domain={[0, "auto"]}
                    />
                  )}
                  {showRejectionRate && (
                    <YAxis
                      yAxisId="rejection"
                      orientation="right"
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: tickColor, fontSize: 12 }}
                      width={46}
                      tickMargin={16}
                      domain={[0, "auto"]}
                    />
                  )}
                  <Tooltip
                    cursor={{
                      stroke: HASHRATE_COLOR,
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <Box
                          sx={{
                            bgcolor: tooltipBackground,
                            color: tooltipText,
                            borderRadius: 3,
                            px: 4,
                            py: 3,
                            boxShadow: 8,
                          }}
                        >
                          <Typography variant="caption" sx={{ opacity: 0.75 }}>
                            {formatTime(label)}
                          </Typography>
                          {payload.map((entry) => (
                            <Box
                              key={entry.dataKey}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 4,
                                mt: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "2px",
                                    bgcolor: entry.color,
                                  }}
                                />
                                <Typography variant="body2">
                                  {entry.name}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {entry.dataKey === "total_hashrate"
                                  ? formatHashrate(Number(entry.value))
                                  : `${Number(entry.value).toFixed(2)}%`}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      );
                    }}
                  />
                  {singlePoint && showHashrate && latest && (
                    <ReferenceLine
                      yAxisId="hashrate"
                      y={latest.total_hashrate}
                      stroke={HASHRATE_COLOR}
                      strokeWidth={4}
                      ifOverflow="extendDomain"
                    />
                  )}
                  {singlePoint && showRejectionRate && latest && (
                    <ReferenceLine
                      yAxisId="rejection"
                      y={latest.rejection_rate}
                      stroke={REJECTION_COLOR}
                      strokeWidth={4}
                      ifOverflow="extendDomain"
                    />
                  )}
                  {showHashrate && (
                    <Area
                      yAxisId="hashrate"
                      type="monotone"
                      dataKey="total_hashrate"
                      name="Hashrate"
                      stroke={HASHRATE_COLOR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="url(#hashrate-fill)"
                      dot={
                        singlePoint
                          ? { r: 5, fill: HASHRATE_COLOR, strokeWidth: 0 }
                          : false
                      }
                      activeDot={{
                        r: 10,
                        fill: HASHRATE_COLOR,
                        stroke: "#fff",
                        strokeWidth: 4,
                      }}
                    />
                  )}
                  {showRejectionRate && (
                    <Area
                      yAxisId="rejection"
                      type="monotone"
                      dataKey="rejection_rate"
                      name="Rejection rate"
                      stroke={REJECTION_COLOR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="url(#rejection-fill)"
                      dot={
                        singlePoint
                          ? { r: 4, fill: REJECTION_COLOR, strokeWidth: 0 }
                          : false
                      }
                      activeDot={{
                        r: 10,
                        fill: REJECTION_COLOR,
                        stroke: "#fff",
                        strokeWidth: 4,
                      }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default Charts;
