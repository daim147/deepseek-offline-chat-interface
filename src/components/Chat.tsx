import React, { useEffect, useState } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { generateResponse } from '../services/api';
import { saveMessage } from '../services/db';
import { Message as MessageType } from '../types';

const Chat: React.FC<{
	chatId: string;
	messages: MessageType[] | undefined;
}> = ({ chatId, messages }) => {
	const [botMessage, setBotMessage] = useState<MessageType | undefined>();
	const [isMessageStreamed, setIsMessageStreamed] = useState(false);
	const messagesToDisplay: MessageType[] = [];
	if (messages && messages.length > 0) {
		messagesToDisplay.push(...messages);
		if (botMessage) {
			messagesToDisplay.push(botMessage);
		}
	}

	useEffect(() => {
		if (!isMessageStreamed || !botMessage) return;

		(async () => {
			await saveMessage(chatId, botMessage);
			setBotMessage(undefined);
			setIsMessageStreamed(false);
		})();
	}, [isMessageStreamed, botMessage, chatId]);

	const handleSendMessage = async (text: string) => {
		setIsMessageStreamed(false);
		if (!chatId) return;

		// Add user message
		const userMessage: MessageType = {
			sender: 'User',
			content: text,
			timestamp: new Date(),
			chatId,
		};
		// setMessages((prev) => [...prev, userMessage]);
		await saveMessage(chatId, userMessage);

		// Add empty bot message
		const botMessage: MessageType = {
			sender: 'Bot',
			content: '',
			timestamp: new Date(),
			chatId,
		};
		// setMessages((prev) => [...prev, botMessage]);
		setBotMessage(botMessage);

		try {
			await generateResponse(text, (chunk) => {
				setBotMessage((prev) => {
					if (!prev) return prev;
					return { ...prev, content: prev.content + chunk };
				});
			});
			// Save final bot message
			setIsMessageStreamed(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className='flex-1 w-full overflow-y-auto p-4 space-y-6'>
				{!messages || messages?.length === 0 ? (
					<div className='flex items-center justify-center h-full'>
						<div className='text-center text-gray-500'>
							<h2 className='text-2xl font-semibold mb-2'>Welcome to DeepYeek Chat</h2>
							<p className='text-sm'>Start a conversation and explore the possibilities!</p>
						</div>
					</div>
				) : (
					messagesToDisplay.map((msg, index) => <Message key={index} message={msg} />)
				)}
			</div>
			<div className='border-t p-4'>
				<ChatInput onSend={handleSendMessage} />
			</div>
		</>
	);
};

export default Chat;
