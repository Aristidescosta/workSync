import moment from './../../momentjs';
import { AttachmentFileType } from "../types/AttachmentFileType";
import { Timestamp } from "firebase/firestore";
import { TagType } from "../types/TagType";

declare global {
	interface Date {
		convertToString(): string
		toStringDate(): string
		getMinutesAfterComment(): number
		getDayAndMonth(): string
		getDueDays(): number
		addDaysToGetDateOfSubscription(days: number): Date
		getRemainSubscriptionDays(n?: boolean): number | string
	}

	interface String {
		convertToDate(): Date
		getExtensionFile(): string
		mergeToUrlParameter(): string
	}

	interface Number {
		convertToKwanzaMoney(): string
		convertToSystemNumerical(withUnit: boolean): string | number
	}
}

export const zenTaakTags: TagType[] = [
	{ tag: 'Atrasado', description: 'Tarefas que estão atrasadas e passaram do prazo.', color: '#fe951a' },
	{ tag: 'Trabalho', description: 'Tarefas relacionadas a actividades profissionais.', color: '#1F497D' },
	{ tag: 'Pessoal', description: 'Tarefas pessoais e actividades não relacionadas ao trabalho.', color: '#FFD700' },
	{ tag: 'Prioridade Alta', description: 'Tarefas que exigem atenção imediata ou são críticas.', color: '#FF6347' },
	{ tag: 'Reunião', description: 'Tarefas associadas a reuniões ou discussões.', color: '#87CEEB' },
	{ tag: 'Aguardando Resposta', description: 'Tarefas que estão aguardando feedback ou resposta de terceiros.', color: '#FFA500' },
	{ tag: 'Precisa de ajuda', description: 'Tarefas com dificuldades e que requer assistência adicional.', color: '#FFA500' },
	{ tag: 'Concluída', description: 'Tarefas que foram concluídas ou finalizadas.', color: '#1B8672' },
	{ tag: 'Urgente', description: 'Tarefas que requerem atenção imediata devido à sua urgência.', color: '#FF0000' },
]

export function sortEditedMessages(a: {
	message: string;
	updatedAt: Timestamp;
}, b: {
	message: string;
	updatedAt: Timestamp;
}) {
	return b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
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

Date.prototype.toStringDate = function (): string {
	return moment(this).format("DD-MM-YYYY")
}

Date.prototype.getMinutesAfterComment = function (): number {
	const today = new Date()
	return today.getTime() - this.getTime()
}

Date.prototype.getDayAndMonth = function (): string {
	return moment(this).format('D MMM')
}

Date.prototype.getDueDays = function (): number {
	const due = moment().diff(this, "days")

	if (due < 0) {
		return 0
	}
	return due
}

Date.prototype.addDaysToGetDateOfSubscription = function (days: number): Date {
	return moment(this).add(days, 'days').toDate()
}

Date.prototype.getRemainSubscriptionDays = function (n?: boolean): number | string {
	const today = moment()
	const expirationDate = moment(this)
	const days = expirationDate.diff(today, "days")

	if (n) {
		return days
	}

	if (days > 1) {
		return `${days} dias`
	}

	return `${days} dia`
}

Number.prototype.convertToKwanzaMoney = function () {
	const [numericalPart, decimalPart] = this.toFixed(2).toString().split('.');
	const numericalPartFormated = numericalPart.replace(/(\d)(?=(\d{3})+$)/g, '$1.');

	if (decimalPart) {
		return `${numericalPartFormated},${decimalPart} Kz`;
	}
	return `${numericalPartFormated},00 Kz`;
}

Number.prototype.convertToSystemNumerical = function (this: number, withUnit: boolean): string | number {
	const value = this // eslint-disable-line @typescript-eslint/no-this-alias

	if (withUnit) {
		if (value >= 1000000 && value <= 999999999) {
			return `${(value / (1000 * 1000)).toFixed(2).replace(".00", "")} MB`
		}

		if (value >= 1000000000 && value <= 999999999999) {
			return `${(value / (1000 * 1000 * 1000)).toFixed(2).replace(".00", "")} GB`
		}

		if (value >= 1000000000000) {
			return `${(value / (1000 * 1000 * 1000 * 1000)).toFixed(2).replace(".00", "")} TB`
		}

		return `${(value / 1000).toFixed(2).replace(".00", "")} KB`
	} else {

		if (value >= 1000000 && value <= 999999999) {
			return value / (1000 * 1000)
		}

		if (value >= 1000000000 && value <= 999999999999) {
			return value / (1000 * 1000 * 1000)
		}

		if (value >= 1000000000000) {
			return value / (1000 * 1000 * 1000 * 1000)
		}

		return value / 1000
	}
}


String.prototype.convertToDate = function (this: string): Date {
	return new Date(this);
}

String.prototype.getExtensionFile = function (): string {
	try {
		const stringArray = this.split('.')
		const extension = stringArray[stringArray.length - 1]
		return extension
	} catch (error) {
		console.log(error)
		throw Error("Ocorreu um erro ao extrair o anexo")
	}
}

String.prototype.mergeToUrlParameter = function (): string {
	return this.replace(/[\W_]+/g, "")
}

export function convertToSimulatedFile(attachment: AttachmentFileType): File {
	const createdAt = attachment.createdAt instanceof Date ? attachment.createdAt : new Date();
	const blob = new Blob([JSON.stringify(attachment)], { type: 'application/json' });
	const file = new File([blob], attachment.fileName, { lastModified: createdAt.getTime(), type: 'application/json' });
	return file;
}

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