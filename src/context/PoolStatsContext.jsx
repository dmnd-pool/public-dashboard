import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  fetchPoolHashrateHistory,
  fetchPoolStats as fetchPoolStatsAPI,
} from "../utils/api";

const PoolStatsContext = createContext();
const refreshInterval = 5 * 60 * 1000;
const defaultHistoryTimeframe = "1h";

export const PoolStatsProvider = ({ children }) => {
  const statsRequestIdRef = useRef(0);
  const historyRequestIdRef = useRef(0);
  const historyTimeframeRef = useRef(defaultHistoryTimeframe);
  const [poolStats, setPoolStats] = useState(null);
  const [hashrateHistory, setHashrateHistory] = useState([]);
  const [hashrateHistoryTimeframe, setHashrateHistoryTimeframe] =
    useState(null);
  const [historyTimeframe, setHistoryTimeframe] = useState(
    defaultHistoryTimeframe,
  );
  const [statsLoading, setStatsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [nextRefreshAt, setNextRefreshAt] = useState(
    () => Date.now() + refreshInterval,
  );

  const fetchPoolStats = useCallback(async () => {
    const requestId = ++statsRequestIdRef.current;
    setStatsLoading(true);
    setError(null);

    try {
      const data = await fetchPoolStatsAPI();
      if (requestId !== statsRequestIdRef.current) return;
      setPoolStats(data);
    } catch (err) {
      if (requestId !== statsRequestIdRef.current) return;
      const message = err?.message || "Failed to fetch pool stats";
      setError(message);
      console.error("Error fetching pool stats:", err);
    } finally {
      if (requestId === statsRequestIdRef.current) {
        setStatsLoading(false);
      }
    }
  }, []);

  const fetchHashrateHistory = useCallback(async (timeframe) => {
    const requestId = ++historyRequestIdRef.current;
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const data = await fetchPoolHashrateHistory(timeframe);
      if (requestId !== historyRequestIdRef.current) return;
      setHashrateHistory(data);
      setHashrateHistoryTimeframe(timeframe);
    } catch (err) {
      if (requestId !== historyRequestIdRef.current) return;
      const message = err?.message || "Failed to fetch pool hashrate history";
      setHistoryError(message);
      console.error("Error fetching pool hashrate history:", err);
    } finally {
      if (requestId === historyRequestIdRef.current) {
        setHistoryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    historyTimeframeRef.current = historyTimeframe;
    fetchHashrateHistory(historyTimeframe);
  }, [fetchHashrateHistory, historyTimeframe]);

  useEffect(() => {
    fetchPoolStats();
    setNextRefreshAt(Date.now() + refreshInterval);

    const intervalId = setInterval(() => {
      fetchPoolStats();
      fetchHashrateHistory(historyTimeframeRef.current);
      setNextRefreshAt(Date.now() + refreshInterval);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchHashrateHistory, fetchPoolStats]);

  const value = {
    poolStats,
    hashrateHistory,
    hashrateHistoryTimeframe,
    historyTimeframe,
    setHistoryTimeframe,
    loading: statsLoading || historyLoading,
    error,
    historyError,
    nextRefreshAt,
    fetchPoolStats,
  };

  return (
    <PoolStatsContext.Provider value={value}>
      {children}
    </PoolStatsContext.Provider>
  );
};

export default PoolStatsContext;
