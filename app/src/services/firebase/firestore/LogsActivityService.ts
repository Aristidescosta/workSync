import { DocumentData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue, addDoc, collection, getFirestore, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { LogActivityType } from "@/src/types/LogActivityType";

export default class LogsActivityService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new LogsActivityService()

    constructor() {
        super()
        this.dbFirestore = getFirestore()
    }

    async saveActivity(log: LogActivityType) {
        try {
            const colRef = collection(this.dbFirestore, this.getColletionLogsActivities())
            return await addDoc(colRef, log)
        } catch (error) {
            console.log(error)
        }
    }

    showActivities(teamId: string, callback: (log: LogActivityType | undefined) => void) {
        const colRef = collection(this.dbFirestore, this.getColletionLogsActivities()).withConverter(logsActivitiesConverter)
        const q = query(colRef, orderBy("createdAt", "desc"), where("teamId", "==", teamId), limit(10))

        return onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                callback(undefined)
            } else {
                querySnapshot.docChanges().forEach(change => {
                    callback(change.doc.data())
                })
            }
        })
    }
}

const logsActivitiesConverter: FirestoreDataConverter<LogActivityType> = {
    toFirestore: function (modelObject: WithFieldValue<LogActivityType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<LogActivityType, DocumentData>, options?: SnapshotOptions | undefined): LogActivityType {
        const data = snapshot.data(options)
        data.logId = snapshot.id

        if (data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate();
        }

        return data
    }
}