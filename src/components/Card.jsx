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
      boxShadow: 4,
      padding: 2,
      border: "1px solid #000",
      borderRadius: 2,
      minHeight: {
        md: 150,
        lg: 150,
        xl: 150,
      },
      display: "flex",
      flexDirection: "column",
    },
    block: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
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
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {Icon && <Icon color={iconColor} />}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ textAlign: "end" }}>
            {value}
          </Typography>
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
