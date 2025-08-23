const API_URL = 'https://library-api-production-dccc.up.railway.app'

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