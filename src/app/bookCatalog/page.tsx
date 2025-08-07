"use client";
import { useEffect, useState } from "react";
import { Book } from "../types/types";
import { getData } from "../services/apiService";
import BookCard from "../components/book/bookCard";
import { Box, Button, Card, Container, Flex, Group, Paper, SimpleGrid, Title } from "@mantine/core";

export default function BookCatalogPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        getData<Book[]>("get_all_books")
            .then((data: Book[]) => {
                console.log(data);
                setBooks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setLoading(false);
                setError(true);
            })
    }, []);

    return (
        <Container size="xl" py="md">
            <Paper
                shadow="xs"
                p="sm"
                style={{ width: '100%', marginTop: '0', marginBottom: '1rem' }}
            >
                <Flex justify="space-between" align="center">
                <Box style={{ width: '100px' }} /> {/* Invisible spacer */}
                <Title order={3} style={{ textAlign: 'center', flexGrow: 1 }}>
                    Book Catalog
                </Title>
                <Button onClick={() => {/* handle add action */}}>
                    Add Book
                </Button>
                </Flex>
            </Paper>
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 4}}
                spacing="md"
            >
                {books.map((book) => (
                <BookCard key={book.isbn} book={book} />
                ))}
            </SimpleGrid>
        </Container>
    );
}