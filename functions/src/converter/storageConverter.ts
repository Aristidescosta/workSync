import { FirestoreDataConverter } from "firebase-admin/firestore";

type StorageType = {
    totalSpace: number
    totalSpaceUsed: number
    createdAt: Date
    uploadLimit: number
    accountId: string
    extraSpace: number[]
}

export const storageConverter: FirestoreDataConverter<StorageType> = {
	toFirestore: function(modelObject: FirebaseFirestore.WithFieldValue<StorageType>): FirebaseFirestore.DocumentData {
		return { ...modelObject };
	},
	fromFirestore: function(snapshot: FirebaseFirestore.QueryDocumentSnapshot<StorageType>): StorageType {
		return snapshot.data();
	},
};
