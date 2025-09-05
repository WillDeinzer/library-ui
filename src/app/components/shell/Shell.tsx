"use client";
import React, { useState } from "react";
import {
  AppShell,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { useAuth } from "@/app/contexts/authContext";
import AccountModal from "../account/AccountModal";

export default function Shell({ children }: { children: React.ReactNode }) {
    const [accountModalOpened, setAccountModalOpened] = useState(false);

    const { isSignedIn, signOut } = useAuth();

    const onClose = () => {
        setAccountModalOpened(false);
    }

    return (
        <AppShell
            padding={0}
            header={{ height: 60 }}
            styles={{
                main: {
                minHeight: "100vh",
                backgroundImage: "url('/bookDetailsBg.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                },
            }}
        >
            <AppShell.Header
            style={{
                position: "fixed",         // stay at the top
                top: 0,
                width: "100%",             // span full width
                height: 60,                // matches AppShell header height
                backgroundColor: "#ffffff", // solid color (change as needed)
                backgroundImage: "url('/bookChatBg.jpeg')", // optional, will overlay color
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",    // subtle shadow
                display: "flex",
                alignItems: "center",
                padding: "0 1rem",
                zIndex: 1000,              // stays above all content
            }}
            >
                <div style={{ flex: 1, textAlign: 'center', color: "white" }}>
                    <Title 
                        order={2}
                        fz="clamp(14px, 3vw, 24px)" // min: 14px, scales with vw, max: 24px
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >Northwest Buffalo Community Library</Title>
                </div>
                <Group align="center" style={{ paddingRight: '1rem' }}>
                    {isSignedIn ? (
                    <Button
                    variant="outline"
                    radius="md"
                    color="cyan"
                    onClick={() => signOut()}
                    style={{
                        fontWeight: 600,
                        color: "white",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        borderColor: "rgba(255,255,255,0.6)",
                        zIndex: 2000,
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 14px)",
                        whiteSpace: "nowrap",
                    }}
                    >
                    Sign Out
                    </Button>
                    ) : (
                    <Button 
                    variant="outline"
                    radius="md"
                    color="cyan"
                    onClick={() => setAccountModalOpened(true)}
                    style={{
                        fontWeight: 600,
                        color: "white",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        borderColor: "rgba(255,255,255,0.6)",
                        zIndex: 2000,
                        fontSize: "clamp(12px, 2.5vw, 16px)",     // scales on small screens
                        padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 14px)", // smaller and responsive padding
                        whiteSpace: "nowrap",                     // prevent wrapping
                    }}
                    >
                    Sign In
                    </Button>
                    )}
                </Group>
            </AppShell.Header>

            <AppShell.Main>{children}</AppShell.Main>

            <AccountModal opened={accountModalOpened} onClose={onClose} />
        </AppShell>
    );
}