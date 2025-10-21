import { Grid } from "@mui/material";
import { Speed, TrendingDown } from "@mui/icons-material";
import Card from "./Card";
import { usePoolStats } from "../hooks/usePoolStats";
import { formatHashrate } from "../utils/utils";

const Stats = () => {
  const { poolStats } = usePoolStats();

  const statCards = [
    {
      icon: Speed,
      iconColor: "primary",
      title: "Pool Hashrate",
      value: formatHashrate(poolStats?.total_hashrate || 0),
      description:
        "The total hashrate currently in the pool.",
    },
    {
      icon: TrendingDown,
      iconColor: "warning",
      title: "Rejection Rate",
      value: `${poolStats?.rejection_rate || 0}%`,
      description: "The percentage of submitted shares rejected by the pool.",
    },
  ];

  return (
    <Grid container spacing={{ xs: 3, md: 4 }}>
      {statCards.map((card, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          }}
        >
          <Card
            variant="stat"
            icon={card.icon}
            iconColor={card.iconColor}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Stats;
