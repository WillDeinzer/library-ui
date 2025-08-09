import { Card, Image, Stack, Title, Text, Button, ActionIcon, Tooltip } from "@mantine/core";
import { IconArrowRight, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import { Book } from "../../types/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/authContext";

interface BookCardProps {
    book: Book
    addRemoveWishlist: (isbn: string, add: boolean) => void;
    inWishlist: boolean;
    handleSeeMore: (book: Book) => void;
}

export default function BookCard(props: BookCardProps) {
    const [inWishlist, setInWishlist] = useState<boolean>(props.inWishlist);
    const book = props.book;
    const addRemoveWishlist: (isbn: string, add: boolean) => void = props.addRemoveWishlist;
    const handleSeeMore: (book: Book) => void = props.handleSeeMore;
    const { isSignedIn } = useAuth();

    const handleWishlist = () => {
        addRemoveWishlist(book.isbn, !inWishlist);
        setInWishlist(!inWishlist);
    }

    const seeMoreClick = () => {
        handleSeeMore(book);
    }

    useEffect(() => {
        setInWishlist(props.inWishlist);
    }, [props.inWishlist]);

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

        {isSignedIn && 
            <Tooltip label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                <ActionIcon
                    variant="filled"
                    color={inWishlist ? "red" : 'gray'}
                    size="lg"
                    onClick={handleWishlist}
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
        }


            <Tooltip label="See more">
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    onClick={seeMoreClick}
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