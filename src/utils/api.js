const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8787/api";

// create resusable Get request function
async function get(endpoint, params) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return fetch(`${apiUrl}/${endpoint}${query}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        console.error(
          "Request failed with status:",
          response.status,
          response.statusText,
        );
        throw new Error(`Request failed: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

export async function fetchPoolStats() {
  return get(`pool/stats`);
}

export async function fetchPoolHashrateHistory(timeframe = "1h") {
  return get("pool/historical", { timeframe });
}
