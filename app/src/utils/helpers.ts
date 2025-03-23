import moment from './../../momentjs';


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

declare global {
	interface Date{
		convertToString(): string
	}
}

Date.prototype.convertToString = function (): string {
	const date = moment(this)
	const currentDay = new Date().getDate()
	const day = this.getDate()

	if (day === currentDay) {
		return date.calendar()
	} else if (day === (currentDay - 1)) {
		return date.subtract(1, 'days').calendar()
	}

	return date.format("DD-MM-YYYY")
}