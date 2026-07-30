import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const faqs = [
  {
    title: "Where can I get the School ID?",
    description:
      "Contact your school administrator or class teacher to receive the correct School ID.",
  },
  {
    title: "Why is my request pending?",
    description:
      "Every join request must be reviewed and approved by the school administrator before access is granted.",
  },
  {
    title: "Can I update my information later?",
    description:
      "Yes. After joining your school, you'll be able to update your profile information from your dashboard.",
  },
];

const HelpCard = () => {
  return (
    <Box>

      {/* Header */}

      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={700} gutterBottom >Need Help?</Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
          If you're having trouble joining your school,
          here are some answers to common questions.
        </Typography>
      </Box>

      <Grid container spacing={4}>

        {/* FAQ */}

        <Grid size={{ xs:12, md:7 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid #ECECEC",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                mb={3}
              >
                <HelpOutlineRoundedIcon
                  color="primary"
                  fontSize="large"
                />

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  Frequently Asked Questions
                </Typography>
              </Stack>

              {faqs.map((faq, index) => (
                <Box key={index}>

                  <Typography
                    fontWeight={600}
                    gutterBottom
                  >
                    {faq.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                    {faq.description}
                  </Typography>

                  {index !== faqs.length - 1 && (
                    <Divider sx={{ mb: 3 }} />
                  )}

                </Box>
              ))}

            </CardContent>
          </Card>
        </Grid>

        {/* Contact */}

        <Grid size={{ xs:12, md:5 }}>
          <Card
            sx={{
              borderRadius: 5,
              height: "100%",
              background:
                "linear-gradient(135deg,#7C3AED,#9333EA,#A855F7)",
              color: "#fff",
            }}
          >
            <CardContent
              sx={{
                p: 4,
                height: "100%",
              }}
            >

              <SchoolRoundedIcon
                sx={{
                  fontSize: 55,
                  mb: 2,
                }}
              />

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                Still Need Assistance?
              </Typography>

              <Typography
                sx={{
                  opacity: .92,
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                If you can't find your School ID or your
                request hasn't been approved, please
                contact your school's administrator for
                assistance.
              </Typography>

              <Stack spacing={2}>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <EmailRoundedIcon />

                  <Typography>shoaiby31@gmail.com</Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <PhoneRoundedIcon />

                  <Typography>
                    +92 3139347436
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <InfoRoundedIcon />

                  <Typography>
                    Monday – Friday
                    <br />
                    9:00 AM – 5:00 PM
                  </Typography>
                </Stack>

              </Stack>

              <Button
                variant="contained"
                color="inherit"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 5,
                  color: "#7C3AED",
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Contact Administrator
              </Button>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </Box>
  );
};

export default HelpCard;