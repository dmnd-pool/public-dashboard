import React, { useEffect } from "react";
import {
  Speed,
  TrendingUp,
  TrendingDown,
  AccessTime,
  HubOutlined,
  MonetizationOn,
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
      iconColor: "error",
      title: "Pool Hashrate",
      value: formatHashrate(poolStats?.total_hashrate || 0),
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
        lg: "span 3",
      },
    },
    {
      icon: TrendingUp,
      iconColor: "success",
      title: "Pool Uptime",
      value: stats.poolUptime,
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
        lg: "span 3",
      },
    },
    {
      icon: AccessTime,
      iconColor: "info",
      title: "Next Block Time",
      value: "~2 mins",
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
        lg: "span 3",
      },
    },
    {
      icon: TrendingDown,
      iconColor: "error",
      title: "Rejection Rate",
      value: `${poolStats?.rejection_rate || 0}%`,
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
        lg: "span 3",
      },
    },
    {
      icon: MonetizationOn,
      iconColor: "info",
      title: "Current Slice Fees",
      value: "0.02 BTC",
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
        lg: "span 3",
      },
    },
    {
      icon: HubOutlined,
      iconColor: "success",
      title: "Unique Nodes",
      value: 10,
      gridColumn: {
        xs: "span 9",
        sm: "span 9",
        md: "span 6",
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
