import Card from "@mui/material/Card";
import {
  Alert,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePoolStats } from "../hooks/usePoolStats";
import { formatHashrate } from "../utils/utils";

const HASHRATE_COLOR = "#2b7fff";
const HISTORY_RANGES = [
  { label: "1H", timeframe: "1h", durationMs: 60 * 60 * 1000 },
  { label: "24H", timeframe: "24h", durationMs: 24 * 60 * 60 * 1000 },
  { label: "7D", timeframe: "7d", durationMs: 7 * 24 * 60 * 60 * 1000 },
];

const normalizeHashrateHistory = (history) =>
  history
    .map((point) => ({
      timestamp: Date.parse(point.observed_at),
      total_hashrate: Number(point.total_hashrate),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.timestamp) &&
        Number.isFinite(point.total_hashrate),
    );

const createTimeTicks = (start, end, tickCount) =>
  Array.from(
    { length: tickCount },
    (_, index) => start + ((end - start) * index) / (tickCount - 1),
  );

const downsampleData = (points, maxPoints = 1000) => {
  if (points.length <= maxPoints) return points;

  const latest = points.at(-1);
  const historicalPoints = points.slice(0, -1);
  const bucketSize = Math.ceil(historicalPoints.length / (maxPoints - 1));
  const sampled = [];
  for (let index = 0; index < historicalPoints.length; index += bucketSize) {
    const bucket = historicalPoints.slice(index, index + bucketSize);
    sampled.push({
      timestamp: bucket.at(-1).timestamp,
      total_hashrate:
        bucket.reduce((sum, point) => sum + point.total_hashrate, 0) /
        bucket.length,
    });
  }
  return [...sampled, latest];
};

const getYAxis = (maximum) => {
  if (!Number.isFinite(maximum) || maximum <= 0) {
    return { domainMaximum: 1, ticks: [] };
  }
  const quarter = maximum / 4;
  const magnitude = 10 ** Math.floor(Math.log10(quarter));
  const step = Math.ceil(quarter / magnitude) * magnitude;
  return {
    domainMaximum: step * 4,
    ticks: [1, 2, 3, 4].map((multiplier) => multiplier * step),
  };
};

const Charts = () => {
  const theme = useTheme();
  const compactAxis = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    poolStats,
    hashrateHistory,
    hashrateHistoryTimeframe,
    historyTimeframe,
    setHistoryTimeframe,
    loading,
    error,
    historyError,
  } = usePoolStats();
  const selectedRange =
    HISTORY_RANGES.find((range) => range.timeframe === historyTimeframe) ??
    HISTORY_RANGES[0];
  const rangeEnd = Date.now();
  const rangeStart = rangeEnd - selectedRange.durationMs;
  const historicalData =
    hashrateHistoryTimeframe === historyTimeframe
      ? normalizeHashrateHistory(hashrateHistory)
      : [];
  const latestHashrate = Number(poolStats?.total_hashrate);
  const chartData = Number.isFinite(latestHashrate)
    ? [
        ...historicalData,
        { timestamp: rangeEnd, total_hashrate: latestHashrate },
      ]
    : historicalData;
  const rawData = chartData.filter(
    (point) => point.timestamp >= rangeStart && point.timestamp <= rangeEnd,
  );
  const data = downsampleData(rawData);

  const peakHashrate = Math.max(
    ...data.map((point) => point.total_hashrate),
    0,
  );
  const yAxis = getYAxis(peakHashrate);
  const ticks = createTimeTicks(rangeStart, rangeEnd, compactAxis ? 3 : 5);
  const firstTimestamp = data[0]?.timestamp ?? Date.now();
  const lastTimestamp = data.at(-1)?.timestamp ?? firstTimestamp;
  const singlePoint = firstTimestamp === lastTimestamp;
  const xDomain = [rangeStart, rangeEnd];
  const hasSamples = data.length > 0;
  const gridColor = theme.palette.mode === "dark" ? "#1f2937" : "#e5e7eb";
  const tickColor = theme.palette.text.secondary;
  const tooltipBackground =
    theme.palette.mode === "dark" ? "#f5f5f5" : "#0a0a0a";
  const tooltipText = theme.palette.mode === "dark" ? "#262626" : "#e5e5e5";

  const formatAxisTick = (timestamp) => {
    if (historyTimeframe === "1h") {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    if (historyTimeframe === "24h") {
      return new Date(timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

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
            flexWrap: "wrap",
            mb: 10,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Pool hashrate
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={historyTimeframe}
              onChange={(_, timeframe) => {
                if (timeframe !== null) setHistoryTimeframe(timeframe);
              }}
              aria-label="Chart history range"
              sx={{
                bgcolor: "action.hover",
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 0.5,
                "& .MuiToggleButtonGroup-grouped": {
                  border: 0,
                  borderRadius: "2px !important",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  lineHeight: 1.25,
                  textTransform: "none",
                },
                "& .Mui-selected": {
                  bgcolor: "background.paper !important",
                  color: "text.primary !important",
                  boxShadow:
                    "0 8px 20px -6px rgba(0,0,0,0.08), 0 3px 8px -4px rgba(0,0,0,0.08)",
                },
              }}
            >
              {HISTORY_RANGES.map((range) => (
                <ToggleButton
                  key={range.timeframe}
                  value={range.timeframe}
                  aria-label={`${range.label} history`}
                  sx={{ minWidth: 36, px: 1, py: 0.5 }}
                >
                  {range.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {loading && (
              <Box
                role="status"
                aria-live="polite"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CircularProgress size={14} thickness={5} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Loading…
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {hasSamples && (error || historyError) && (
          <Alert severity="warning" variant="outlined">
            {error && historyError
              ? "Could not refresh data. Showing the last successful readings."
              : error
                ? "Could not refresh data. Showing the last successful readings."
                : "Could not fetch hashrate for this range."}
          </Alert>
        )}

        {loading && !hasSamples ? (
          <Box
            sx={{
              width: "100%",
              height: 220,
              bgcolor: "action.hover",
              animation: "chart-pulse 1.5s ease-in-out infinite",
              "@keyframes chart-pulse": {
                "0%, 100%": { opacity: 0.45 },
                "50%": { opacity: 0.9 },
              },
            }}
          />
        ) : !hasSamples ? (
          <Box
            sx={{
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {error || historyError ? "Unable to load data" : "No data yet"}
            </Typography>
            <Typography variant="body2">
              {error || historyError
                ? "Could not fetch data for this range."
                : "No data available for this range yet."}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  height: 220,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{
                      top: 8,
                      right: historyTimeframe === "24h" ? 56 : 16,
                      left: 0,
                      bottom: 0,
                    }}
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
                      axisLine={{
                        stroke: theme.palette.divider,
                        strokeWidth: 1,
                      }}
                      tickLine={false}
                      tick={{ fill: tickColor, fontSize: 12 }}
                      tickFormatter={formatAxisTick}
                      tickMargin={8}
                    />
                    <YAxis
                      yAxisId="hashrate"
                      tickFormatter={(value) => formatHashrate(value, 1)}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: tickColor, fontSize: 12 }}
                      width={76}
                      tickMargin={16}
                      domain={[0, yAxis.domainMaximum]}
                      ticks={yAxis.ticks}
                    />
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
                            <Typography
                              variant="caption"
                              sx={{ opacity: 0.75 }}
                            >
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
                                  {formatHashrate(Number(entry.value))}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        );
                      }}
                    />
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
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
};

export default Charts;
