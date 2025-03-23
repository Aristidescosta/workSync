import { Firestore, doc, getFirestore, setDoc } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { ProjectType } from "@/src/types";

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
}