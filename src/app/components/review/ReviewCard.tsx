"use client";
import { postData } from "@/app/services/apiService";
import { Review } from "@/app/types/types";
import { ActionIcon, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled, IconStarHalfFilled, IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react"
import { useState } from "react";

interface ReviewCardProps {
    review: Review,
    isSignedIn: boolean
}

export default function ReviewCard({ review, isSignedIn }: ReviewCardProps) {
    const [liked, setLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState(review.likes || 0);

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

    const toggleLike = async () => {
        if (!isSignedIn) {
            return;
        }
        const action = liked ? "unlike" : "like";
        review.likes = liked ? review.likes - 1 : review.likes + 1;
        setLikes(likes + (action === "unlike" ? -1 : 1))
        setLiked(!liked);

        const data = {
            review_id: review.review_id,
            action: action
        }
        await postData("modifyLikeCount", data)
            .then((response) => {
                console.log(response);
                
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <Card shadow="sm" withBorder radius="md" p="md" style={{ display: "relative" }}>
            <Group justify="space-between">
                <Text fw={500}>{review.username}</Text>
                <Text size="sm" c="dimmed">{review.formatted_date}</Text>
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
                        onClick={() => toggleLike()}
                    >
                        {liked ? <IconThumbUpFilled size={20} /> : <IconThumbUp size={20} />}
                    </ActionIcon>
                </Tooltip>
                <Text size="sm">{likes}</Text>
            </Stack>
            <Stack style={{ width: "100%", marginTop: '1rem' }}
                justify="center"
                align="left"
            >
                <Text size="md">Overall thoughts: {review.review_text.OverallThoughts}</Text>
                {review.review_text.FavoriteCharacter && <Text size="md">Favorite Character: {review.review_text.FavoriteCharacter}</Text>}
                {review.review_text.FavoritePart && <Text size="md">Favorite Part: {review.review_text.FavoritePart}</Text>}
            </Stack>
            <Text mt="sm">{""}</Text>
        </Card>
    )


}