import GridLayout from "../components/layout/GridLayout";
import Stats from "../components/Stats";
import Footer from "../components/layout/Footer";
import { Box, Chip, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function Dashboard() {
  return (
    <Box
      component="main"
      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <GridLayout>
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
            py: { xs: 8, sm: 12, md: 16 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          <Box sx={{ maxWidth: 680 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "2.75rem" },
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "text.primary",
                mb: 3,
              }}
            >
              DMND pool at a glance
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.7 }}
            >
              A current snapshot of the pool’s total hashrate and share
              rejection rate. Values are refreshed automatically every five
              minutes.
            </Typography>
          </Box>

          <Stats />
        </Box>
      </GridLayout>
      <Footer />
    </Box>
  );
}
