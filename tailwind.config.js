/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./docs/.vitepress/**/*.{js,ts,vue}',
		'./docs/**/*.md',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				"coollabs": "#6b16ed",
				"coollabs-100": "#7317ff",
				"coolgray-100": "#181818",
				"coolgray-200": "#202020",
				"coolgray-300": "#242424",
				"coolgray-400": "#282828",
				"coolgray-500": "#323232",
			}
		}
	}
}