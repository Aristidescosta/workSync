import { FirestoreDataConverter } from "firebase-admin/firestore";
import { TaskType } from "../models/TaskType";

export const taskConverter: FirestoreDataConverter<TaskType> = {
	toFirestore: function(modelObject: FirebaseFirestore.WithFieldValue<TaskType>): FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData> {
		return {
			...modelObject,
		};
	},
	fromFirestore: function(snapshot: FirebaseFirestore.QueryDocumentSnapshot<TaskType, FirebaseFirestore.DocumentData>): TaskType {
		return snapshot.data();
	},
};
