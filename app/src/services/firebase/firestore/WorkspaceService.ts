import { Firestore, FirestoreError, Unsubscribe, collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { WorkspaceType } from "@/src/types/WorkspaceType";
import FirestoreService from "./FirestoreService";

export default class WorkspaceService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new WorkspaceService()

    constructor() {
        super()
        this.dbFirestore = getFirestore()
    }

    async createNewWorkspace(newWorkspace: WorkspaceType) {
        const docRef = doc(this.dbFirestore, this.getCollectionNameWorkspaces(), newWorkspace.workspaceId)
        await setDoc(docRef, newWorkspace)
    }

    getAllWorkspaces(teamId: string, callback: (workspace: WorkspaceType | null, isRemoving: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameWorkspaces())
        const q = query(collRef, where("team.teamId", "==", teamId))

        return onSnapshot(q, (querySnapshot) => {

            console.log(querySnapshot.empty)
            if (querySnapshot.empty) {
                callback(null, false)
            } else {
                querySnapshot.docChanges().forEach(change => {

                    const data = change.doc.data() as WorkspaceType

                    switch (change.type) {
                        case "added":
                            callback(data, false)
                            break;
                        case "modified":
                            console.log("Modifica workspace...")
                            break;
                        case "removed":
                            console.log("Remove workspace...")
                            break;
                    }
                })
            }
        })
    }

    getTeamWorkspaces(teamId: string): Promise<WorkspaceType[]> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameWorkspaces())
            const q = query(collRef, where("team.teamId", "==", teamId))

            getDocs(q)
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        resolve([])
                    } else {
                        const workspaces: WorkspaceType[] = []
                        querySnapshot.docChanges().forEach(change => {
                            const data = change.doc.data() as WorkspaceType
                            workspaces.push(data)
                        })
                        resolve(workspaces)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    editWorkspace(workspace: WorkspaceType): Promise<void> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameWorkspaces());
            const docRef = doc(collRef, workspace.workspaceId);
            updateDoc(docRef, workspace)
                .then(() => {
                    resolve()
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }
}