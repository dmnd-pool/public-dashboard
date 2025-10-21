import { Box } from "@mui/material";

const GridLayout = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      width: "100%",
      maxWidth: 1600,
      mx: "auto",
      gap: 3,
      px: { xs: 3, sm: 6, md: 10, lg: 16 },
      pt: 0,
      pb: { xs: 4, md: 3 },
    }}
  >
    {children}
  </Box>
);

export default GridLayout;
