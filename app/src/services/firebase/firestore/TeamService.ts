import { Firestore, FirestoreError, FirestoreErrorCode, Unsubscribe, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { UserType } from "@/src/types/UserType";
import { TeamType } from "@/src/types/TeamType";
import FirestoreService from "./FirestoreService";

export default class TeamService extends FirestoreService {
    dbFirestore: Firestore;

    private subCollection = "members"

    static shared = new TeamService()

    constructor() {
        super()

        this.dbFirestore = getFirestore()
    }

    createTeam(team: TeamType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTeams(), team.teamId)
            setDoc(docRef, team)
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    getTeam(id: string): Promise<TeamType | null> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTeams(), id)
            getDoc(docRef)
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as TeamType
                        resolve(data)
                    } else {
                        resolve(null)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    addMemberToTeam(user: UserType, teamId: string): Promise<TeamType> {
        return new Promise(async (resolve, reject) => {

            const team = await this.getTeam(teamId)

            if (team) {
                const docRef = doc(this.dbFirestore, this.getCollectionNameTeams(), teamId, this.subCollection, user.session.id)
                setDoc(docRef, user)
                    .then(async () => {
                        resolve(team)
                    })
                    .catch((error: FirestoreError) => {
                        if (error.code === "aborted" satisfies FirestoreErrorCode) {
                            reject("A operação foi abortada")
                        } else if (error.code === "deadline-exceeded" satisfies FirestoreErrorCode) {
                            reject("Tempo de operação excedido. Verifique se estás conectado a internet")
                        } else if (error.code === "unauthenticated" satisfies FirestoreErrorCode) {
                            reject("Ocorreu um erro porque não estás autenticado na tua conta.")
                        } else if (error.code === "permission-denied" satisfies FirestoreErrorCode) {
                            reject("Permissão negada para esta operação.")
                        } else if (error.code === "already-exists" satisfies FirestoreErrorCode) {
                            reject("Você já encontra dentro desta equipa.")
                        } else {
                            reject("Ocorreu um erro desconhecido. Contacte a equipa de suporte")
                        }
                    })
            } else {
                reject("Não foi possível adicionar-te à equipa porque não existe.")
            }
        })
    }

    getAllTeam(userId: string): Promise<TeamType[]> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameTeams())
            const q = query(collRef, where("owner.session.id", "==", userId))
            getDocs(q)
                .then(snapshot => {
                    if (snapshot.empty) {
                        resolve([])
                    } else {
                        const team: TeamType[] = [];

                        snapshot.forEach((doc) => {
                            const currentData = doc.data() as TeamType;
                            team.push(currentData);
                        });
                        resolve(team)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    getAllMembers(teamId: string, callback: (user: UserType[]) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameTeams(), teamId, this.subCollection)
        let users: UserType[] = []

        return onSnapshot(collRef, (querySnapshot) => {

            if (querySnapshot.empty) {
                callback([])
            } else {
                querySnapshot.docChanges().forEach(change => {
                    switch (change.type) {
                        case "added":
                            const data = change.doc.data() as UserType
                            users.push(data)
                            callback(users)
                            break;
                            
                        case "removed":
                            const dataToRemove = change.doc.data() as UserType
                            users = users.filter(u => u.session.id !== dataToRemove.session.id)
                            callback(users)
                            break;
                    }
                })
            }
        })
    }

    async checkNumberOfMembers(teamId: string): Promise<number> {
        const collRef = collection(this.dbFirestore, this.getCollectionNameTeams(), teamId, this.subCollection)
        const snapshotDocs = await getDocs(collRef)
        return snapshotDocs.size
    }

    getMember(userId: string, teamId: string): Promise<UserType | null> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTeams(), teamId, this.subCollection, userId)
            getDoc(docRef)
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as UserType
                        resolve(data)
                    } else {
                        resolve(null)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    removeUserMember(userId: string, teamId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTeams(), teamId, this.subCollection, userId)
            deleteDoc(docRef)
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }
}