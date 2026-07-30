import React from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Stack,
    Typography, CircularProgress
} from "@mui/material";

const NotificationItem = ({
    name,
    className,
    rollNo,
    message,
    avatar,
    onAccept,
    onReject,
    loading
}) => {
    return (
        <>
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    transition: "all .2s ease",
                    "&:hover": {
                        bgcolor: "#F9FAFB",
                    },
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Avatar
                        src={avatar}
                        sx={{
                            width: 46,
                            height: 46,
                            bgcolor: "#EC4899",
                            fontWeight: 700,
                        }}
                    >
                        {!avatar && name?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box flex={1}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#111827", }} >{name}</Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 0.6 }}
                        >
                            <Box
                                sx={{
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: 5,
                                    bgcolor: "#F3F4F6",
                                    fontSize: 11,
                                    color: "#4B5563",
                                    fontWeight: 600,
                                }}
                            >
                                {className}
                            </Box>

                            <Box
                                sx={{
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: 5,
                                    bgcolor: "#F3F4F6",
                                    fontSize: 11,
                                    color: "#4B5563",
                                    fontWeight: 600,
                                }}
                            >
                                {rollNo}
                            </Box>
                        </Stack>

                        <Typography sx={{ mt: .3, fontSize: 12, color: "#6B7280", }}>
                            {message}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 1.5 }}
                        >
                            <Button
                                size="small"
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    px: 2,
                                    background:
                                        "linear-gradient(90deg,#EC4899,#6C4AF8)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(90deg,#EC4899,#6C4AF8)",
                                    },
                                }}
                                disabled={loading}
                                onClick={onAccept}
                                startIcon={
                                    loading ? <CircularProgress size={16} color="inherit" /> : null
                                }
                            >
                                Accept
                            </Button>

                            <Button
                                size="small"
                                variant="outlined"

                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    borderColor: "#E5E7EB",
                                    color: "#374151",
                                }}
                                disabled={loading}
                                onClick={onReject}
                            >
                                Reject
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            <Divider />
        </>
    );
};

export default NotificationItem;