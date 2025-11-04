import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, FormControlLabel, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { poolStatsHistory, currentPoolStats } from "../utils/mock_data";
import { formatHashrate } from "../utils/utils";

const Charts = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [showHashrate, setShowHashrate] = useState(true);
  const [showMachines, setShowMachines] = useState(true);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Load chart data
  useEffect(() => {
    const historic = poolStatsHistory(); // replace with API call
    setData(historic);

    const intervalId = setInterval(
      () => {
        const newData = currentPoolStats(); // replace with API call
        setData((prev) => [
          ...prev,
          { ...newData, date: new Date(new Date().getTime()) },
        ]);
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const futurePoints = 10; // show up to 50 min into future
  const intervalMs = 5 * 60 * 1000; // 5 min
  const lastDate = data[data.length - 1]?.date || new Date();
  const xMin = data[0]?.date || new Date(Date.now() - 15 * 60 * 1000);
  const xMax = new Date(lastDate.getTime() + futurePoints * intervalMs);

  // 2 y-axis showing machines and hashrate
  const yAxis = [];
  if (showMachines) {
    yAxis.push({
      id: "machines",
      label: "Machines",
      position: "left",
      valueFormatter: (value) => `${value}`,
    });
  }
  if (showHashrate) {
    const position = showMachines ? "right" : "left";
    yAxis.push({
      id: "hashrate",
      label: "Hashrate",
      position,
      valueFormatter: (value) => formatHashrate(value, 0),
    });
  }

  // Chart config
  const xAxis = [
    {
      dataKey: "date",
      scaleType: "time",
      min: xMin,
      max: xMax,
      valueFormatter: (date) =>
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      disableLine: true,
    },
  ];

  const series = [
    ...(showHashrate
      ? [
          {
            dataKey: "total_hashrate",
            yAxisId: "hashrate",
            showMark: false,
            color: theme.palette.primary.main,
            valueFormatter: (value) => formatHashrate(value, 0),
          },
        ]
      : []),
    ...(showMachines
      ? [
          {
            dataKey: "total_machines",
            yAxisId: "machines",
            showMark: false,
            color: theme.palette.text.secondary,
            valueFormatter: (value) => `${value}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <Card sx={theme.custom.charts.chartCard}>
        <Box
          sx={{
            padding: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              Hashrate and machines
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={theme.custom.charts.liveIndicator} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                Live
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={showHashrate}
                  onChange={(e) => setShowHashrate(e.target.checked)}
                  size="small"
                  className="chart-primary"
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", color: theme.palette.primary.main }}
                >
                  Hashrate
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showMachines}
                  onChange={(e) => setShowMachines(e.target.checked)}
                  size="small"
                  className="chart-secondary"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#fff" : "#000",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  Machines
                </Typography>
              }
            />
          </Box>
          <Box
            ref={containerRef}
            sx={{
              flexGrow: 1,
              width: "100%",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <LineChart
              dataset={data}
              xAxis={xAxis}
              yAxis={yAxis}
              series={series}
              width={dimensions.width || 600}
              height={Math.max(dimensions.height - 40, 320)}
              margin={{ left: 5, right: 20, top: 20, bottom: 5 }}
              grid={{ vertical: false, horizontal: true }}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "top", horizontal: "right" },
                },
              }}
            />
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default Charts;
