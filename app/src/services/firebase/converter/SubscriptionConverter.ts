import { SubscriptionPlanType } from "@/src/types/SubscriptionPlanType";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue } from "firebase/firestore";

export const subscriptionConverter: FirestoreDataConverter<SubscriptionPlanType> = {
    toFirestore: function (modelObject: WithFieldValue<SubscriptionPlanType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<SubscriptionPlanType, DocumentData>, options?: SnapshotOptions | undefined): SubscriptionPlanType {
        const data = snapshot.data(options)

        if (data.expiration instanceof Timestamp) {
            data.expiration = data.expiration.toDate()
        }

        return data
    }
}