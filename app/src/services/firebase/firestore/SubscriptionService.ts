import { Firestore, FirestoreError, Unsubscribe, deleteDoc, doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

import FirestoreService from "./FirestoreService";
import { subscriptionConverter } from "../converter/SubscriptionConverter";
import { SubscriptionPlanType } from "@/src/types/SubscriptionPlanType";

export class SubscriptionService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new SubscriptionService();

    constructor() {
        super();
        this.dbFirestore = getFirestore();
    }

    async saveSubscriptionPlan(sessionId: string, plan: SubscriptionPlanType) {
        const docRef = doc(this.dbFirestore, this.getCollectionSubscriptions(), sessionId).withConverter(subscriptionConverter)
        return await setDoc(docRef, plan)
    }

    getSubscription(sessionId: string, callback: (subscription: SubscriptionPlanType) => void): Unsubscribe {
        const docRef = doc(this.dbFirestore, this.getCollectionSubscriptions(), sessionId).withConverter(subscriptionConverter)

        return onSnapshot(docRef, (querySnapshot) => {
            if (!querySnapshot.exists()) {
                return;
            }
            callback(querySnapshot.data())
        })
    }

    getUserSubscription(sessionId: string): Promise<SubscriptionPlanType> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionSubscriptions(), sessionId).withConverter(subscriptionConverter)
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
        const docRef = doc(this.dbFirestore, this.getCollectionSubscriptions(), sessionId).withConverter(subscriptionConverter)
        return await updateDoc(docRef, plan)
    }

    async downgradeSubscription(sessionId: string) {
        const docRef = doc(this.dbFirestore, this.getCollectionSubscriptions(), sessionId).withConverter(subscriptionConverter)
        return await deleteDoc(docRef)
    }
}