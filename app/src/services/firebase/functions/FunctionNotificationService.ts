import { Functions, FunctionsError, getFunctions, httpsCallable } from "firebase/functions";
import FunctionService from "./FunctionService";
import { NotificationMessageType } from "@/src/types/NotificationType";
import { TemplateMessage } from "@/src/types/TemplateMessage";

export default class FunctionNotificationService extends FunctionService {

    functions: Functions
    static shared = new FunctionNotificationService()

    constructor() {
        super()
        this.functions = getFunctions();
    }

    sendEmailMentionNotification(emailTo: string, nameFrom: string, teamName: string, teamId: string, taskName: string, taskId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const onSendMentionNotification = httpsCallable(this.functions, 'onSendMentionNotification');
            onSendMentionNotification({ emailTo, nameFrom, teamName, teamId, taskId, taskName })
                .then(() => {
                    resolve()
                })
                .catch((error: FunctionsError) => {
                    if (error.code === "functions/aborted") {
                        reject("A operação foi cancelada")
                    } else if (error.code === "functions/cancelled") {
                        reject("A operação foi cancelada pelo utilizador")
                    } else if (error.code === "functions/internal") {
                        reject("Ocorreu um erro interno. Por favor, tente mais tarde")
                    } else {
                        reject("Ocorreu um erro desconhecido.")
                    }
                });
        })
    }

    onSendMessageNotification(accountId: string, notification: NotificationMessageType, template: TemplateMessage): Promise<void> {
        return new Promise((resolve, reject) => {
            const onSendNotification = httpsCallable(this.functions, 'onSendNotification');
            onSendNotification({ accountId, notification, template })
                .then(() => {
                    resolve()
                })
                .catch((error: FunctionsError) => {
                    if (error.code === "functions/aborted") {
                        reject("A operação foi cancelada")
                    } else if (error.code === "functions/cancelled") {
                        reject("A operação foi cancelada pelo utilizador")
                    } else if (error.code === "functions/internal") {
                        reject("Ocorreu um erro interno. Por favor, tente mais tarde")
                    } else {
                        reject("Ocorreu um erro desconhecido.")
                    }
                });
        })
    }

}