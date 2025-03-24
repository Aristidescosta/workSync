import { QueryDocumentSnapshot, getFirestore } from "firebase-admin/firestore";
import { FirestoreEvent } from "firebase-functions/v2/firestore";
import { USER_PATH } from "../utils";


const db = getFirestore();

export async function onUserRemovedFromTeam(event: FirestoreEvent<QueryDocumentSnapshot | undefined, { teamId: string; userId: string; }>) {
	const userId = event.params.userId;
	const teamId = event.params.teamId;

	const snapshot = await db.collection(USER_PATH).doc(userId).get();
	const user = snapshot.data();

	if (user) {
		user.memberOfTeams = user.memberOfTeams.filter((t: { teamId: string; }) => t.teamId !== teamId);
		return await db.collection(USER_PATH).doc(userId).update({ memberOfTeams: user.memberOfTeams });
	}

	return true;
}
