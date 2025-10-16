"use client";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Book, wishlistData } from "./types/types";
import { getData, postData } from "./services/apiService";
import BookCard from "./components/book/BookCard";
import { Autocomplete, Box, Button, Container, Flex, Group, LoadingOverlay, Pagination, Paper, SimpleGrid, Title, Tooltip } from "@mantine/core";
import AddBookModal from "./components/book/AddBookModal";
import { getSessionItem } from "@/app/services/sessionService";
import { useAuth } from "./contexts/authContext";
import BookDetails from "./components/book/BookDetails";
import Link from "next/link";

export default function BookCatalogPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState<boolean>(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showWishlist, setShowWishlist] = useState<boolean>(false);
    const [seeMore, setSeeMore] = useState<boolean>(false);
    const [focusedBook, setFocusedBook] = useState<Book | null>(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const { accountId, isSignedIn } = useAuth();
    const [searchValue, setSearchValue] = useState({ title: '', author: '' });

    const [activePage, setActivePage] = useState(1);
    const booksPerPage = 12;

    const startIndex = (activePage - 1) * booksPerPage;
    const paginatedBooks = displayedBooks.slice(startIndex, startIndex + booksPerPage);

    const isMobile = useMediaQuery("(max-width: 768px)");

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
        setSearchValue({ title: '', author: '' });
    }

    const getBookData = () => {
        setLoading(true);
        getData<Book[]>("getAllBooks")
            .then((data: Book[]) => {
                const newData = data.filter(book => book.title?.trim()).sort((a, b) => a.title.localeCompare(b.title));
                setBooks(newData);
                getWishlist(newData);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setLoading(false);
            })
    }

    // Need to pass all books because we still want to display books if the user is not signed in

    const getWishlist = (allBooks: Book[]) => {
        if (!isSignedIn) {
            setDisplayedBooks(allBooks);
            setLoading(false);
            return;
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
        if (getSessionItem("is_admin") === true) {
            setAdmin(true);
        }
        if (isSignedIn === false) {
            setAdmin(false);
        }
    }, [isSignedIn]);


    const handleSearchChange = (newValue: { title?: string; author?: string }) => {
    setSearchValue(prev => ({ ...prev, ...newValue }));

    let filtered = books;

    if (newValue.title !== undefined || searchValue.title) {
        const query = newValue.title ?? searchValue.title;
        filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (newValue.author !== undefined || searchValue.author) {
        const query = newValue.author ?? searchValue.author;
        filtered = filtered.filter(book =>
        book.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
        );
    }

    if (showWishlist) {
        filtered = filtered.filter(book => wishlist.includes(book.isbn));
    }

    setDisplayedBooks(filtered);
    };

    // Handlers for going to see more component and going back

    const handleSeeMore = (book: Book) => {
        setSeeMore(true);
        setFocusedBook(book);
    }

    const handleBack = () => {
        setSeeMore(false);
        setFocusedBook(null);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                padding: "2rem",
            }}
        >

        <Link href="/bookChat" passHref>
            <Button
                variant="outline"
                radius="md"
                color="cyan"
                style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                fontWeight: 600,
                fontSize: "clamp(12px, 3vw, 16px)", // shrink on small screens
                padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 14px)", // scale padding
                color: "white",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderColor: "rgba(255,255,255,0.6)",
                zIndex: 500,
                whiteSpace: "nowrap", // prevent text wrapping
                }}
            >
                Chat with the Library Bot!
            </Button>
        </Link>

        <Link href="/contests" passHref>
            <Button
                variant="outline"
                radius="md"
                color="cyan"
                style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                fontWeight: 600,
                fontSize: "clamp(12px, 3vw, 16px)",
                padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 14px)",
                color: "white",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderColor: "rgba(255,255,255,0.6)",
                zIndex: 500,
                whiteSpace: "nowrap",
                }}
            >
                See Contest Winners!
            </Button>
        </Link>

        { !seeMore && 
        <Container size="xl" py="md" style={{ marginTop: '2rem' }}>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Paper
            withBorder
            radius="md"
            p="md"
            style={{
                background: "rgba(255, 255, 255, 0)", // semi-transparent
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                marginBottom: "1rem",
            }}
            >
            <div style={{ width: "100%", marginBottom: "1rem" }}>
            {/* Title */}
            <Title
                order={3}
                style={{
                textAlign: "center",
                color: "white",
                letterSpacing: "0.5px",
                fontSize: "clamp(16px, 4vw, 24px)",
                marginBottom: isMobile ? "0.5rem" : 0, // small spacing on mobile
                }}
            >
                Book Catalog
            </Title>

            {/* Buttons */}
            <Flex
                direction={isMobile ? "column" : "row"}
                align="center"
                justify={isMobile ? "center" : "space-between"}
                gap="sm"
            >
                {/* Wishlist button */}
                <Tooltip
                label="You must be signed in to use this feature"
                disabled={isSignedIn}
                withArrow
                position="top"
                >
                <span>
                    <Button
                    onClick={handleWishlistClick}
                    disabled={!isSignedIn}
                    variant="light"
                    radius="md"
                    color="cyan"
                    styles={{
                        root: {
                        fontWeight: 600,
                        color: "white",
                        borderColor: "rgba(255,255,255,0.6)",
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                        },
                    }}
                    >
                    {showWishlist ? "Show all books" : "Show wishlist"}
                    </Button>
                </span>
                </Tooltip>

                {/* Admin button */}
                {admin && (
                <Button
                    onClick={() => setOpened(true)}
                    variant="outline"
                    radius="md"
                    color="cyan"
                    styles={{
                    root: {
                        fontWeight: 600,
                        color: "white",
                        borderColor: "rgba(255,255,255,0.6)",
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                    },
                    }}
                >
                    Add/Remove Book
                </Button>
                )}
            </Flex>
            </div>


            <Group justify="center" mt="md">
                <Autocomplete
                style={{ width: "45%" }}
                placeholder="Search by title"
                value={searchValue.title}
                data={Array.from(new Set(displayedBooks.map(book => book.title)))}
                onChange={(value) => handleSearchChange({ title: value })}
                limit={10}
                clearable
                />
                <Autocomplete
                style={{ width: "45%" }}
                placeholder="Search by author"
                value={searchValue.author}
                data={Array.from(new Set(displayedBooks.flatMap(book => book.authors)))}
                onChange={(value) => handleSearchChange({ author: value })}
                limit={10}
                clearable
                />
            </Group>
            </Paper>

            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing="md"
            >
                {paginatedBooks.map((book) => (
                    <BookCard
                    key={book.isbn}
                    book={book}
                    addRemoveWishlist={addRemoveWishlist}
                    inWishlist={wishlist.includes(book.isbn)}
                    handleSeeMore={handleSeeMore}
                    />
                ))}
            </SimpleGrid>
            {displayedBooks.length > booksPerPage && (
            <Flex justify="center" mt="lg">
                <Pagination
                total={Math.ceil(displayedBooks.length / booksPerPage)}
                value={activePage}
                onChange={setActivePage}
                size="md"
                radius="md"
                color="cyan"
                styles={{
                    control: {
                        backgroundColor: "rgba(255, 255, 255, 0)", // frosted glass
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "white",
                        transition: "all 0.2s ease",
                        '&:hover:not([dataActive])': {
                            boxShadow: "0 0 10px rgba(0, 255, 255, 0.7)",
                        },
                        '&[dataActive]': {
                            backgroundColor: "rgba(0, 255, 255, 0.4)", // active page glow
                            border: "1px solid rgba(0, 255, 255, 0.8)",
                            color: "white",
                            boxShadow: "0 0 12px rgba(0, 255, 255, 0.9)",
                        },
                    },
                }}
                />
            </Flex>
            )}
            <AddBookModal
                opened={opened}
                onClose={onClose}

            />
        </Container>}
        { seeMore && focusedBook &&
            <BookDetails book={focusedBook} handleBack={handleBack} />
        }
        </div>
    );
}