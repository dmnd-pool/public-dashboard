import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";

function App() {
  return (
    <ThemeContextProvider>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
