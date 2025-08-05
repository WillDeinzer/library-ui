"use client";
import { useEffect, useState } from "react";
import { Book } from "../types/types";
import { getData } from "../services/apiService";

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
        <div>Book Catalog Page</div>
    )
}