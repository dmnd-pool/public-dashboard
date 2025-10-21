import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import { PoolStatsProvider } from "./context/PoolStatsContext";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";
import PasswordGate from "./components/PasswordGate";
import { Box } from "@mui/material";

function App() {
  return (
    <ThemeContextProvider>
      <PasswordGate>
        <PoolStatsProvider>
          <Box
            sx={{
              minHeight: "100dvh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header />
            <Router basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Router>
          </Box>
        </PoolStatsProvider>
      </PasswordGate>
    </ThemeContextProvider>
  );
}

export default App;
