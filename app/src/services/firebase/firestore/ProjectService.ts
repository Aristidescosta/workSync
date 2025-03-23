import { Firestore, collection, doc, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { ProjectType } from "@/src/types";
import { Unsubscribe } from "firebase/auth";

export default class ProjectService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new ProjectService()

    constructor() {
        super()

        this.dbFirestore = getFirestore()
    }

    async createProject(newProject: ProjectType) {
        console.log("Estou chegando até aqui")
        const docRef = doc(this.dbFirestore, this.getCollectionNameProjects(), newProject.id)
        await setDoc(docRef, newProject)
    }

    getAllProjects(ownerId: string, callback: (project: ProjectType | null, isRemoving: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameProjects())
        const q = query(collRef, where("owner.id", "==", ownerId))

        return onSnapshot(q, (querySnapshot) => {

            console.log(querySnapshot.empty)
            if (querySnapshot.empty) {
                callback(null, false)
            } else {
                querySnapshot.docChanges().forEach(change => {

                    const data = change.doc.data() as ProjectType

                    switch (change.type) {
                        case "added":
                            callback(data, false)
                            break;
                        case "modified":
                            console.log("Modifica project...")
                            break;
                        case "removed":
                            console.log("Remove project...")
                            break;
                    }
                })
            }
        })
    }
}