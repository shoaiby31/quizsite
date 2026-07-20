import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Chip,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { motion } from "framer-motion";


const roles = [
    {
        icon: <SchoolRoundedIcon sx={{ backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))' }} />,
        title: "Super Admin",
        subtitle: "Principal / School Owner",
        description:
            "Complete control over the education ecosystem. Manage teachers, students, quizzes, monitor live attempts, and analyze performance.",
    },
    {
        icon: <PersonRoundedIcon sx={{ backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))' }} />,
        title: "Teacher",
        subtitle: "Sub Admin",
        description:
            "Create classes, add students, conduct quizzes, assign daily diaries, and track student learning progress.",
    },
    {
        icon: <GroupsRoundedIcon sx={{ backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))' }} />,
        title: "Students",
        subtitle: "Learners",
        description:
            "Practice quizzes, attempt secure exams, view diaries, and improve their performance through digital learning.",
    },
];


const AboutSmartEducator = () => {

    return (

        <Box sx={{ py: 3, px: { xs: 2, md: 6 }, }} >


            {/* Heading */}

            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>

                <Typography variant="h3" textAlign="center" fontWeight={800}>Meet{" "}
                  <Box
  component="span"
  sx={{
    background:
      "linear-gradient(to top left, hsl(315, 93.8%, 44.3%), rgb(104, 70, 253))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  SmartEducator
</Box>
                </Typography>


                <Typography
                    textAlign="center"
                    maxWidth="850px"
                    mx="auto"
                    mt={2}
                    color="text.secondary"
                    fontSize="1.1rem"
                >
                    A complete school and academy management platform that
                    connects principals, teachers, students, and parents in one
                    intelligent ecosystem.
                </Typography>


            </motion.div>



            {/* Role Cards */}


            <Grid
                container
                spacing={4}
                mt={6}
            >

                {
                    roles.map((role, index) => (

                        <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: "flex", }} key={role.title}>
                            <motion.div style={{ width: "100%", height: "100%", }} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .2, duration: .6 }} viewport={{ once: true }} whileHover={{ y: -10 }}>
                                <Card sx={{
                                    height: "100%", minHeight: 330, width: "100%", borderRadius: 4, p: 2, display: "flex", flexDirection: "column", backdropFilter: "blur(10px)",
                                   boxShadow: "0 20px 40px rgba(0,0,0,.08)"
                                }}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                width: 60, backgroundImage: 'linear-gradient(to top left,hsl(315, 93.80%, 44.30%),rgb(104, 70, 253))', height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "primary.main", color: "white", mb: 2
                                            }}>

                                            {React.cloneElement(
                                                role.icon,
                                                {
                                                    fontSize: "large",
                                                }
                                            )}

                                        </Box>



                                        <Typography variant="h5" fontWeight={700}> {role.title} </Typography>

                                        <Chip label={role.subtitle}
                                            size="small" sx={{ mt: 1, mb: 2 }} />


                                        <Typography
                                            color="text.secondary"
                                        >
                                            {role.description}
                                        </Typography>


                                    </CardContent>


                                </Card>


                            </motion.div>


                        </Grid>

                    ))
                }

            </Grid>




            {/* Security + AI Section */}


            <Grid
                container
                spacing={4}
                mt={8}
            >


                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ display: "flex", }}>
                    <FeatureCard
                        icon={<SecurityRoundedIcon />}
                        title="Secure Online Examination"
                        text="
            SmartEducator provides a controlled quiz environment
            with anti-cheating protection. Students cannot switch tabs
            or minimize the quiz window during real examinations.
            "

                    />


                </Grid>



                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", }}>


                    <FeatureCard

                        icon={<PsychologyRoundedIcon />}

                        title="AI Powered Evaluation (Coming Soon)"

                        text="
            Our upcoming AI module will evaluate subjective answers
            intelligently and provide human-like assessment results.
            "

                    />


                </Grid>


            </Grid>



            <Box
                mt={8}
                textAlign="center"
            >

                <Chip

                    icon={<AutoAwesomeRoundedIcon />}

                    label="More intelligent features are under development"

                    color="primary"

                />

            </Box>



        </Box>

    );
};



const FeatureCard = ({
    icon,
    title,
    text
}) => (

    <motion.div

        whileHover={{
            scale: 1.03
        }}

    >


        <Card
            sx={{
                height: "100%",
                width: "100%",
                p: 3,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                boxShadow: "0 15px 35px rgba(0,0,0,.08)"
            }}
        >
            <Stack
                direction="row"
                spacing={3}
                alignItems="center"
            >


                <Box
                    sx={{
                        color: "primary.main"
                    }}
                >

                    {
                        React.cloneElement(
                            icon,
                            {
                                fontSize: "large"
                            }
                        )
                    }

                </Box>


                <Box>

                    <Typography
                        fontWeight={700}
                        variant="h6"
                    >

                        {title}

                    </Typography>


                    <Typography
                        color="text.secondary"
                        mt={1}
                    >

                        {text}

                    </Typography>


                </Box>


            </Stack>


        </Card>


    </motion.div>

);


export default AboutSmartEducator;