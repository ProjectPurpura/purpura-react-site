
const CHAT_SESSION_KEY = 'chatSessionId';

export const newChatSession = (): string => {
    localStorage.removeItem(CHAT_SESSION_KEY);
    const newSessionId = crypto.randomUUID();

    localStorage.setItem(CHAT_SESSION_KEY, newSessionId);
    return newSessionId;
}

export const getChatSession = (): string => {
    let sessionId = localStorage.getItem(CHAT_SESSION_KEY);
    if (!sessionId) {
        sessionId = newChatSession();
    }
    return sessionId;
}

export const clearChatSession = (): void => {
    localStorage.removeItem(CHAT_SESSION_KEY);
}