import React, { useEffect, useState } from 'react';
import Chat from './components/Chat';
import { getAllChats, getChatMessages, deleteChat, getFirstMessageByChat } from './services/db';
import './App.css';
import { useLiveQuery } from 'dexie-react-hooks';

const App: React.FC = () => {
	const [currentChatId, setCurrentChatId] = useState<string>('');
	const messages = useLiveQuery(() => getChatMessages(currentChatId), [currentChatId]);
	const chats = useLiveQuery(() => getAllChats(), []);
	const firstMessage = useLiveQuery(() => getFirstMessageByChat(), []);


	useEffect(() => {
		if (chats === undefined) return;
		if (chats.length > 0 && !currentChatId) {
			setCurrentChatId(chats[0]);
		} else if (chats.length === 0 && !currentChatId) {
			setCurrentChatId(`chat-${Date.now()}`);
		}
	}, [chats, currentChatId]);

	const handleNewChat = () => {
		const newChatId = `chat-${Date.now()}`;
		setCurrentChatId(newChatId);
	};

	const handleDeleteChat = async (chatId: string) => {
		await deleteChat(chatId);
		if (currentChatId === chatId) {
			setCurrentChatId('');
		}
	};

	return (
		<div className='h-screen bg-gray-50 flex flex-col'>
			<div className='flex-1 flex overflow-hidden'>
				<div
					className='
			min-w-64	flex-[.1] bg-[#221128] text-white md:block p-4'
				>
					<nav className='shadow-sm'>
						<div className='max-w-7xl mx-auto py-4'>
							<h1 className='text-2xl font-semibold'>DeepYeet</h1>
						</div>
					</nav>
					<button
						onClick={handleNewChat}
						className='w-full bg-white/10 hover:bg-white/20 rounded-lg p-3 text-left mb-2 flex items-center'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 mr-2'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z'
								clipRule='evenodd'
							/>
						</svg>
						New Chat
					</button>
					<div className='border-t border-white/20 mt-4 pt-4'>
						<h2 className='text-sm font-medium mb-2'>Previous Chats</h2>
						{chats?.map((chatId) => (
							<button
								key={chatId}
								onClick={() => setCurrentChatId(chatId)}
								className={`w-full text-left p-2  rounded-lg mb-1 ${
									currentChatId === chatId ? 'bg-white/20' : 'hover:bg-white/10'
								}`}
							>
								<span className='w-[90%] inline-block truncate'>
									{firstMessage?.find((chat) => chat.chatId === chatId)?.firstMessage ||
										'No messages Yet'}
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteChat(chatId);
									}}
									className='float-right text-gray-400 hover:text-red-400'
								>
									×
								</button>
							</button>
						))}
					</div>
				</div>

				<div className='flex-[.9] flex flex-col bg-white'>
					<Chat chatId={currentChatId} messages={messages} />
				</div>
			</div>
		</div>
	);
};

export default App;
