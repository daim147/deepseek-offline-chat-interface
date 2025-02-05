// src/services/api.ts
export const generateResponse = async (prompt: string, onChunkReceived: (text: string) => void) => {
	try {
		const response = await fetch('http://localhost:11434/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'deepseek-r1:1.5b',
				prompt: prompt,
			}),
		});

		const reader = response.body?.getReader();
		const decoder = new TextDecoder();
		let fullText = '';

		while (reader) {
			const { value, done } = await reader.read();
			if (done) break;

			// Decode the chunk and split into lines
			const chunk = decoder.decode(value);
			const lines = chunk.split('\n').filter((line) => line.trim());

			// Process each line as a JSON response
			for (const line of lines) {
				try {
					const data = JSON.parse(line);
					if (!data.done) {
						fullText += data.response;
						onChunkReceived(data.response);
					}
				} catch (e) {
					console.error('Error parsing JSON:', e);
				}
			}
		}

		return fullText;
	} catch (error) {
		console.error('API Error:', error);
		return 'Sorry, an error occurred while generating the response.';
	}
};
