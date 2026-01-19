// services/aiService.ts
// @ts-ignore
import api from "../lib/api";

const API_URL = "/ai";

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
  chatId?: number | null
): Promise<AIResponse> => {
  // نرسل chatId ضمن الـ body
  const res = await api.post<AIResponse>(
    `${API_URL}/ask`,
    { message, lang, chatId }
  );

  return res.data;
};

export const getChats = async (): Promise<Chat[]> => {
  const res = await api.get<Chat[]>(`${API_URL}/chats`);

  return res.data;
};

export const getChatMessages = async (
  chatId: number
): Promise<AIMessage[]> => {
  const res = await api.get<AIMessage[]>(`${API_URL}/${chatId}/messages`);

  return res.data;
};

export const deleteChat = async (chatId: number) => {
  const res = await api.delete(`${API_URL}/${chatId}`);

  return res.data;
};
