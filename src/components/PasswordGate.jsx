import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const dashboardPassword = import.meta.env.VITE_DASHBOARD_PASSWORD;
const authenticationKey = "dmnd-dashboard-authenticated";

const hasActiveSession = () => {
  if (!dashboardPassword) return false;

  try {
    return window.sessionStorage.getItem(authenticationKey) === "true";
  } catch {
    return false;
  }
};

const PasswordGate = ({ children }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(hasActiveSession);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!dashboardPassword) {
      setError("Dashboard password is not configured.");
      return;
    }

    if (password !== dashboardPassword) {
      setError("Incorrect password.");
      return;
    }

    setError("");
    try {
      window.sessionStorage.setItem(authenticationKey, "true");
    } catch {
      // Authentication still works when browser storage is unavailable.
    }
    setIsAuthenticated(true);
  };

  if (isAuthenticated) return children;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={4}
        sx={{ width: "100%", maxWidth: 400, p: 4 }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Dashboard access
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter the password to view the dashboard.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          sx={{ mb: 2 }}
        />
        <Button fullWidth type="submit" variant="contained">
          View dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default PasswordGate;
