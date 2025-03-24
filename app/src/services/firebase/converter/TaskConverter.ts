import { TaskType } from "@/src/types/TaskType";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue } from "firebase/firestore";

export const taskConverter: FirestoreDataConverter<TaskType> = {
    toFirestore: function (modelObject: WithFieldValue<TaskType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<TaskType, DocumentData>, options?: SnapshotOptions | undefined): TaskType {
        const data = snapshot.data(options)

        if (data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate();
        }
        
        if (data.updatedAt instanceof Timestamp) {
            data.updatedAt = data.updatedAt.toDate();
        }

        if (data.beginDate instanceof Timestamp) {
            data.beginDate = data.beginDate.toDate();
        }

        if (data.deadline instanceof Timestamp) {
            data.deadline = data.deadline.toDate();
        }

        return data
    }
}