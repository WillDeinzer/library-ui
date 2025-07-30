const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getData<T>(url: string, headers?: HeadersInit): Promise<T> {
    const fullUrl = `${API_URL}/${url}`;
    const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function postData<T>(url: string, data: any, headers?: HeadersInit): Promise<T> {
    const fullUrl = `${API_URL}/${url}`;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}