import { AxiosError } from "axios";
import * as NodeMailer from "nodemailer";
import Mail = require("nodemailer/lib/mailer");
import SMTPPool = require("nodemailer/lib/smtp-pool");
import { whatsAppBaseUrl } from "../config/axios.config";
import { NotificationType } from "../models/NotificationType";
import { TemplateMessage } from "../models/TemplateMessage";
import { messageTemplate } from "../utils";

const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
	apiKey: process.env.VITE_APP_VONAGE_API_KEY,
	apiSecret: process.env.VITE_APP_VONAGE_API_SECRET,
});

export function notificationViaWhatsApp(notification: NotificationType, templateName: TemplateMessage) {
	return new Promise((resolve, reject) => {
		for (const user of notification.userAddressTo) {
			const data = {
				"messaging_product": "whatsapp",
				"to": user.phoneNumber,
				"type": "template",
				"template": {
					"name": templateName,
					"language": {
						"code": "pt_PT",
					},
					"components": [
						{
							"type": "header",
							"parameters": [
								{
									"type": "text",
									"text": notification.teamName,
								},
							],
						},
						{
							"type": "body",
							"parameters": [
								{
									"type": "text",
									"text": user.displayName,
								},
								{
									"type": "text",
									"text": notification.taskName,
								},
								{
									"type": "text",
									"text": notification.workspaceName,
								},
							],
						},
					],
				},
			};

			whatsAppBaseUrl
				.post<{ messages: [{ id: string, message_status: string }] }>("/234675569734199/messages", data, {
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer EAAU6alICHp0BOZC2TZBYu12XgaRICgEINAlVWbkirXkGlpfpkasrOOoNNOu19AZCrvTXqrZAA9mW5hfDCQX5nsTZAGGmpf5dnnAvHPnwfmMHfCZBYVdNmZAZBBUUgx5QliczkxZAYc68sAGJEJxbr8UMO3MGBcNZBOIueRfXna10ZCkpuWZCxkd5ZA4iJDZAK1Az7NgVEjpcKYZBVaU1FjY3DilabbDGwQGDJPBlEZBYLIgZD",
					},
				})
				.then((response) => {
					console.log(response.data);
					resolve(response.data);
				})
				.catch((error: AxiosError) => {
					console.log(error.code, error.cause);
					reject(error.message);
				});
		}
	});
}

export function notificationViaSms(notification: NotificationType, template: TemplateMessage) {
	return new Promise((resolve, reject) => {
		for (const user of notification.userAddressTo) {
			const from = "ZenTaak";
			const to = user.phoneNumber;
			const text = messageTemplate(notification, template, user.displayName);

			vonage.sms.send({ to, from, text })
				.then((resp: any) => {
					console.log("Message sent successfully");
					console.log(resp);
					resolve(resp);
				})
				.catch((err: any) => {
					console.log("There was an error sending the messages.");
					console.error(err);
					reject(err);
				});
		}
	});
}

export function notificationViaEmail(notification: NotificationType, template: TemplateMessage) {
	return new Promise((resolve, reject) => {
		const transporter = NodeMailer.createTransport({
			pool: true,
			host: "smtp.zoho.com",
			port: 465,
			secure: true,
			auth: {
				user: "notification@app.zentaak.com",
				pass: "N@03xiste",
			},
		});

		const { userAddressTo, userNameNotificationFrom, taskName } = notification;

		const subject = template === "task_assigned" ? `Foste atribuído(a) a tarefa ${taskName}` : template === "task_commented" ? `${userNameNotificationFrom} comentou em ${taskName}` : template === "task_change_state" ? "" : "";

		for (const user of userAddressTo) {
			const mailOptions: Mail.Options = {
				from: "notification@app.zentaak.com",
				to: user.email,
				subject,
				text: messageTemplate(notification, template, user.displayName, false),
			};

			transporter.sendMail(mailOptions, (error: Error | null, info: SMTPPool.SentMessageInfo) => {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log("Email sent: " + info.response);
				}
			});
		}
		resolve(true);
	});
}
