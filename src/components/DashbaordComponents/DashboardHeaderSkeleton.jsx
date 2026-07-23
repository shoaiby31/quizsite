import React from "react";
import {
  Box,
  Grid,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";

const DashboardHeaderSkeleton = () => {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 3,
        background: "#F7F8FC",
      }}
    >
      {/* ================= TOP SECTION ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "center" },
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        {/* Left */}

        <Box>
          <Skeleton
            variant="text"
            width={340}
            height={52}
            animation="wave"
          />

          <Skeleton
            variant="text"
            width={250}
            height={24}
            animation="wave"
          />
        </Box>

        {/* Right */}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <Skeleton
            variant="rounded"
            width={130}
            height={42}
            animation="wave"
          />

          <Skeleton
            variant="rounded"
            width={140}
            height={44}
            animation="wave"
          />

          <Skeleton
            variant="rounded"
            width={145}
            height={44}
            animation="wave"
          />

          <Skeleton
            variant="rounded"
            width={145}
            height={44}
            animation="wave"
          />
        </Stack>
      </Box>

      {/* ================= STAT CARDS ================= */}

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={3}
            key={item}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: "1px solid #ECECEC",
                boxShadow:
                  "0 8px 30px rgba(15,23,42,.05)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Skeleton
                    variant="circular"
                    width={62}
                    height={62}
                    animation="wave"
                  />

                  <Box>
                    <Skeleton
                      variant="text"
                      width={110}
                      height={22}
                      animation="wave"
                    />

                    <Skeleton
                      variant="text"
                      width={70}
                      height={52}
                      animation="wave"
                    />

                    <Skeleton
                      variant="text"
                      width={90}
                      height={20}
                      animation="wave"
                    />
                  </Box>
                </Stack>

                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  animation="wave"
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardHeaderSkeleton;