const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8787/api";

// create resusable Get request function
async function get(endpoint) {
  return fetch(`${apiUrl}/${endpoint}`, {
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
