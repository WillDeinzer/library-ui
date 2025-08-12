export interface Book {
    isbn: string;
    title: string;
    authors: string[];
    publishers: string[];
    publication_date: string;
    genres: string[];
    pages: number;
    image: string;
}

export interface Review {
    review_id: number;
    account_id: number;
    review_text: string;
    rating: number;
    review_date: string;
    book_isbn: string;
}

export interface addBookData {
    isbn: string;
}

export interface wishlistData {
    account_id: number;
    isbn: string;
}

export interface submitReviewData {
    account_id: number;
    review_text: string;
    rating: number;
    book_isbn: string;
}

export interface Message {
    from: "user" | "bot";
    text: string;
}