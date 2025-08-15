"use client";

import { useAuth } from "@/app/contexts/authContext";
import { Book, Review } from "../../types/types";
import { ActionIcon, Card, Container, Flex, Group, Image, LoadingOverlay, Pagination, Paper, ScrollArea, Select, Stack, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { IconArrowLeft, IconMessagePlus } from "@tabler/icons-react";
import ReviewModal from "../review/ReviewModal";
import { getData, postData } from "@/app/services/apiService";
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
    const [liked, setLiked] = useState<number[]>([]);
    const { accountId, isSignedIn } = useAuth();
    const book : Book = props.book;
    const handleBack : () => void = props.handleBack;
    const [searchTerm, setSearchTerm] = useState("");
    const [sortLikes, setSortLikes] = useState<"asc" | "desc" | null>(null);
    const [sortRating, setSortRating] = useState<"asc" | "desc" | null>(null);
    const [reviewsPage, setReviewsPage] = useState(1);
    const reviewsPerPage = 5;

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...reviews];

        // Filter by username
        if (searchTerm.trim() !== "") {
            result = result.filter((review) =>
            review.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort: first by rating, then by likes (or vice versa if you prefer)
        result.sort((a, b) => {
            let ratingCompare = 0;
            let likesCompare = 0;

            if (sortRating) {
            ratingCompare = sortRating === "asc" ? a.rating - b.rating : b.rating - a.rating;
            }

            if (sortLikes) {
            likesCompare = sortLikes === "asc" ? a.likes - b.likes : b.likes - a.likes;
            }

            // If rating sort is applied, prioritize it
            return ratingCompare !== 0 ? ratingCompare : likesCompare;
        });

        return result;
    }, [reviews, searchTerm, sortLikes, sortRating]);

    const paginatedReviews = useMemo(() => {
        const startIndex = (reviewsPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
        return filteredAndSortedReviews.slice(startIndex, endIndex);
    }, [filteredAndSortedReviews, reviewsPage]);

    const onClose = () => {
        setOpened(false);
        getReviews();
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
                if (isSignedIn) {
                    getLikedReviews();
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }

    const getLikedReviews = () => {
        const headers = {
            book_isbn: book.isbn,
            account_id: accountId.toString()
        }
        getData<number[]>("getLikedByISBN", headers)
            .then((response) => {
                setLiked(response);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            })
    }

    const toggleLike = async (review_id: number) => {
        if (!isSignedIn) return;

        const action = liked.includes(review_id) ? "unlike" : "like";

        // Optimistically update likes array
        setLiked((prev) => {
            if (action === "like") return [...prev, review_id];
            return prev.filter((id) => id !== review_id);
        });

        const data = {
            review_id: review_id,
            action: action,
            account_id: accountId,
            isbn: book.isbn
        }
        await postData("modifyLikeCount", data)
            .then((response) => {
                console.log(response);
                
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const deleteReview = (review_id: number) => {
        setLoading(true);
        const data = {
            review_id: review_id
        }
        postData("deleteReviewByReviewId", data)
            .then((response) => {
                console.log(response);
                getReviews();
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            })
    }

    return (
        <Container 
            size="xl" 
            py="md"
        >
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
            <Paper
            p="md"
            style={{
                position: 'relative',
                backgroundColor: "transparent", // frosted glass
            }}
            >

            <Flex
                align="center"
                justify="center"
                gap="xl"
                wrap="wrap"
                style={{ maxWidth: 900, margin: 'auto' }}
            >
                <Image
                    src={book.image || '/default.jpg'}
                    alt={'Cover of ' + book.title}
                    height={400}
                    width={250}
                    radius="lg"
                    fit="contain"
                    style={{
                        display: 'block',
                        marginBottom: '1rem',
                        marginTop: '1rem',
                    }}
                />

                <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                    minWidth: 300,
                    flex: '1 1 auto',
                    backgroundColor: "rgba(255, 255, 255, 0)", // frosted card
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    position: "relative"
                }}
                >
                <Tooltip label="Back to catalog">
                    <ActionIcon
                    variant="filled"
                    color="cyan"
                    size="lg"
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 10,
                        boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    }}
                    >
                    <IconArrowLeft size={20} />
                    </ActionIcon>
                </Tooltip>
                <Stack style={{ marginTop: '1.5rem' }}>
                    <Title order={3} style={{ textAlign: 'center', color: "white" }}>
                    {book.title}
                    </Title>
                    <Text size="lg" fw={500} style={{ textAlign: 'center', color: "white" }}>
                    By {book.authors[0] || 'Unknown Author'}
                    </Text>
                    <Text size="md" style={{ textAlign: 'center', color: "white" }}>
                    Published by {book.publishers?.join(', ') || 'Unknown publisher'}
                    {book.publication_date ? `, ${book.publication_date}` : ''}
                    </Text>
                    {book.pages ? (
                    <Text size="md" style={{ textAlign: 'center', color: "white" }}>
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
                minHeight: 0,
                backgroundColor: "rgba(255, 255, 255, 0)", // frosted glass
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            >
            {/* Section title */}
            <Group justify="center" mb="sm">
                <Title order={3} style={{ color: "white" }}>Reviews</Title>
            </Group>

            {/* Write review button */}
            <Tooltip label={isSignedIn ? "Write a Review" : "You must be signed in to use this feature"}>
                <ActionIcon
                variant="filled"
                color="cyan"
                size="lg"
                disabled={!isSignedIn}
                onClick={() => setOpened(true)}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.5)")}
                >
                <IconMessagePlus size={20} />
                </ActionIcon>
            </Tooltip>

            {/* Search and sorting */}
            <Flex justify="space-between" align="center" mb="sm" wrap="wrap" gap="md" style={{ marginTop: '1rem' }}>
                <TextInput 
                placeholder="Search by username" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                style={{
                    flex: 1,
                    minWidth: 200,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: 8,
                }}
                />

                <Select
                placeholder="Sort by Likes"
                value={sortLikes || ""}
                onChange={(value) => setSortLikes(value as "asc" | "desc" | null)}
                data={[
                    { value: "desc", label: "Most Likes" },
                    { value: "asc", label: "Least Likes" },
                ]}
                style={{
                    minWidth: 150,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 8,
                    color: "white",
                }}
                clearable
                />

                <Select
                placeholder="Sort by Rating"
                value={sortRating || ""}
                onChange={(value) => setSortRating(value as "asc" | "desc" | null)}
                data={[
                    { value: "desc", label: "Highest Rating" },
                    { value: "asc", label: "Lowest Rating" },
                ]}
                style={{
                    minWidth: 150,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 8,
                    color: "white",
                }}
                clearable
                />
            </Flex>
                <ScrollArea
                    style={{
                        flex: 1,
                        minHeight: 0,
                        marginTop: "1rem",
                        paddingRight: 4,
                    }}
                >
                    <Stack gap="md">
                        {paginatedReviews.length > 0 ? (
                            paginatedReviews.map((review) => (
                                <ReviewCard 
                                    key={review.review_id}
                                    review={review}
                                    isSignedIn={isSignedIn}
                                    accountId={accountId}
                                    currentlyLiked={liked.includes(review.review_id)}
                                    onToggleLike={() => toggleLike(review.review_id)}
                                    deleteReview={() => deleteReview(review.review_id)}
                                />
                            ))
                        ) : (
                            <Text c="dimmed" ta="center" style={{ color: "rgba(255,255,255,0.7)" }}>No reviews yet</Text>
                        )}
                    </Stack>
                </ScrollArea>
            </Paper>

            {filteredAndSortedReviews.length > reviewsPerPage && (
                <Flex justify="center" mt="md">
                    <Pagination
                        total={Math.ceil(filteredAndSortedReviews.length / reviewsPerPage)}
                        value={reviewsPage}
                        onChange={setReviewsPage}
                        size="md"
                        radius="md"
                        color="cyan"
                    />
                </Flex>
            )}

            <ReviewModal 
                isbn={book.isbn}
                title={book.title}
                opened={opened}
                onClose={onClose}
            />
            </Container>
    )
}