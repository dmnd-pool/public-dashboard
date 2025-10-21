import { useContext } from "react";
import PoolStatsContext from "../context/PoolStatsContext";

export const usePoolStats = () => {
  const context = useContext(PoolStatsContext);
  if (context === undefined) {
    throw new Error("usePoolStats must be used within a PoolStatsProvider");
  }
  return context;
};
