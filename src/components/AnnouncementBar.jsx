import React, { useEffect, useRef } from "react";
import { Box, Typography, Chip } from "@mui/material";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

const AnnouncementBar = () => {
  const titleRef = useRef(null);
  
    useEffect(() => {
      if (titleRef.current) {
        const topOffset =
          titleRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          100;
  
        window.scrollTo({
          top: topOffset,
          behavior: "smooth",
        });
      }
    }, []);
  return (
    <Box ref={titleRef}
      sx={{
        width: "100%",
        background:
          "linear-gradient(90deg,#7C3AED,#8B5CF6,#A855F7)",
        color: "#fff",
        overflow: "hidden",
        borderRadius: 2,
        py: 1.2,
        my: 2,
        boxShadow: "0 8px 25px rgba(124,58,237,.25)",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          pl: "100%",
          whiteSpace: "nowrap",
          animation: "marquee 28s linear infinite",

          "@keyframes marquee": {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(-100%)",
            },
          },
        }}
      >
        <Chip
          label="NEW"
          size="small"
          sx={{
            bgcolor: "#fff",
            color: "#7C3AED",
            fontWeight: 700,
          }}
        />

        <CampaignRoundedIcon />

        <Typography
          sx={{
            fontWeight: 600,
            letterSpacing: ".3px",
          }}
        >
         🚧 Development Update • SmartEducator v1.0 is now approximately 75% complete. Teacher & Student school registration is now available, along with a redesigned user experience. We're currently working on AI-powered learning tools, notifications, and additional classroom features. Thank you for supporting SmartEducator!  

        </Typography>
      </Box>
    </Box>
  );
};

export default AnnouncementBar;