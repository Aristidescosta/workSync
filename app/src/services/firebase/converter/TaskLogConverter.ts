import { TaskLogType } from "@/src/types/TaskLogType";
import { FirestoreDataConverter, WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "firebase/firestore";

export const taskLogConverter: FirestoreDataConverter<TaskLogType> = {
    toFirestore: function (modelObject: WithFieldValue<TaskLogType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<TaskLogType, DocumentData>, options?: SnapshotOptions | undefined): TaskLogType {
        const data = snapshot.data(options)

        if (data.createAt instanceof Timestamp) {
            data.createAt = data.createAt.toDate();
        }

        return data
    }
}