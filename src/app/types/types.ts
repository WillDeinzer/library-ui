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