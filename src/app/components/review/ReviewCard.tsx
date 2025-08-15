"use client";
import { Review } from "@/app/types/types";
import { ActionIcon, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled, IconStarHalfFilled, IconThumbUp, IconThumbUpFilled, IconTrash } from "@tabler/icons-react"

interface ReviewCardProps {
    review: Review,
    isSignedIn: boolean,
    accountId: number,
    currentlyLiked: boolean,
    onToggleLike: () => void;
    deleteReview: (review_id: number) => void;
}

export default function ReviewCard({ review, isSignedIn, accountId, currentlyLiked, onToggleLike, deleteReview}: ReviewCardProps) {

    const thisUser : boolean = (accountId === review.account_id)

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<IconStarFilled key={i} size={16} color="#FFD700" />);
            } else if (rating >= i - 0.5) {
                stars.push(<IconStarHalfFilled key={i} size={16} color="#FFD700" />);
            } else {
                stars.push(<IconStar key={i} size={16} color="#FFD700" />);
            }
        }
        return stars;
    }

    return (
        <Card shadow="sm" withBorder radius="md" p="md" style={{ display: "relative", background: "transparent" }}>
            <Group justify="space-between">
                <Text fw={500} style={{ color: "white" }}>{review.username}</Text>
                <Text size="sm" style={{ color: "white" }}>{review.formatted_date}</Text>
            </Group>
            <Group gap={2} style={{ marginTop: '0.5rem' }}>
                {renderStars(review.rating)}
            </Group>
            <Stack
                justify="center"
                align="center"
                gap={0}
                style={{ position: 'absolute', top: 30, right: 10, zIndex: 10 }}>

                <Tooltip label="Like">
                    <ActionIcon
                        variant="transparent"
                        color="blue"
                        size="lg"
                        disabled={!isSignedIn}
                        styles={(theme, params) => ({
                        root: {
                            backgroundColor: "transparent", // no grey even when disabled
                            opacity: params.disabled ? 1 : 1, // keep full opacity
                            cursor: params.disabled ? "not-allowed" : "pointer",
                        },
                        icon: {
                            color: params.disabled ? theme.colors.blue[6] : theme.colors.blue[6], // keep the color
                        },
                        })}
                        onClick={() => {
                            review.likes = currentlyLiked ? review.likes - 1 : review.likes + 1;
                            onToggleLike();
                        }}
                    >
                        {currentlyLiked ? <IconThumbUpFilled size={20} /> : <IconThumbUp size={20} />}
                    </ActionIcon>
                </Tooltip>
                <Text size="sm" style={{ color: "white" }}>{review.likes}</Text>
            </Stack>
            <Stack style={{ width: "100%", marginTop: '1rem' }}
                justify="center"
                align="left"
            >
                <Text size="md" style={{ color: "white" }}>Overall thoughts: {review.review_text.OverallThoughts}</Text>
                {review.review_text.FavoriteCharacter && <Text size="md" style={{ color: "white" }}>Favorite Character: {review.review_text.FavoriteCharacter}</Text>}
                {review.review_text.FavoritePart && <Text size="md" style={{ color: "white" }}>Favorite Part: {review.review_text.FavoritePart}</Text>}
            </Stack>
            {thisUser && (
                <Tooltip label="Delete">
                <ActionIcon
                    variant="transparent"
                    color="gray"
                    size="lg"
                    onClick={() => deleteReview(review.review_id)}
                    style={{ position: "absolute", bottom: 10, right: 10 }}
                >
                    <IconTrash size={20} />
                </ActionIcon>
                </Tooltip>
            )}
        </Card>
    )
}