import { createContext, useState, useEffect } from "react";
import { fetchPoolStats as fetchPoolStatsAPI } from "../utils/api";

const PoolStatsContext = createContext();
const refreshInterval = 5 * 60 * 1000;

export const PoolStatsProvider = ({ children }) => {
  const [poolStats, setPoolStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextRefreshAt, setNextRefreshAt] = useState(
    () => Date.now() + refreshInterval,
  );

  const fetchPoolStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPoolStatsAPI();
      setPoolStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch pool stats");
      console.error("Error fetching pool stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolStats();
    setNextRefreshAt(Date.now() + refreshInterval);

    const intervalId = setInterval(() => {
      fetchPoolStats();
      setNextRefreshAt(Date.now() + refreshInterval);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, []);

  const value = {
    poolStats,
    loading,
    error,
    nextRefreshAt,
    fetchPoolStats: fetchPoolStats,
  };

  return (
    <PoolStatsContext.Provider value={value}>
      {children}
    </PoolStatsContext.Provider>
  );
};

export default PoolStatsContext;
