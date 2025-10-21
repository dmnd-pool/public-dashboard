import {
  Box,
  Typography,
  useTheme,
  Card as MuiCard,
  CardContent,
} from "@mui/material";

const Card = ({
  gridColumn,
  title,
  value,
  description,
  icon: Icon,
  iconColor = "primary",
  variant = "block", // | "stats" | "block"
  elevation = 2,
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const variantStyles = {
    stat: {
      backgroundColor: "background.paper",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 16px 40px rgba(0,0,0,0.25)"
          : "0 16px 40px rgba(15,23,42,0.07)",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      minHeight: {
        xs: 210,
        md: 230,
      },
      display: "flex",
      flexDirection: "column",
    },
    block: {
      justifyContent: "flex-start",
      alignItems: "stretch",
      textAlign: "left",
      flex: "1",
      minWidth: 0,
      borderRadius: 4,
      boxShadow: theme.shadows[elevation],
      display: "flex",
      flexDirection: "column",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 4,
      },
    },
  };
  const cardSx = {
    ...(gridColumn && { gridColumn }),
    ...variantStyles[variant],
    ...sx,
  };

  if (variant === "stat") {
    return (
      <MuiCard elevation={elevation} sx={cardSx} {...props}>
        <CardContent
          sx={{
            height: "100%",
            p: { xs: 4, md: 5 },
            "&:last-child": { pb: { xs: 4, md: 5 } },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
            {Icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Icon color={iconColor} fontSize="small" />
              </Box>
            )}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {title}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              color: "text.primary",
              mb: 3,
            }}
          >
            {value}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: "auto", lineHeight: 1.6 }}
            >
              {description}
            </Typography>
          )}
        </CardContent>
      </MuiCard>
    );
  }

  return (
    <MuiCard
      sx={{
        ...cardSx,
        "& .MuiCardContent-root": {
          padding: theme.spacing(2),
          "&:last-child": {
            paddingBottom: theme.spacing(2),
          },
        },
      }}
      {...props}
    >
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
