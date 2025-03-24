// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
export const theme = createTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		}
	},
});


export const ZenTaakTheme = extendTheme({
	styles: {
		global: {
			body: {
				bg: "gray.50",
				color: "gray.800",
			},

			"::-webkit-scrollbar": {
				width: "0.4em",
			},
			"::-webkit-scrollbar-track": {
				background: "transparent",
			},
			"::-webkit-scrollbar-thumb": {
				background: "transparent",
			},
		},
	},

	fonts: {
		heading: `'Poppins', sans-serif`,
		body: `'Roboto', sans-serif`,
	},

	colors: {
		gray: {
			50: "#eaeaea",
			100: "#bebebf",
			200: "#9e9ea0",
			300: "#727275",
			400: "#56565a",
			500: "#2c2c31",
			600: "#28282d",
			700: "#1f1f23",
			800: "#18181b",
			900: "#121215",
		},

		red: {
			100: "#FF2A00",
			200: "#dd0000",
		},

		blue: {
			100: "#0A52CC",
		},

		yellow: {
			100: "#EAC74C",
			200: "#FFBC33",
		},

		purple: {
			50: "#f3eefc",
			100: "#d8cbf7",
			200: "#c6b2f3",
			300: "#ab8eee",
			400: "#9b79ea",
			500: "#8257e5",
			600: "#764fd0",
			700: "#5c3ea3",
			800: "#48307e",
			900: "#372560",
		},
		green: {
			50: "#e6fbef",
			100: "#b1f1ce",
			200: "#8cebb6",
			300: "#57e295",
			400: "#36dc81",
			500: "#04d361",
			600: "#04c058",
			700: "#039645",
			800: "#027435",
			900: "#025929",
		},
	},

	radii: {
		none: 0,
		200: "6px",
		full: "9999px",
	},

	components: {
		Button: {
			baseStyle: {
				borderRadius: "5px",
				fontWeight: "500",
				border: "0px",
				_hover: {
					filter: "brightness(0.9)",
				},
			},
			variants: {
				primary: {
					bg: "red.200",
					color: "white",
					_hover: {
						bg: "red.100",
						opacity: 0.8,
					},
				},
				info: {
					bg: "blue.100",
					color: "white",
					_hover: {
						bg: "blue.100",
						opacity: 0.8,
					},
				},
				secondary: {
					bg: "white",
					color: "gray.600",
					border: "1px solid #ddd",
					fontSize: "14px",
					_hover: {
						filter: "brightness(1)",
						border: "1px solid #ccc",
					},
				},

				outline: {
					bg: "#fff",
					color: "red.200",
					borderWidth: 1,
					borderColor: "red.200",
					_hover: {
						background: "white",
					},
				},
			},
		},
	},
});
