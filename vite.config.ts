import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/* import tailwindcss from '@tailwindcss/vite' */

import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve("app"),
			"@styles": path.resolve("app/src/styles"),
			"@services": path.resolve("app/src/services"),
			"@components": path.resolve("app/src/components"),
			"@pages": path.resolve("app/src/pages"),
			"@hooks": path.resolve("app/src/hooks"),
			"@database": path.resolve("app/src/database"),
			"@routes": path.resolve("app/src/routes/"),
			"@types": path.resolve("app/src/types"),
			"@repositories": path.resolve("app/src/repositories"),
			"@utils": path.resolve("app/src/utils"),
			"@store": path.resolve("app/src/store"),
			"@schemas": path.resolve("app/src/schemas"),
		},
	},
	plugins: [
		react(),
		/* tailwindcss() */
	],
})
