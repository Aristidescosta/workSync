import { Functions, FunctionsError, getFunctions, httpsCallable } from "firebase/functions";
import FunctionService from "./FunctionService";
export default class FunctionInviteService extends FunctionService {

    functions: Functions
    static shared = new FunctionInviteService()

    constructor() {
        super()
        this.functions = getFunctions();
    }

    sendEmailToInviteUser(emailTo: string, nameFrom: string, teamName: string, teamId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const onSendInviteEmailToJoinTeam = httpsCallable(this.functions, 'onSendInviteEmailToJoinTeam');
            onSendInviteEmailToJoinTeam({ emailTo, nameFrom, teamName, teamId })
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