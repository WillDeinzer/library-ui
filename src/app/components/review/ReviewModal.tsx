import { useAuth } from "@/app/contexts/authContext";
import { postData } from "@/app/services/apiService";
import { submitReviewData } from "@/app/types/types";
import { LoadingOverlay, Modal, Stack, Title, Text, Group, Slider, Box, Divider, Textarea, Button } from "@mantine/core";
import { useEffect, useState } from "react";

interface reviewModalProps {
    isbn: string;
    title: string;
    opened: boolean;
    onClose: () => void;
}
export default function ReviewModal({ isbn, title, opened, onClose }: reviewModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [reviewText, setReviewText] = useState<string>("");
    const [characterText, setCharacterText] = useState<string>("");
    const [partText, setPartText] = useState<string>("");
    const [rating, setRating] = useState<number>(3);
    const { accountId } = useAuth();

    const handleSubmitReview = () => {
        const submitText = formatReviewText();
        setLoading(true);
        const reviewData = {
            "account_id": accountId,
            "review_text": submitText,
            "rating": rating,
            "book_isbn": isbn
        }
        postData<submitReviewData>("submitReview", reviewData)
            .then((response) => {
                console.log(response);
                setLoading(false);
                setDefaults();
                onClose();
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    // Reset fields to defaults
    const setDefaults = () => {
        setReviewText("");
        setCharacterText("");
        setPartText("");
        setRating(3);
    }

    const cleanInput = (input: string) => {
        return input
            .replace(/%overallthoughts%/gi, '')
            .replace(/%favoritecharacter%/gi, '')
            .replace(/%favoritepart%/gi, '')
            .trim();
    }

    const formatReviewText = () => {
        const cleanReviewText = cleanInput(reviewText);
        const cleanCharacterText = cleanInput(characterText);
        const cleanPartText = cleanInput(partText);

        let resultText = `%OverallThoughts%${cleanReviewText}`;
        if (cleanCharacterText !== '') {
            resultText += `%FavoriteCharacter%${cleanCharacterText}`;
        }
        if (cleanPartText !== '') {
            resultText += `%FavoritePart%${cleanPartText}`;
        }
        return resultText;
    }

    return (
        <Modal
            size="lg"
            opened={opened}
            onClose={onClose}
            centered
        >
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Stack align="center">
                <Title order={4}>Submit a review</Title>
                <Text size="lg">{title}</Text>
                <Divider my="sm" size={1} />
                <Text size="md">What would you rate this book?</Text>

                <Slider
                    value={rating}
                    onChange={setRating}
                    min={1}
                    max={5}
                    step={0.5}
                    marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                    ]}
                    style={{ width: 250 }}
                />

                <Divider my="sm" size={1} />

                <Textarea
                    label="What are your thoughts on this book?"
                    placeholder="Review"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.currentTarget.value)}
                    required
                    style={{ width: '80%' }}
                />
                <Textarea
                    label="Who is your favorite character and why?"
                    placeholder="Favorite Character"
                    value={characterText}
                    onChange={(event) => setCharacterText(event.currentTarget.value)}
                    style={{ width: '80%' }}
                />
                <Textarea
                    label="What was your favorite part of the book and why?"
                    placeholder="Favorite Part"
                    value={partText}
                    onChange={(event) => setPartText(event.currentTarget.value)}
                    style={{ width: '80%' }}
                />

                <Button size="md" onClick={handleSubmitReview}>Submit Review</Button>
            </Stack>
        </Modal>
    )
}