// src/services/db.ts
import Dexie, { Table } from 'dexie';
import { Message } from '../types';

interface ChatMessage extends Message {
	chatId: string;
}

export class ChatDatabase extends Dexie {
	messages!: Table<ChatMessage>;

	constructor() {
		super('ChatDatabase');
		this.version(1).stores({
			messages: '++id, chatId, title, sender, content, timestamp',
		});
	}
}

export const db = new ChatDatabase();

// Helper functions
export const saveMessage = async (chatId: string, message: Message) => {
	await db.messages.add({
		...message,
		chatId,
		timestamp: new Date(),
	});
};

export const getChatMessages = async (chatId: string) => {
	return await db.messages.where('chatId').equals(chatId).sortBy('timestamp');
};

export const getAllChats = async () => {
	const uniqueChats = await db.messages.orderBy('chatId').uniqueKeys();
	return uniqueChats as string[];
};

export const getFirstMessageByChat = async () => {
	const uniqueChats = await db.messages.orderBy('timestamp').toArray();

	const chatMap = new Map();

	uniqueChats.forEach((message) => {
		if (!chatMap.has(message.chatId)) {
			chatMap.set(message.chatId, {
				chatId: message.chatId,
				firstMessage: message.content,
				timestamp: message.timestamp,
			});
		}
	});

	return Array.from(chatMap.values());
};

export const deleteChat = async (chatId: string) => {
	await db.messages.where('chatId').equals(chatId).delete();
};
