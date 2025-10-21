import React, { useEffect } from "react";
import {
  Speed,
  TrendingUp,
  TrendingDown,
  Group,
  ViewQuilt,
} from "@mui/icons-material";
import { stats } from "../utils/mock_data";
import Card from "./Card";

import { fetchPoolStats } from "../utils/api";
import { formatHashrate } from "../utils/utils";

const Stats = () => {
  let [poolStats, setPoolStats] = React.useState(null);
  useEffect(() => {
    fetchPoolStats().then((data) => {
      setPoolStats(data);
    });
  }, []);

  const statCards = [
    {
      icon: Speed,
      iconColor: "primary",
      title: "Pool Hashrate",
      value: formatHashrate(poolStats?.total_hashrate || 0),
      gridColumn: {
        xs: "span 7",
        sm: "span 7",
        md: "span 3",
        lg: "span 3",
      },
    },
    {
      icon: TrendingUp,
      iconColor: "success",
      title: "Pool Uptime",
      value: stats.poolUptime,
      gridColumn: {
        xs: "span 8",
        sm: "span 8",
        md: "span 3",
        lg: "span 3",
      },
    },
    {
      icon: Group,
      iconColor: "info",
      title: "Total Users",
      value: poolStats?.total_users || 0,
      gridColumn: {
        xs: "span 15",
        sm: "span 15",
        md: "span 3",
        lg: "span 3",
      },
    },
    {
      icon: ViewQuilt,
      iconColor: "warning",
      title: "Last Block Found",
      value: stats.lastBlockFound,
      gridColumn: {
        xs: "span 7",
        sm: "span 7",
        md: "span 3",
        lg: "span 3",
      },
    },
    {
      icon: TrendingDown,
      iconColor: "success",
      title: "Rejection Rate",
      value: `${poolStats?.rejection_rate || 0}%`,
      gridColumn: {
        xs: "span 8",
        sm: "span 8",
        md: "span 3",
        lg: "span 3",
      },
    },
  ];

  return (
    <>
      {statCards.map((card, index) => (
        <Card
          key={index}
          variant="stat"
          icon={card.icon}
          iconColor={card.iconColor}
          title={card.title}
          value={card.value}
          gridColumn={card.gridColumn}
        />
      ))}
    </>
  );
};

export default Stats;
