import React, { useRef, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import svg from "../assets/contact.svg";

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    if (
      !form.current["name"].value.trim() ||
      !form.current["reply_to"].value.trim() ||
      !form.current["subject"].value.trim() ||
      !form.current["message"].value.trim()
    ) {
      setStatus("error");
      return;
    }

    setOpen(true);

    emailjs
      .sendForm(
        "service_kpxo4vs",
        "template_0yhjq6j",
        form.current,
        "V7enx7yWsRHAnlnRG"
      )
      .then(() => {
        setStatus("success");
        form.current.reset();
        setOpen(false);
        setTimeout(() => setStatus(""), 5000);
      })
      .catch(() => {
        setStatus("error");
        setOpen(false);
        setTimeout(() => setStatus(""), 5000);
      });
  };

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={800}
        >
          Let's{" "}
          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Connect
          </Box>
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          maxWidth="700px"
          mx="auto"
          mt={2}
        >
          Have a question, suggestion, or partnership opportunity?
          We'd love to hear from you.
        </Typography>
      </motion.div>

      <Grid container spacing={5} mt={5} alignItems="center">
        {/* Contact Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 20px 40px rgba(0,0,0,.08)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  component="form"
                  ref={form}
                  onSubmit={sendEmail}
                  display="flex"
                  flexDirection="column"
                  gap={2.5}
                >
                  {status === "success" && (
                    <Alert severity="success">
                      Message sent successfully.
                    </Alert>
                  )}

                  {status === "error" && (
                    <Alert severity="error">
                      Please fill all fields correctly.
                    </Alert>
                  )}

                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                  />

                  <TextField
                    label="Email Address"
                    name="reply_to"
                    fullWidth
                  />

                  <TextField
                    label="Subject"
                    name="subject"
                    fullWidth
                  />

                  <TextField
                    label="Message"
                    name="message"
                    multiline
                    rows={5}
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: 16,
                      background:
                        "linear-gradient(to top left,hsl(315,93.8%,44.3%),rgb(104,70,253))",
                      "&:hover": {
                        background:
                          "linear-gradient(to top left,rgb(104,70,253),hsl(315,93.8%,44.3%))",
                      },
                    }}
                  >
                    Send Message
                  </Button>

                  <Backdrop
                    open={open}
                    sx={{
                      color: "#fff",
                      zIndex: (theme) =>
                        theme.zIndex.drawer + 1,
                    }}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Illustration */}
        <Grid
          size={{ xs: 12, md: 6 }}
          display={{
            xs: "none",
            md: "block",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 20px 40px rgba(0,0,0,.08)",
                p: 4,
              }}
            >
              <CardMedia
                component="img"
                image={svg}
                alt="Contact"
                sx={{
                  width: "100%",
                  maxWidth: 450,
                  mx: "auto",
                }}
              />
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;