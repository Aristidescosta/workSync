import { StorageEvent } from "firebase-functions/v2/storage";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { STORAGES_PATH } from "../utils";
import { storageConverter } from "../converter/storageConverter";

const db = getFirestore();
const auth = getAuth();

export async function onFileCreated(event: StorageEvent) {
	const size = parseInt((event.data.size as unknown as string), 10);
	const user = await getOwnerStorage(event);

	const snapshot = await db.collection(STORAGES_PATH).doc(user.uid).withConverter(storageConverter).get();
	const storageData = snapshot.data();

	if (storageData) {
		return await snapshot.ref.update({
			totalSpaceUsed: FieldValue.increment(size),
		});
	}

	return true;
}

export async function onFileRemoved(event: StorageEvent) {
	const size = parseInt((event.data.size as unknown as string), 10);
	const user = await getOwnerStorage(event);

	const snapshot = await db.collection(STORAGES_PATH).doc(user.uid).withConverter(storageConverter).get();
	const storageData = snapshot.data();

	if (storageData) {
		return await snapshot.ref.update({
			totalSpaceUsed: FieldValue.increment(-size),
		});
	}

	return true;
}

async function getOwnerStorage(event: StorageEvent) {
	const filePath = event.data.name;
	const ownerEmail = filePath.split("/")[0];
	return await auth.getUserByEmail(ownerEmail);
}
