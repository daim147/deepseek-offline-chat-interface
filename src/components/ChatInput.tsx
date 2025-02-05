// src/components/ChatInput.tsx
import React, { useState } from 'react';

interface ChatInputProps {
	onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
	const [input, setInput] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			onSend(input.trim());
			setInput('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='max-w-3xl mx-auto'>
			<div className='relative'>
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Send a message...'
					className='w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
					rows={1}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSubmit(e);
						}
					}}
				/>
				<button
					type='submit'
					className='absolute right-2 top-2.5 p-1 rounded-md text-gray-500 hover:bg-gray-100'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
