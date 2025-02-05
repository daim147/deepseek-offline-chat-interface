/** @type {import('tailwindcss').Config} */
import { colors } from './src/constants/colors';
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			colors,
		},
	},
	plugins: [],
};
