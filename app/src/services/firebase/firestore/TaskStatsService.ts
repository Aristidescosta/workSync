import { DocumentData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Unsubscribe, WithFieldValue, doc, getFirestore, onSnapshot } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { TaskStatsType } from "@/src/types/TaskStatsType";

export default class TaskStatsService extends FirestoreService {

    dbFirestore: Firestore;

    static shared = new TaskStatsService()

    constructor() {
        super()
        this.dbFirestore = getFirestore()
    }

    getTaskStats(teamId: string, callback: (stats: TaskStatsType) => void): Unsubscribe {
        const docRef = doc(this.dbFirestore, this.getColletionTaskStats(), teamId).withConverter(taskStatsConverter)
        return onSnapshot(docRef, (querySnapshot) => {
            const task = querySnapshot.data()
            if (task) {
                callback(task)
            }
        });
    }
}

const taskStatsConverter: FirestoreDataConverter<TaskStatsType> = {
    toFirestore: function (modelObject: WithFieldValue<TaskStatsType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<TaskStatsType, DocumentData>, options?: SnapshotOptions | undefined): TaskStatsType {
        const data = snapshot.data(options)
        return data
    }
}