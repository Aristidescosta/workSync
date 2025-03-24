import { QueryDocumentSnapshot, getFirestore } from "firebase-admin/firestore";
import { FirestoreEvent } from "firebase-functions/v2/firestore";
import { SETTINGS_PATH, STATS_RESUME_TASK_PATH } from "../utils";
import { WorkspaceType } from "../models/WorkspaceType";
import * as moment from "moment-timezone";

export async function onCreatedWorkspace(event: FirestoreEvent<QueryDocumentSnapshot | undefined>) {
	const db = getFirestore();

	const colRef = db.collection(STATS_RESUME_TASK_PATH);
	const settsRef = db.collection(SETTINGS_PATH);
	const workspace = event.data?.data() as WorkspaceType;
	const date = moment().tz("Africa/Luanda").format("DD-MM-YYYY");

	const keyPath = `${workspace.workspaceId}_${date}`;

	await settsRef.doc(workspace.team.owner.session.id).set({
		emailNotification: true,
		smsNotification: false,
		whatsAppNotification: false,
	});
	return await colRef.doc(workspace.team.teamId).set({
		[keyPath]: {
			completedTasks: 0,
			incompletedTasks: 0,
			totalDueTasks: 0,
			totalTasks: 0,
			totalAssignedTasks: 0,
			inProgressTasks: 0,
			completedTeamRate: 0,
			dueIndexTeamRate: 0,
			completedEfficiencyTeamRate: 0,
			completedDueTasks: 0,
		},
	});
}
