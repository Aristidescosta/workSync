import { FieldValue, QueryDocumentSnapshot, getFirestore, Timestamp } from "firebase-admin/firestore";
import { Change, FirestoreEvent } from "firebase-functions/v2/firestore";
import { TaskType } from "../models/TaskType";
import { STATS_RESUME_TASK_PATH, TASK_PATH } from "../utils";
import * as moment from "moment-timezone";
import { ScheduledEvent } from "firebase-functions/v2/scheduler";

const db = getFirestore();

export async function onCreatedTask(event: FirestoreEvent<QueryDocumentSnapshot | undefined, { taskId: string }>) {
	if (event.data) {
		const task = event.data.data() as TaskType;
		const finalData: Record<string, object> = {};

		const date = moment().tz("Africa/Luanda").format("DD-MM-YYYY");
		const statsId = `${task.workspace.workspaceId}_${date}`;

		if (task.assignedOf.length > 0) {
			const data: Record<string, FieldValue> = {};
			task.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});

			finalData[statsId] = {
				assignedTaskBy: data,
				totalTasks: FieldValue.increment(1),
				totalAssignedTasks: FieldValue.increment(1),
				incompletedTasks: FieldValue.increment(1),
			};
		} else {
			finalData[statsId] = {
				totalTasks: FieldValue.increment(1),
				incompletedTasks: FieldValue.increment(1),
			};
		}

		await event.data.ref.set({ statsId }, { merge: true });
		return await db.collection(STATS_RESUME_TASK_PATH).doc(task.workspace.team.teamId)
			.set(finalData, { merge: true });
	}

	return false;
}

export async function onUpdatedTask(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { taskId: string }>) {
	const before = event.data?.before.data() as TaskType;
	const after = event.data?.after.data() as TaskType;

	if (after.deadline instanceof Timestamp) {
		after.deadline = after.deadline.toDate();
	}

	const deadline = moment(after.deadline);
	const today = moment().tz("Africa/Luanda");

	const taskDocRef = db.collection(STATS_RESUME_TASK_PATH).doc(after.workspace.team.teamId);
	const isDueTaskDate = today.isAfter(deadline);

	if (before.state !== after.state) {
		if (after.state === "Em andamento") {
			const data: Record<string, FieldValue> = {};
			after.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});

			return await taskDocRef.set({
				[after.statsId]: {
					inProgressTaskBy: data,
					inProgressTasks: FieldValue.increment(1),
				},
			}, { merge: true });
		}

		if (after.state === "Incompleta") {
			const data: Record<string, FieldValue> = {};
			after.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});

			return await taskDocRef.set({
				[after.statsId]: {
					incompletedTaskBy: data,
					incompletedTasks: FieldValue.increment(1),
					completedTasks: FieldValue.increment(-1),
				},
			}, { merge: true });
		}

		if (after.state === "Concluída") {
			const data: Record<string, FieldValue> = {};
			after.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});

			if (isDueTaskDate) {
				return await taskDocRef.set({
					[after.statsId]: {
						completedTaskBy: data,
						completedTasks: FieldValue.increment(1),
						incompletedTasks: FieldValue.increment(-1),
						completedDueTasks: FieldValue.increment(1),
					},
				}, { merge: true });
			}

			return await taskDocRef.set({
				[after.statsId]: {
					completedTaskBy: data,
					completedTasks: FieldValue.increment(1),
					incompletedTasks: FieldValue.increment(-1),
				},
			}, { merge: true });
		}
	}

	if (before.assignedOf.length !== after.assignedOf.length) {
		const set1 = new Set(before.assignedOf.map((user) => JSON.stringify(user)));
		const set2 = new Set(after.assignedOf.map((user) => JSON.stringify(user)));
		const differentValues = [...before.assignedOf.filter((user) => !set2.has(JSON.stringify(user))), ...after.assignedOf.filter((user) => !set1.has(JSON.stringify(user)))];

		if (before.assignedOf.length > after.assignedOf.length) {
			const data: Record<string, FieldValue> = {};

			differentValues.forEach((u) => {
				data[u.displayName] = FieldValue.increment(-1);
			});

			return await taskDocRef.set({
				[after.statsId]: {
					assignedTaskBy: data,
					totalAssignedTasks: FieldValue.increment(-1),
				},
			}, { merge: true });
		}

		const data: Record<string, FieldValue> = {};

		if (before.assignedOf.length === 0) {
			after.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});
		} else {
			differentValues.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});
		}

		return await taskDocRef.set({
			[after.statsId]: {
				assignedTaskBy: data,
				totalAssignedTasks: FieldValue.increment(1),
			},
		}, { merge: true });
	}

	return false;
}

export async function checkDueTasks(event: ScheduledEvent) {
	const dueDate = moment().tz("Africa/Luanda").subtract(1, "day").format("DD-MM-YYYY");
	const snapshot = await getFirestore().collection(TASK_PATH).where("deadlineString", "==", dueDate).get();

	if (snapshot.empty) {
		return;
	}

	const data: Record<string, FieldValue> = {};
	const finalData: Record<string, object> = {};

	let interaction = 0;
	let reference: NodeJS.Timeout;
	const docs = snapshot.docs;

	const runner = () => {
		if (interaction < docs.length) {
			const task = docs[interaction].data() as TaskType;

			task.assignedOf.forEach((u) => {
				data[u.displayName] = FieldValue.increment(1);
			});

			finalData[task.statsId] = {
				assignedDueTaskBy: data,
				totalDueTasks: FieldValue.increment(1),
			};

			const taskDocRef = getFirestore().collection(STATS_RESUME_TASK_PATH).doc(task.workspace.team.teamId);
			taskDocRef.set(finalData, { merge: true })
				.then(() => {
					interaction += 1;
					reference = setTimeout(runner, 0);
				})
				.catch(() => {
					clearTimeout(reference);
				});
		} else {
			clearTimeout(reference);
		}
	};
	console.log("event: ", event);
	runner();
}
