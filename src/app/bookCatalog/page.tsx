"use client";
import { useEffect, useState } from "react";
import { Book, wishlistData } from "../types/types";
import { getData, postData } from "../services/apiService";
import BookCard from "../components/book/bookCard";
import { Autocomplete, Box, Button, Container, Flex, LoadingOverlay, Paper, SimpleGrid, Title, Tooltip } from "@mantine/core";
import AddBookModal from "../components/book/addBookModal";
import { getSessionItem } from "@/app/services/sessionService";
import { useAuth } from "../contexts/authContext";

export default function BookCatalogPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState<boolean>(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showWishlist, setShowWishlist] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const { accountId, isSignedIn } = useAuth();

    const addRemoveWishlist = (isbn: string, add: boolean) => {
        const data : wishlistData = {
            "account_id": accountId,
            "isbn": isbn
        }
        postData<wishlistData>((add ? "addToWishlist" : "removeFromWishlist"), data)
            .then((response) => {
                if (add) {
                    setWishlist([...wishlist, isbn])
                } else {
                    setWishlist(wishlist.filter((item) => item !== isbn));
                    if (showWishlist) {
                        setDisplayedBooks(displayedBooks.filter((item) => item.isbn !== isbn));
                    }
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleWishlistClick = () => {
        if (showWishlist) {
            setDisplayedBooks(books);
        } else {
            setDisplayedBooks(books.filter(book => wishlist.includes(book.isbn)));
        }
        setShowWishlist(!showWishlist);
        setSearchValue("");
    }

    const getBookData = () => {
        setLoading(true);
        getData<Book[]>("getAllBooks")
            .then((data: Book[]) => {
                setBooks(data);
                getWishlist(data);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setLoading(false);
            })
    }

    // Need to pass all books because we still want to display books if the user is not signed in

    const getWishlist = (allBooks: Book[]) => {
        if (!isSignedIn) {
            setDisplayedBooks(allBooks)
        }
        const headers = {
            "account_id": getSessionItem("account_id")
        }
        getData<string[]>("getWishlistByAccountId", headers)
            .then((data: string[]) => {
                setWishlist(data);
                if (!showWishlist) {
                    setDisplayedBooks(allBooks);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error fetching wishlist", error);
                setLoading(false);
            })
    }

    const onClose = () => {
        setOpened(false);
        getBookData();
    }

    useEffect(() => {
        setLoading(true);
        getBookData();
    }, [isSignedIn]);

    const autocompleteData = books.map(book => book.title);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        if (showWishlist) {
            filterBooks(value, books.filter(book => wishlist.includes(book.isbn)))
        } else {
            filterBooks(value, books);
        }
    }

    const filterBooks = (query: string, list: Book[]) => {
        const filtered = list.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) || 
            book.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
        );
        setDisplayedBooks(filtered);
    };

    return (
        <Container size="xl" py="md">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Paper
                shadow="xs"
                p="sm"
                style={{ width: '100%', marginTop: '0', marginBottom: '1rem' }}
            >
                <Flex justify="space-between" align="center">
                    <Tooltip
                    label="You must be signed in to use this feature"
                    disabled={isSignedIn}
                    withArrow
                    position="top"
                    >
                    <span>
                        <Button onClick={handleWishlistClick} disabled={!isSignedIn}>
                        {showWishlist ? "Show all books" : "Show wishlist"}
                        </Button>
                    </span>
                    </Tooltip>

                    <Title order={3} style={{ textAlign: 'center', flexGrow: 1 }}>
                        Book Catalog
                    </Title>

                    <Button onClick={() => {
                        setOpened(true);
                    }}>
                        Add/Remove Book
                    </Button>
                </Flex>
                <Autocomplete
                    style={{ width: '30%', marginTop: '1rem' }}
                    placeholder="Search by title"
                    value={searchValue}
                    data={autocompleteData}
                    onChange={handleSearchChange}
                    limit={10}
                    clearable
                />
            </Paper>
            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 4}}
                spacing="md"
            >
                {displayedBooks.map((book) => (
                <BookCard key={book.isbn} book={book} addRemoveWishlist={addRemoveWishlist} inWishlist={wishlist.some((isbn) => isbn === book.isbn)} />
                ))}
            </SimpleGrid>
            <AddBookModal
                opened={opened}
                onClose={onClose}

            />
        </Container>
    );
}