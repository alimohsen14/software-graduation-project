// services/aiService.ts
// @ts-ignore
import axios from "axios";

const API_URL = "http://localhost:3000/ai";

export type AIResponse = {
  answer: string;
  chatId: number;
  title: string;
};

export type Chat = {
  id: number;
  title: string;
  createdAt: string;
};

export type AIMessage = {
  id: number;
  chatId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

// التعديل هنا: أضفنا chatId كباراميتر اختياري
export const askAI = async (
  message: string,
  lang: "ar" | "en",
  token: string,
  chatId?: number | null
): Promise<AIResponse> => {
  // نرسل chatId ضمن الـ body
  const res = await axios.post<AIResponse>(
    `${API_URL}/ask`,
    { message, lang, chatId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getChats = async (token: string): Promise<Chat[]> => {
  const res = await axios.get<Chat[]>(`${API_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getChatMessages = async (
  chatId: number,
  token: string
): Promise<AIMessage[]> => {
  const res = await axios.get<AIMessage[]>(`${API_URL}/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteChat = async (chatId: number, token: string) => {
  const res = await axios.delete(`${API_URL}/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
