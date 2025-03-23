export function handleFileAttached(file: File): Promise<{ filePath: string, file: File }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event: ProgressEvent<FileReader>) => {
			const result = event.target?.result as string;
			resolve({ filePath: result, file });
		};

		reader.onerror = (ev) => {
			reject(ev)
		}
		reader.readAsDataURL(file);
	})
}