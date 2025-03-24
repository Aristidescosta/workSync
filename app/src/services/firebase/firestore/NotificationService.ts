import { Firestore, Timestamp, Unsubscribe, collection, doc, getFirestore, onSnapshot, orderBy, query, setDoc, where, writeBatch } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { NotificationType } from "@/src/types/NotificationType";

export default class NotificationService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new NotificationService()

    constructor() {
        super()
        this.dbFirestore = getFirestore()
    }

    async createNotification(notifications: NotificationType[]): Promise<void> {

        const batch = writeBatch(this.dbFirestore);

        for (const notification of notifications) {
            const docRef = doc(this.dbFirestore, this.getCollectionNameNotifications(), notification.notificationId)
            batch.set(docRef, notification);
        }

        return await batch.commit();
    }

    async readNotification(notificationId: string) {
        const docRef = doc(this.dbFirestore, this.getCollectionNameNotifications(), notificationId)
        await setDoc(docRef, { read: true }, { merge: true })
    }

    getAllNotification(userId: string, workspaceId: string, callback: (notification: NotificationType, isRemoving: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameNotifications())
        const q = query(collRef, where("to", "==", userId), where("workspaceId", "==", workspaceId))

        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach(change => {
                switch (change.type) {
                    case "added":
                        const data = change.doc.data() as NotificationType
                        const created = data.createAt as unknown as Timestamp
                        data.createAt = created.toDate()

                        callback(data, false)
                        break;
                    case "modified":
                        const dataRemoved = change.doc.data() as NotificationType;
                        callback(dataRemoved, true)
                        break
                }
            })
        })
    }
}