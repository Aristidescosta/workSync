import { UserSessionType } from "@/src/types/UserSessionType";
import { Auth, AuthError, AuthErrorCodes, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, sendEmailVerification, confirmPasswordReset } from "firebase/auth";
import UserService from "../firestore/UserService";
import { UserType } from "@/src/types/UserType";
import AuthenticationService from "./AuthenticationService";

export default class EmailAndPasswordService extends AuthenticationService {
    auth: Auth;

    static shared = new EmailAndPasswordService()

    constructor() {
        super()
        this.auth = getAuth()
    }

    loginWithEmailAndPassword(email: string, password: string): Promise<{ session: UserSessionType, user?: UserType }> {
        return new Promise(async (resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password)
                .then(async (userCredential) => {

                    const user = await UserService.shared.getUser(userCredential.user.uid)

                    const UserSession: UserSessionType = {
                        id: userCredential.user.uid,
                        displayName: userCredential.user.displayName as string,
                        email: userCredential.user.email as string,
                        photoUrl: userCredential.user.photoURL,
                        isEmailVerified: userCredential.user.emailVerified
                    }
                    resolve({
                        session: UserSession,
                        user
                    })
                })
                .catch((error: AuthError) => {
                    switch (error.code) {
                        case AuthErrorCodes.INVALID_PASSWORD:
                            reject("E-mail e/ou palavra-passe inválidas")
                        case AuthErrorCodes.INVALID_EMAIL:
                            reject("E-mail e/ou palavra-passe inválidas")
                        case AuthErrorCodes.INVALID_EMAIL:
                            reject("O seu e-mail é inválido")
                        case AuthErrorCodes.USER_DELETED:
                            reject("E-mail e/ou palavra-passe inválidas")
                        default:
                            reject("Ocorreu um erro desconhecido enquanto enviada a mensagem")
                    }
                })
        })
    }

    registerWithEmailAndPassword(email: string, password: string): Promise<UserSessionType> {
        return new Promise(async (resolve, reject) => {
            createUserWithEmailAndPassword(this.auth, email, password)
                .then((userCredential) => {
                    const UserSession: UserSessionType = {
                        id: userCredential.user.uid,
                        displayName: userCredential.user.displayName as string,
                        email: userCredential.user.email as string,
                        photoUrl: userCredential.user.photoURL,
                        isEmailVerified: userCredential.user.emailVerified
                    }
                    resolve(UserSession)
                })
                .catch((error: AuthError) => {
                    switch (error.code) {
                        case AuthErrorCodes.EMAIL_EXISTS:
                            reject("Já existe uma conta associada a este e-mail")
                        case AuthErrorCodes.INVALID_EMAIL:
                            reject("Você digitou um e-mail inválido")
                        case AuthErrorCodes.WEAK_PASSWORD:
                            reject("A sua palavra-passe não atende os critérios de complexidade.")
                        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
                            reject("Ocorreu um erro de rede.")
                        default:
                            reject("Ocorreu um erro desconhecido enquanto enviada a mensagem")
                    }
                })
        })
    }

    async checkEmailAlreadyExist(email: string): Promise<string[]> {
        return await fetchSignInMethodsForEmail(this.auth, email)
    }

    async updateUserProfile(data: iDictionary) {
        if (this.auth.currentUser) {
            try {
                await updateProfile(this.auth.currentUser, data);
            } catch (error) {
                console.error(error)
            }
        }
    }

    async sendEmailVerification(): Promise<void> {
        if (this.auth.currentUser) {
            try {
                await sendEmailVerification(this.auth.currentUser);
            } catch (error) {
                console.error(error)
            }
        }
    }
    resetPassWord(email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            sendPasswordResetEmail(this.auth, email)
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        })
    }

    forResetPassword(oobCode: string, newPassword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            confirmPasswordReset(this.auth, oobCode, newPassword)
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        });
    }

}