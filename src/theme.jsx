import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#bc0505",
      },
      secondary: {
        main: mode === "light" ? "#f5f5f5" : "#424242",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#121212",
        paper: mode === "light" ? "#fafafa" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#222222" : "#ffffff",
        secondary: mode === "light" ? "#555555" : "#b0b0b0",
      },
      pending: {
        main: mode === "light" ? "#bc0505" : "#666666",
      },
    },
    typography: {
      fontFamily:
        '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
      h5: {
        fontWeight: 600,
        color: mode === "light" ? "#8B0000" : "#c5c3c3",
      },
    },
    spacing: 4,
    components: {
      MuiTypography: {
        variants: [
          {
            props: { variant: "blockTitle" },
            style: ({ theme }) => ({
              fontWeight: "bold",
              color: "white",
              fontSize: "0.75rem",
              [theme.breakpoints.up("lg")]: {
                fontSize: "0.65rem",
              },
              [theme.breakpoints.up("xl")]: {
                fontSize: "0.65rem",
              },
            }),
          },
          {
            props: { variant: "blockCaption" },
            style: {
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.6rem",
            },
          },
          {
            props: { variant: "blockTime" },
            style: ({ theme }) => ({
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.6rem",
              [theme.breakpoints.up("sm")]: {
                fontSize: "0.55rem",
              },
              [theme.breakpoints.up("lg")]: {
                fontSize: "0.53rem",
              },
              [theme.breakpoints.up("xl")]: {
                fontSize: "0.53rem",
              },
            }),
          },
          {
            props: { variant: "blockMiner" },
            style: ({ theme }) => ({
              fontWeight: 500,
              color: "white",
              fontSize: "0.6rem",
              [theme.breakpoints.up("sm")]: {
                fontSize: "0.7rem",
              },
              [theme.breakpoints.up("lg")]: {
                fontSize: "0.6rem",
              },
              [theme.breakpoints.up("xl")]: {
                fontSize: "0.55rem",
              },
            }),
          },
        ],
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 20px",
          },
        },
      },
    },
    // Custom styles
    custom: {
      block: {
        iconSize: {
          xs: "0.6rem",
          sm: "0.6rem",
          lg: "0.55rem",
          xl: "0.55rem",
        },
        avatarSize: {
          xs: 12,
          sm: 14,
          lg: 12,
          xl: 10,
        },
        dividerColor: "rgba(255,255,255,0.2)",
        pendingAnimation: {
          animation: "blink 1.5s infinite",
          "@keyframes blink": {
            "20%": { opacity: 0.5 },
            "50%": { opacity: 0.3 },
            "80%": { opacity: 0.7 },
          },
        },
      },
      charts: {
        chartCard: {
          gridColumn: {
            xs: "span 18",
            sm: "span 18",
            md: "span 18",
            lg: "span 18",
          },
          padding: 2,
          mt: 5,
          boxShadow: 4,
          height: 550,
        },
        liveIndicator: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "success.main",
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.4 },
            "100%": { opacity: 1 },
          },
        },
      },
    },
  });
