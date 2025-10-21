const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3737/api";

export async function fetchPoolStats() {
  const response = await fetch(`${apiUrl}/pool/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch pool stats");
  }
  return response.json();
}
