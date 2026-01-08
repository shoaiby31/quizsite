import { Card, Typography, Avatar, Box } from "@mui/material";

const InfoCard = ({
  icon,
  label,
  value,
  color = "primary.main",
  transparent = false,
}) => {
  return (
    <Card
      elevation={transparent ? 0 : 2}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        gap: 2,
        borderRadius: 3,
        background: transparent
          ? "rgba(255,255,255,0.35)"
          : "background.paper",
        backdropFilter: transparent ? "blur(10px)" : "none",
        transition: "all 0.25s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: transparent
            ? "0 8px 20px rgba(0,0,0,0.12)"
            : "0 6px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 44,
          height: 44,
          color: "#fff",
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

export default InfoCard;
