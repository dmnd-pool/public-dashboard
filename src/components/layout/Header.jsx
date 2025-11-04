import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Link,
  Fab,
  Tooltip,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "../../hooks/useTheme";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleTheme } = useThemeMode();

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          width: "100%",
          maxWidth: "100%",
          pt: "4%",
          px: "4%",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="https://dmnd.work " underline="none" target="_blank">
              <img
                src="/logo.svg"
                alt="Logo"
                style={{
                  height: isMobile ? "40px" : "80px",
                  width: "auto",
                }}
              />
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          </Box>
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
