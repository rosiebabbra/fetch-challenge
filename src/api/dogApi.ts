// src/services/api.ts
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function login(name: string, email: string): Promise<boolean> {

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "User-Agent": "PostmanRuntime/7.43.0",
        },
        body: JSON.stringify({ name, email }),
        credentials: "include",
    });

    const bodyText = await response.text();
    console.log("Raw Response Body:", bodyText);

    if (!response.ok) {
        console.error("Login failed with status:", response.status);
        return false;
    }

    return response.ok;
}

export async function getDogIds(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/dogs/search`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dogs");
    }

    return response.json();
}

export async function logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    console.log("Logged out successfully");
}
