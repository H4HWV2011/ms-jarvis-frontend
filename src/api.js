// Ms. Jarvis API Gateway call - uses ngrok HTTPS endpoint
export async function sendMsJarvisMessage(message, instance = "public") {
    const endpoint = instance === "proprietary"
        ? "https://cb7e75ba9152.ngrok-free.app/api/chat/proprietary"
        : "https://cb7e75ba9152.ngrok-free.app/api/chat/public";
    const headers = {
        "Content-Type": "application/json"
    };
    // Add API key if proprietary
    if (instance === "proprietary") {
        headers["x-api-key"] = "MS-TEAM-2025-SECURE";
    }
    const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error("API error: " + response.status);
    return response.json();
}
