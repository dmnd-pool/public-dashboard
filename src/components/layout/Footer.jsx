import {
  Box,
  Typography,
  Link,
  IconButton,
  Container,
  Stack,
} from "@mui/material";
import X from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  const socialLinks = [
    { name: "X", icon: <X />, url: "https://x.com/DEMAND_POOL" },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      url: "https://www.linkedin.com/company/demandpool",
    },
    {
      name: "GitHub",
      icon: <GitHubIcon />,
      url: "https://github.com/demand-open-source",
    },
    {
      name: "SRI",
      icon: <img src="/sri.png" alt="SRI" width={24} />,
      url: "#",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        mt: "auto",
        pt: 6,
        pb: 4,
        px: 3,
        background: (theme) =>
          theme.palette.mode === "dark" ? "#00000050" : "#d8d6d64b",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center">
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.name}
                component={Link}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                sx={{
                  color: "text.secondary",
                  border: "2px solid",
                  borderColor: "divider",
                  width: 48,
                  height: 48,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: "primary.main",
                    transform: "translateY(-4px) scale(1.05)",
                    borderColor: "primary.main",
                  },
                  "&:active": {
                    transform: "translateY(-2px) scale(1.02)",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "1px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
            }}
          />

          <Stack spacing={1} alignItems="center">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                textAlign: "center",
                letterSpacing: "0.5px",
                fontSize: "0.875rem",
              }}
            >
              © {new Date().getFullYear()} DMND. All rights reserved.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
