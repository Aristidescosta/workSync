import { CallableRequest } from "firebase-functions/v2/https";
import * as NodeMailer from "nodemailer";
import Mail = require("nodemailer/lib/mailer");
import SMTPPool = require("nodemailer/lib/smtp-pool");
import { SendMailType } from "../models/SendMailType";
import { SETTINGS_PATH, ZEN_TAAK_DOMAIN } from "../utils";
// import { notificationViaWhatsApp } from "./controllerNotification";
import { FirestoreDataConverter, getFirestore } from "firebase-admin/firestore";
import { SettingsType } from "../models/SettingsType";
import { notificationViaEmail, notificationViaSms, notificationViaWhatsApp } from "./controllerNotification";
import { TemplateMessage } from "../models/TemplateMessage";
import { NotificationType } from "../models/NotificationType";

const db = getFirestore();

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

export function sendInviteEmailToJoinTeam(request: CallableRequest<SendMailType>) {
	const { emailTo, nameFrom, teamName, teamId } = request.data;

	const invitedLink = `${ZEN_TAAK_DOMAIN}/invite/?teamId=${teamId}&invited=${emailTo}`;
	const message = `Olá, \n\nVocê foi convidado por ${nameFrom} a juntar-se à sua equipa de projectos no ZenTaak. \nClique no link para juntar-se a equipa: \n${invitedLink}\n\n\nCumprimentos, \nEquipa da Toque Media, Lda`;

	const mailOptions: Mail.Options = {
		from: "notification@app.zentaak.com",
		to: emailTo,
		subject: `${nameFrom} convidou-te a juntar-se a ${teamName}`,
		text: message,
	};

	return transporter.sendMail(mailOptions, (error: Error | null, info: SMTPPool.SentMessageInfo) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

export async function sendNotification(request: CallableRequest<{ accountId: string, notification: NotificationType, template: TemplateMessage }>) {
	const { accountId, template, notification } = request.data;
	const snapshotDoc = await db.collection(SETTINGS_PATH).doc(accountId).withConverter(settingsConverter).get();
	const settings = snapshotDoc.data();

	if (settings?.emailNotification) {
		await notificationViaEmail(notification, template);
	}

	if (settings?.smsNotification) {
		await notificationViaSms(notification, template);
	}

	if (settings?.whatsAppNotification) {
		await notificationViaWhatsApp(notification, template);
	}
}

const settingsConverter: FirestoreDataConverter<SettingsType> = {
	toFirestore: function(modelObject: FirebaseFirestore.WithFieldValue<SettingsType>): FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData> {
		return {
			...modelObject,
		};
	},
	fromFirestore: function(snapshot: FirebaseFirestore.QueryDocumentSnapshot<SettingsType, FirebaseFirestore.DocumentData>): SettingsType {
		return snapshot.data();
	},
};
