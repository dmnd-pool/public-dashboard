import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Link,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  AccessTimeRounded,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useThemeMode } from "../../hooks/useTheme";
import { usePoolStats } from "../../hooks/usePoolStats";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleTheme } = useThemeMode();
  const { nextRefreshAt } = usePoolStats();
  const [now, setNow] = useState(Date.now());
  const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const secondsUntilRefresh = Math.max(
    0,
    Math.ceil((nextRefreshAt - now) / 1000),
  );
  const countdown = `${String(Math.floor(secondsUntilRefresh / 60)).padStart(2, "0")}:${String(secondsUntilRefresh % 60).padStart(2, "0")}`;

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          width: "100%",
          maxWidth: "100%",
          pt: 2,
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: 1600,
            mx: "auto",
            justifyContent: "space-between",
            px: { xs: 3, sm: 6, md: 10, lg: 16 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="https://dmnd.work " underline="none" target="_blank">
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  height: isMobile ? "36px" : "48px",
                  width: "auto",
                }}
              />
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <AccessTimeRounded sx={{ fontSize: 18 }} />
            <Typography variant="caption">
              {isMobile ? countdown : `Next refresh in ${countdown}`}
            </Typography>
          </Box>

          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <Link
                href="https://dashboard.dmnd.work/"
                color="inherit"
                underline="none"
                target="_blank"
              >
                + Connect
              </Link>
            </Button> 
          </Box> */}
        </Toolbar>
      </AppBar>

      <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
        <Fab
          onClick={toggleTheme}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            backgroundColor: mode === "light" ? "#9c9b9b" : "#d21919",
            color: "white",
            "&:hover": {
              backgroundColor: mode === "light" ? "#7a7a7a" : "#b01818",
            },
            zIndex: 1000,
          }}
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </Fab>
      </Tooltip>
    </>
  );
};

export default Header;
