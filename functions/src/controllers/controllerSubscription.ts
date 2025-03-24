import { QueryDocumentSnapshot, getFirestore } from "firebase-admin/firestore";
import { FirestoreEvent } from "firebase-functions/v2/firestore";
import { STORAGES_PATH, SUBSCRIPTIONS_PATH } from "../utils";
import { ZenTaakPlanType, subscriptionConverter } from "../converter/subscriptionConverter";
import { storageConverter } from "../converter/storageConverter";


const db = getFirestore();

export async function onEndSubscription(event: FirestoreEvent<QueryDocumentSnapshot | undefined, { accountId: string }>) {
	const accountId = event.params.accountId;

	if (event.data) {
		const data = subscriptionConverter.fromFirestore(event.data);

		await db.collection(STORAGES_PATH).doc(accountId).withConverter(storageConverter)
			.set({ totalSpace: 500000000, uploadLimit: 10000000 }, { merge: true });

		delete data.expiration;
		delete data.package.anualPrice;
		delete data.package.monthyPrice;

		const packagePlan = data.package as ZenTaakPlanType;

		packagePlan.planName = "Startups (Grátis)";
		packagePlan.feature.teamNumber = 1;
		packagePlan.feature.usersInTeam = 5;
		packagePlan.feature.workspacesNumber = 1;
		packagePlan.feature.zenTaakDrive = [500000000, 10000000];
		return await db.collection(SUBSCRIPTIONS_PATH).doc(accountId).set(data);
	}

	return true;
}

export async function onEndStorageSubscription(event: FirestoreEvent<QueryDocumentSnapshot | undefined, { accountId: string }>) {
	const accountId = event.params.accountId;
	return await db.collection(STORAGES_PATH).doc(accountId).withConverter(storageConverter)
		.set({ totalSpace: 500000000, uploadLimit: 10000000, extraSpace: [] }, { merge: true });
}
