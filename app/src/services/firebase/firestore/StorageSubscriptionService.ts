import { Firestore, FirestoreError, Unsubscribe, doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

import FirestoreService from "./FirestoreService";
import { subscriptionConverter } from "../converter/SubscriptionConverter";
import { SubscriptionPlanType } from "@/src/types/SubscriptionPlanType";

export class StorageSubscriptionService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new StorageSubscriptionService();

    constructor() {
        super();
        this.dbFirestore = getFirestore();
    }

    async saveStorageSubscriptionPlan(sessionId: string, plan: SubscriptionPlanType) {
        const docRef = doc(this.dbFirestore, this.getCollectionStorageSubscriptions(), sessionId).withConverter(subscriptionConverter)
        return await setDoc(docRef, plan)
    }

    getStorageSubscription(sessionId: string, callback: (subscription: SubscriptionPlanType | null) => void): Unsubscribe {
        const docRef = doc(this.dbFirestore, this.getCollectionStorageSubscriptions(), sessionId).withConverter(subscriptionConverter)

        return onSnapshot(docRef, (querySnapshot) => {
            if (!querySnapshot.exists()) {
                callback(null)
                return;
            }
            callback(querySnapshot.data())
        })
    }

    getUserSubscription(sessionId: string): Promise<SubscriptionPlanType> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionStorageSubscriptions(), sessionId).withConverter(subscriptionConverter)
            getDoc(docRef)
                .then(snapshot => {
                    const subscription = snapshot.data()
                    if (subscription) {
                        resolve(subscription)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    async updateSubscription(sessionId: string, plan: SubscriptionPlanType) {
        const docRef = doc(this.dbFirestore, this.getCollectionStorageSubscriptions(), sessionId).withConverter(subscriptionConverter)
        return await updateDoc(docRef, plan)
    }
}