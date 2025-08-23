import { postData } from "@/app/services/apiService";
import { addBookData } from "@/app/types/types";
import { Button, LoadingOverlay, Modal, Stack, Title, TextInput, Tooltip, ActionIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface bookModalProps {
    opened: boolean,
    onClose: () => void;
}

export default function AddBookModal({ opened, onClose}: bookModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [ISBN, setISBN] = useState<string>("");
    const [add, setAdd] = useState<boolean>(true);
    
    const handleBookSubmit = () => {
        setLoading(true);
        const bookData : addBookData = {
            "isbn": ISBN
        }
        postData<addBookData>((add ? 'addBookFromISBN' : 'removeBookFromISBN'), bookData)
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

    const setDefaults = () => {
        setISBN("");
        setAdd(true);
    }

    return (
        <Modal
            size="sm"
            opened={opened}
            onClose={onClose}
        >
            <Tooltip label={add ? "Remove book" : "Add book"}>
                <ActionIcon
                    color={!add ? "red" : "green"}
                    size="lg"
                    onClick={() => setAdd(!add)}
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        zIndex: 10
                    }}
                >
                    {!add ? <IconX size={20} /> : <IconCheck size={20} />}
                </ActionIcon>
            </Tooltip>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Stack align="center">
                <Title order={4}>{add ? "Add a book to the library" : "Remove a book from the library"}</Title>
                <TextInput 
                    placeholder="Insert ISBN"
                    value={ISBN}
                    onChange={(event) => setISBN(event.currentTarget.value)}
                />
                <Button
                    size="md"
                    onClick={handleBookSubmit}
                >Submit</Button>
            </Stack>
        </Modal>
    )
}