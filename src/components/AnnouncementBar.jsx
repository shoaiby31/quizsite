import React from "react";
import { Box, Typography } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

const AnnouncementBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#ff9800",
        color: "#fff",
        overflow: "hidden",
        py: 1,
        whiteSpace: "nowrap",
        position: "relative",
        boxShadow: 2,
        my:2,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          animation: "marquee 25s linear infinite",
          pl: "100%",
          "@keyframes marquee": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: "translateX(-100%)",
            },
          },
        }}
      >
        <CampaignIcon sx={{ mr: 1 }} />

        <Typography
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
            },
          }}
        >
          🛠️ Development Update: Version 1.0 is currently 60% complete. Core modules are functional, while additional features and UI enhancements are under development.
        </Typography>
      </Box>
    </Box>
  );
};

export default AnnouncementBar;