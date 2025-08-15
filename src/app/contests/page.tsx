"use client";
import { Button, Center, LoadingOverlay, Paper, Stack, Text, Title } from "@mantine/core";
import { getData, postData } from "../services/apiService"
import { useEffect, useState } from "react";
import { Winner } from "../types/types";
import { useAuth } from "../contexts/authContext";
import { getSessionItem } from "../services/sessionService";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function ContestsPage() {
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const { isSignedIn } = useAuth();

    const generateWinner = () => {
        postData("selectContestWinner", {})
            .then((response) => {
                console.log(response);
                getRecentWinners();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getRecentWinners = () => {
        setLoading(true);
        getData("getRecentWinners")
            .then((response: any) => {
                setWinners(
                    response["recent_winners"].map((winner: any) => ({
                        ...winner,
                        win_time: formatDate(winner.win_time),
                    }))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "America/New_York"
        }).format(date);
    };

    useEffect(() => {
        getRecentWinners();
    }, [])

    useEffect(() => {
        if (getSessionItem("is_admin") === true) {
            setAdmin(true);
        }
        if (isSignedIn === false) {
            setAdmin(false);
        }
    }, [isSignedIn]);

    return (
        <Center style={{ minHeight: "100vh", padding: "2rem", position: "relative" }}>
            <Link href="/" passHref>
                <Button
                    variant="outline"
                    radius="md"
                    color="cyan"
                    size="md"
                    style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    fontWeight: 600,
                    color: "white",
                    borderColor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(6px)", // frosted glass effect
                    WebkitBackdropFilter: "blur(6px)", // Safari support
                    zIndex: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem", // space between icon and text
                    }}
                >
                    <IconArrowLeft size={18} />
                    Home
                </Button>
            </Link>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
            <Paper 
                shadow="lg" 
                radius="md" 
                p="xl" 
                style={{ maxWidth: 500, width: "100%", textAlign: "center", backgroundColor: "rgba(255,255,255,0.85)" }}
            >
                <Title order={2} mb="md">Contest Winners</Title>

                <Text mb="sm">
                    Winners are selected from users who submit reviews. To increase your chances of winning, submit more reviews! Contact ldeinzer@buffaloschools.org to claim your prize!
                </Text>

                <Stack gap="sm" mb="md">
                    {winners.length === 0 ? (
                        <Text>No winners yet.</Text>
                    ) : (
                        winners.map((winner, index) => (
                            <Paper 
                                key={index} 
                                shadow="xs" 
                                radius="sm" 
                                p="sm" 
                                style={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <Text>{winner.winner_username}</Text>
                                <Text>{winner.win_time}</Text>
                            </Paper>
                        ))
                    )}
                </Stack>

                { admin && 
                    <Button fullWidth color="cyan" onClick={generateWinner}>
                        Select New Contest Winner
                    </Button>
                }
            </Paper>
        </Center>
    )
}