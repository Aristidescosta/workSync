import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, getAdditionalUserInfo, AuthError, AuthErrorCodes } from "firebase/auth";
import AuthenticationService from "./AuthenticationService";
import { UserSessionType, UserType } from "@/src/types";
import UserService from "../firestore/UserService";


export default class GoogleAuthService extends AuthenticationService {
    auth: Auth
    private provider: GoogleAuthProvider

    static shared = new GoogleAuthService()

    constructor() {
        super()
        this.provider = new GoogleAuthProvider()
        this.auth = getAuth()
    }

    loginWithGoogle(): Promise<{ session: UserSessionType, user?: UserType }> {
        return new Promise((resolve, reject) => {
            signInWithPopup(this.auth, this.provider)
                .then(async (value) => {
                    const additionalInfo = getAdditionalUserInfo(value)
                    const session = value.user
                    const isNewAccount = additionalInfo?.isNewUser

                    let sessionUser: UserSessionType

                    if (isNewAccount) {
                        sessionUser = {
                            id: session.uid,
                            displayName: session.displayName as string,
                            email: session.email as string,
                            photoUrl: session.photoURL,
                            isNewAccount,
                            isEmailVerified: session.emailVerified
                        }

                        resolve({
                            session: sessionUser
                        })
                    } else {
                        const user = await UserService.shared.getUser(session.uid)
                        sessionUser = {
                            id: session.uid,
                            displayName: session.displayName as string,
                            email: session.email as string,
                            photoUrl: session.photoURL,
                            isEmailVerified: session.emailVerified
                        }

                        resolve({
                            session: sessionUser,
                            user
                        })
                    }
                })
                .catch((error: AuthError) => {
                    console.error("Erro: ", error)
                    switch (error.code) {
                        case AuthErrorCodes.CAPTCHA_CHECK_FAILED:
                            reject("Ocorre um erro com um recaptcha. Faça um refresh no navegador e tente novamente")
                        case AuthErrorCodes.POPUP_CLOSED_BY_USER:
                            reject("Você cancelou o processo")
                        default:
                            reject("Ocorreu um erro desconhecido enquanto enviada a mensagem")
                    }
                })
        })
    }
}