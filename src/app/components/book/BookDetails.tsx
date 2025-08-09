import { useAuth } from "@/app/contexts/authContext";
import { Book } from "../../types/types";
import { ActionIcon, Button, Card, Container, Flex, Group, Image, LoadingOverlay, Paper, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import ReviewModal from "../review/ReviewModal";

interface BookDetailsProps {
    book: Book
    handleBack: () => void;
}

export default function bookDetails(props: BookDetailsProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [opened, setOpened] = useState<boolean>(false);
    const { accountId, isSignedIn } = useAuth();
    const book : Book = props.book;
    const handleBack : () => void = props.handleBack;

    const onClose = () => {
        setOpened(false);
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
            <Button size="md" onClick={() => setOpened(true)}>Submit review</Button>
            <ReviewModal 
                isbn={book.isbn}
                title={book.title}
                opened={opened}
                onClose={onClose}
            />
        </Container>
    )
}