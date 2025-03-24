import { QueryDocumentSnapshot, getFirestore, FieldValue } from "firebase-admin/firestore";
import { Change, FirestoreEvent } from "firebase-functions/v2/firestore";
import { TASK_PATH } from "../utils";

const db = getFirestore();

export async function onTaskCommented(event: FirestoreEvent<QueryDocumentSnapshot | undefined>) {
	const snapshot = event.data;
	const comment = snapshot?.data();
	const taskId = comment?.taskId;

	return await db.collection(TASK_PATH).doc(taskId).update({ numberOfComments: FieldValue.increment(1) });
}

export async function onTaskCommentDeleted(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) {
	const after = event.data?.after;
	const before = event.data?.before;

	const commentAfter = after?.data();
	const commentBefore = before?.data();

	if (commentAfter?.commentDeleted !== commentBefore?.commentDeleted) {
		return await db.collection(TASK_PATH).doc(commentAfter?.taskId).update({ numberOfComments: FieldValue.increment(-1) });
	}
	return true;
}
