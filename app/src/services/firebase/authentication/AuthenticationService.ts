import { Auth, Unsubscribe, onAuthStateChanged, signOut } from "firebase/auth";
import FirebaseService from "../FirebaseService";
import { UserSessionType } from "@/src/types/UserSessionType";

export default abstract class AuthenticationService extends FirebaseService {
    abstract auth: Auth

    constructor() {
        super()
    }

    onAuthenticationListener(callback: (user: UserSessionType | null) => void): Unsubscribe {
        return onAuthStateChanged(this.auth, (user) => {
            const sessionUser: UserSessionType = {
                id: user?.uid as string,
                displayName: user?.displayName as string,
                email: user?.email as string,
                photoUrl: user?.photoURL
            }

            if (user) {
                callback(sessionUser)
            } else {
                callback(null)
            }
        })
    }

    async logoutSession() {
        try {
            const res = await signOut(this.auth)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
    }
}