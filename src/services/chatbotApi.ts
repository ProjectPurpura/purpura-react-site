import { Message } from "../store/chatStore";
import { getSessionUser } from "../auth/authState";
import { getChatSession } from "../store/chatSession";


export const sendMessageToChatbot = async (text: string): Promise<string> => {
  const chatbotApiBase = process.env.REACT_APP_CHATBOT_URL ?? '';
  const session = getSessionUser() as Record<string, any> | undefined;
  const senderId = typeof session?.cnpj === 'string' ? session.cnpj : '';
  const chatId = getChatSession();

  const controller = new AbortController();
  const timeoutMs = 30_000; // 30 segundos
  const timeoutId = setTimeout(() => {
    console.error('[Chatbot] Timeout atingido (' + timeoutMs + 'ms)');
    controller.abort();
  }, timeoutMs);

  try {
    const res = await fetch(`${chatbotApiBase}/chat/${chatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, content: text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('[Chatbot] Status da resposta:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Chatbot] Erro HTTP:', res.status, errText);
      throw new Error('Erro ao enviar mensagem para o chatbot');
    }

    const resposta = await res.json();
    console.log('[Chatbot] Resposta recebida:', resposta);

    return resposta.content ?? 'Sem resposta da IA.';
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[Chatbot] Timeout de comunicação atingido!');
      throw new Error('Tempo de resposta excedido.');
    } else {
      console.error('[Chatbot] Erro desconhecido:', error);
      throw error;
    }
  }
};



export const fetchChatHistory = async (cnpj: string): Promise<Message[]> => {
  const CHATBOT_API_BASE = process.env.REACT_APP_CHATBOT_URL;
  
  if (!CHATBOT_API_BASE) {
    throw new Error("URL da API do Chatbot não definida no .env");
  }
  
  if (!cnpj) {
    console.warn("CNPJ não fornecido para buscar histórico");
    return [];
  }

  try {
    const response = await fetch(`${CHATBOT_API_BASE}/chat?senderId=${cnpj}&chatId=${cnpj}`);

    if (!response.ok) {
      console.error(`Erro ao buscar histórico de chat: ${response.status} ${response.statusText}`);
      return [];
    }

    const dataFromServer: any[] = await response.json();
    
    const translatedData: Message[] = dataFromServer.map((msg: any) => ({
      messageId: msg.id || msg.messageId || `msg-${Date.now()}-${Math.random()}`,
      senderId: msg.senderId || '',
      corpo: msg.content || msg.corpo || '',
      timestamp: msg.timestamp || Date.now(),
      read: msg.read !== undefined ? msg.read : true,
      isUser: msg.senderId === cnpj,
    }));

    return translatedData;
  } catch (error) {
    console.error("Falha ao buscar histórico de chat:", error);
    return [];
  }
};