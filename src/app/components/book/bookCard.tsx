import { Card, Image, Stack, Title, Text, Button, ActionIcon, Tooltip } from "@mantine/core";
import { IconArrowRight, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import { Book } from "../../types/types";
import { useState } from "react";

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    const [inWishlist, setInWishlist] = useState<boolean>(false);

    const handleAddToWishlist = () => {
        setInWishlist(!inWishlist);
    }

    const handleSeeMore = () => {

    }

    return (
        <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            style={{
                transition: "transform 150ms ease, box-shadow 150ms ease",
                cursor: "pointer",
                "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
            }}
        >
            <Tooltip label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                <ActionIcon
                    variant="filled"
                    color={inWishlist ? "red" : 'gray'}
                    size="lg"
                    onClick={handleAddToWishlist}
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 10
                    }}
                >
                    {inWishlist ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
                </ActionIcon>
            </Tooltip>

            <Tooltip label="See more">
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    onClick={handleSeeMore}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 10
                    }}
                >
                    <IconArrowRight size={20} />
                </ActionIcon>
            </Tooltip>
                
            
            <Card.Section>
                <Image
                    src={book.image}
                    alt={"Cover of " + book.title}
                    height={200}
                    radius="lg"
                    fit="contain"
                    style={{ display: "block", marginTop: "1.5rem", marginBottom: "1rem" }}
                />
            </Card.Section>

            <Stack align="center" gap="md" style={{"width": "100%"}}>
                <Title order={4} style={{ textAlign: "center" }} >{book.title}</Title>
                <Text size="md">{"By " + book.authors?.[0] }</Text>
            </Stack>
        </Card>
    )
}