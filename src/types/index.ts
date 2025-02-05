export interface Message {
	id?: string;
	sender: string;
	content: string;
	timestamp: Date;
	chatId: string;
}

export interface ChatResponse {
	generatedText: string;
	prompt: string;
	model: string;
}
