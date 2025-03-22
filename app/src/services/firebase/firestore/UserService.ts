import { Firestore, FirestoreError, Unsubscribe, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UserType } from "@/src/types/UserType";
import EmailAndPasswordService from "../authentication/EmailAndPasswordService";
import { TeamType } from "@/src/types/TeamType";
import FirestoreService from "./FirestoreService";

export default class UserService extends FirestoreService {

    dbFirestore: Firestore;
    static shared = new UserService()

    constructor() {
        super()

        this.dbFirestore = getFirestore()
    }

    async createUser(user: UserType) {
        const collRef = collection(this.dbFirestore, this.getCollectionNameUsers())
        const userData: iDictionary = {
            "displayName": user.session.displayName
        }
        EmailAndPasswordService.shared.updateUserProfile(userData)
        if (!user.session.isEmailVerified) {
            EmailAndPasswordService.shared.sendEmailVerification()
        }
        return await setDoc(doc(collRef, user.session.id), user)
    }

    async associateTeamToUser(userId: string, team: TeamType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameUsers(), userId)
            updateDoc(docRef, {
                teams: arrayUnion(team)
            })
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    async associateUserAsMemberToTeam(userId: string, team: TeamType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameUsers(), userId)
            updateDoc(docRef, {
                memberOfTeams: arrayUnion(team)
            })
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    searchUserToInvite(email: string): Promise<UserType | null> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameUsers())
            const q = query(collRef, where("session.email", "==", email))
            getDocs(q)
                .then(querySnapshot => {

                    if (querySnapshot.empty) {
                        resolve(null)
                    } else {
                        const user = querySnapshot.docs[0].data() as UserType
                        resolve(user)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    getUser(userId: string): Promise<UserType> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameUsers(), userId)
            getDoc(docRef)
                .then(documentSnapshot => {
                    const data = documentSnapshot.data() as UserType
                    resolve(data)
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    
    observingUserData(userId: string, callback: (user: UserType) => void): Unsubscribe {
        const docRef = doc(this.dbFirestore, this.getCollectionNameUsers(), userId)
        return onSnapshot(docRef, (documentSnapshot) => {
            const data = documentSnapshot.data() as UserType
            callback(data)
        })
    }
}