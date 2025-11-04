import { Box } from "@mui/material";

const GridLayout = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(18, 1fr)",
      gridTemplateRows: "repeat(6, auto)",
      gap: 2,
      padding: "5%",
      pt: 0,
      minHeight: "100vh",
    }}
  >
    {children}
  </Box>
);

export default GridLayout;
