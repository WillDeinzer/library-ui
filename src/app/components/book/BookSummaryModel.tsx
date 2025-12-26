import { getData } from "@/app/services/apiService";
import { useEffect, useState } from "react";
import { Summary } from "@/app/types/types";
import { LoadingOverlay, Modal, Stack, Text, Title } from "@mantine/core";

interface BookSummaryProps {
    opened: boolean,
    isbn: string,
    onClose: () => void;
}

export default function BookSummaryModel({opened, isbn, onClose}: BookSummaryProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        setLoading(true)
        const headers = {
            "isbn": isbn
        }
        getData<Summary>("getBookSummary", headers)
            .then((data: Summary) => {
                console.log(data.summary);
                setSummary(data.summary);
            })
            .catch((error) => {
                console.log("Error fetching summary", error);
            })
        setLoading(false);
    }, [isbn])

    return (
        <Modal
            size="lg"
            opened={opened}
            onClose={onClose}
            centered
        >
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Stack align="center">
                <Title order={4}>Book Summary</Title>
                <Text>{summary}</Text>
            </Stack>
        </Modal>
    )
}