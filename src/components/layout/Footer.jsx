import { Box, IconButton, Link, Stack, Typography } from "@mui/material";
import X from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const socialLinks = [
  { name: "X", icon: <X fontSize="small" />, url: "https://x.com/DEMAND_POOL" },
  {
    name: "LinkedIn",
    icon: <LinkedInIcon fontSize="small" />,
    url: "https://www.linkedin.com/company/demandpool",
  },
  {
    name: "GitHub",
    icon: <GitHubIcon fontSize="small" />,
    url: "https://github.com/demand-pool",
  },
  {
    name: "SRI",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}sri.png`}
        alt=""
        width={18}
        height={18}
      />
    ),
    url: "#",
  },
];

const Footer = () => (
  <Box
    component="footer"
    sx={{
      flexShrink: 0,
      borderTop: "0.5px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        minHeight: 56,
        px: { xs: 3, sm: 6, md: 10, lg: 16 },
        py: 2,
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} DMND. All rights reserved.
      </Typography>
      <Stack direction="row" spacing={1}>
        {socialLinks.map((social) => (
          <IconButton
            key={social.name}
            component={Link}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "text.secondary",
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 1,
              "&:hover": {
                color: "primary.main",
                borderColor: "primary.main",
              },
            }}
          >
            {social.icon}
          </IconButton>
        ))}
      </Stack>
    </Box>
  </Box>
);

export default Footer;
