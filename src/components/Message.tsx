// src/components/Message.tsx
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { Message as MessageType } from '../types';

interface MessageProps {
	message: MessageType;
}

const codeSyntaxHighlighter = {
	code(props) {
		const { children, className, _, ...rest } = props;
		const match = /language-(\w+)/.exec(className || '');
		return match ? (
			<SyntaxHighlighter
				{...rest}
				PreTag='div'
				children={String(children).replace(/\n$/, '')}
				language={match[1]}
				style={oneDark}
			/>
		) : (
			<code {...rest} className={className}>
				{children}
			</code>
		);
	},
};

const Message: React.FC<MessageProps> = memo(({ message }) => {
	const isBot = message.sender === 'Bot';
	const formatContent = (content: string) => {
		const parts = content.split(/(<think>|<\/think>)/).filter(Boolean);
		let isThinking = false;
		let formattedContent = '';

		parts.forEach((part) => {
			if (part === '<think>') {
				isThinking = true;
			} else if (part === '</think>') {
				isThinking = false;
			} else if (part.trim()) {
				const cleanPart = part.trim().replace(/\n+/g, '<br>');
				if (cleanPart)
					formattedContent += isThinking
						? `<div style="background-color: #f7fafc; border-left: 4px solid #cbd5e0; padding: 0rem 1rem; margin: 0.5rem 0;">
						<em style="font-size:14px;">${cleanPart}</em>
				</div>
				`
						: part;
			}
		});
		return formattedContent;
	};
	return (
		<div className={`flex ${isBot ? `bg-gray-50` : 'justify-end'} p-6 max-w-full`}>
			<div
				className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					isBot ? `bg-[#221128]` : 'hidden'
				} text-white font-semibold text-sm`}
			>
				{isBot ? 'AI' : 'U'}
			</div>
			<div className={`pl-4 ${isBot ? 'w-[70%]' : 'max-w-[40%]'}`}>
				<div className={`max-w-full ${!isBot ? ' p-4 bg-[#2211280c] rounded-lg break-all' : ''}`}>
					{isBot ? (
						<ReactMarkdown
							remarkPlugins={[remarkGfm, remarkMath]}
							rehypePlugins={[rehypeKatex, rehypeRaw]}
							components={codeSyntaxHighlighter}
						>
							{formatContent(message.content)}
						</ReactMarkdown>
					) : (
						message.content
					)}
				</div>
			</div>
		</div>
	);
});

export default Message;
