import { useAuth } from "@/app/contexts/authContext";
import { Book, Review } from "../../types/types";
import { ActionIcon, Card, Container, Flex, Group, Image, LoadingOverlay, Paper, ScrollArea, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconMessagePlus } from "@tabler/icons-react";
import ReviewModal from "../review/ReviewModal";
import { getData } from "@/app/services/apiService";
import dayjs from "dayjs";
import ReviewCard from "../review/ReviewCard";

interface BookDetailsProps {
    book: Book
    handleBack: () => void;
}

export default function bookDetails(props: BookDetailsProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [opened, setOpened] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
    const { isSignedIn } = useAuth();
    const book : Book = props.book;
    const handleBack : () => void = props.handleBack;

    const onClose = () => {
        setOpened(false);
    }

    useEffect(() => {
        getReviews();
    }, [])

    const getReviews = () => {
        setLoading(true);
        const headers = {
            isbn: book.isbn
        }
        getData<Review[]>("getReviewsByBook", headers)
            .then((response) => {
                const formattedReviews = response.map((review) => ({
                    ...review,
                    formatted_date: dayjs(review.review_date).format("MMMM D, YYYY h:mm A"),
                }));
                setReviews(formattedReviews);
                setDisplayedReviews(formattedReviews);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }

    return (
        <Container 
            size="xl" 
            py="md"
        >
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
            <Paper 
                p="md" 
                style={{ position: 'relative', backgroundColor: 'transparent'}}>
            <Tooltip label="Back to catalog">
                <ActionIcon
                variant="filled"
                color="blue"
                size="lg"
                onClick={handleBack}
                style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
                >
                <IconArrowLeft size={20} />
                </ActionIcon>
            </Tooltip>

            <Flex
                align="center"
                justify="center"
                gap="xl"
                wrap="wrap"
                style={{ maxWidth: 900, margin: 'auto' }}
            >
                <Image
                src={book.image}
                alt={'Cover of ' + book.title}
                height={400}
                width={250}
                radius="lg"
                fit="contain"
                style={{ display: 'block', marginBottom: '1rem', marginTop: '1rem'}}
                />

                <Card shadow="sm" padding="lg" radius="md" withBorder style={{ minWidth: 300, flex: '1 1 auto' }}>
                <Stack>
                    <Title order={3} style={{ textAlign: 'center' }}>
                    {book.title}
                    </Title>
                    <Text size="lg" fw={500} style={{ textAlign: 'center' }}>
                    By {book.authors?.join(', ') || 'Unknown Author'}
                    </Text>
                    <Text size="md" c="dimmed" style={{ textAlign: 'center' }}>
                    Published by {book.publishers?.join(', ') || 'Unknown publisher'}
                    {book.publication_date ? `, ${book.publication_date}` : ''}
                    </Text>
                    {book.pages ? (
                    <Text size="md" style={{ textAlign: 'center' }}>
                        Pages: {book.pages}
                    </Text>
                    ) : null}
                </Stack>
                </Card>
            </Flex>
            </Paper>
            <Paper
                p="md"
                style={{
                position: "relative",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginTop: 20,
                minHeight: 0,  // crucial to allow ScrollArea to shrink properly inside flex container
                }}
            >
                <Group justify="center">
                <Title order={3}>Reviews</Title>
                </Group>
                <Tooltip label="Write a Review">
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    disabled={!isSignedIn}
                    onClick={() => setOpened(true)}
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                >
                    <IconMessagePlus size={20} />
                </ActionIcon>
                </Tooltip>

                {/* Make ScrollArea flex-grow and set maxHeight or use flex: 1 */}
                <ScrollArea
                style={{ flex: 1, minHeight: 0, marginTop: "1rem" }}
                >
                <Stack gap="md">
                    {displayedReviews.length > 0 ? (
                    displayedReviews.map((review) => (
                        <ReviewCard key={review.review_id} review={review} isSignedIn={isSignedIn} />
                    ))
                    ) : (
                    <Text c="dimmed" ta="center">No reviews yet</Text>
                    )}
                </Stack>
                </ScrollArea>
            </Paper>

            <ReviewModal 
                isbn={book.isbn}
                title={book.title}
                opened={opened}
                onClose={onClose}
            />
            </Container>
    )
}