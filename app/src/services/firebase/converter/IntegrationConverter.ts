import { IntegrationType } from "@/src/types/IntegrationType";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const integrationConverter: FirestoreDataConverter<IntegrationType> = {
    toFirestore: function (modelObject: WithFieldValue<IntegrationType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<IntegrationType, DocumentData>, options?: SnapshotOptions | undefined): IntegrationType {
        const data = snapshot.data(options)

        return data
    }
}