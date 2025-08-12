"use client";

import { ActionIcon, Button, Container, Group, Loader, Textarea, TextInput, Tooltip } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { getData } from "../services/apiService";
import { Message } from "../types/types";

export default function BookChatPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { isSignedIn } = useAuth();

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // When the messages update, scroll to the bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {

        setMessages((msgs) => [...msgs, { from: "user", text: input }]);
        setInput("");
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: "GET",
                headers: { query: input }
            });

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedText = "";

            // Add empty bot message - this will be changed during reading
            setMessages((msgs) => [...msgs, { from: "bot", text: "" }])

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedText += chunk;
                    
                    // Set the last bot message to the current accumulated text from the stream
                    setMessages((msgs) => {
                        const newMsgs = [...msgs];
                        const lastBotIndex = newMsgs.map(m => m.from).lastIndexOf("bot");
                        if (lastBotIndex !== -1) {
                            newMsgs[lastBotIndex] = { from: "bot", text: accumulatedText };
                        }
                        return newMsgs;
                    })
                }
            }
        } catch(err) {
            console.log("Streaming error: ", err);
            setMessages((msgs) => [...msgs, { from: "bot", text: "Error: Failed to fetch response" }])
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "95vh",
                backgroundImage: "url('/bookChatBg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
        <div
            style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            }}
        >
        {messages.map((msg, i) => (
            <div
                key={i}
                style={{
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                backgroundColor: msg.from === "user" ? "#228be6" : "#e9ecef",
                color: msg.from === "user" ? "white" : "black",
                borderRadius: 12,
                padding: "0.75rem 1rem",
                whiteSpace: "pre-wrap",
                }}
            >
                {msg.text}
            </div>
        ))}
            <div ref={messagesEndRef} />
      </div>

        <Container
            size="xl"
            w="100%"
            py="sm"
            style={{
                borderTop: "1px solid #ccc",
                backgroundColor: "rgba(255,255,255,0.9)",
            }}
        >
            <Group justify="center" w="100%" style={{ marginBottom: "2vh" }}>
                <Textarea
                    style={{ flex: 1, backgroundColor: "transparent", border: "1px solid #ffffff", marginRight: 8 }}
                    minRows={3}
                    placeholder="Type your question"
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading && !e.shiftKey) {
                            e.preventDefault();
                            if (isSignedIn) {
                                sendMessage();
                            }
                        }
                    }}
                />
                <Tooltip
                    label="You must be signed in to use this feature"
                    disabled={isSignedIn}
                    withArrow
                    position="top"
                >
                    <span>
                        <ActionIcon
                            color="blue"
                            size="lg"
                            radius="xl"
                            variant="filled"
                            disabled={loading || input.trim() === "" || !isSignedIn}
                            onClick={() => {
                                if (!loading && input.trim() !== "") sendMessage();
                            }}
                        >
                        
                            {loading ? <Loader size="sm" color="white" /> : <IconSend size={20} />}
                        </ActionIcon>
                    </span>
                </Tooltip>
            </Group>
        </Container>
        </div>
    );
}