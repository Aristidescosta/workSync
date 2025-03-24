import { Firestore, FirestoreError, doc, getFirestore, setDoc } from "firebase/firestore";

import FirestoreService from "./FirestoreService";
import { PaymentType } from "@/src/types/PaymentType";

export class PaymentService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new PaymentService();

    constructor() {
        super();
        this.dbFirestore = getFirestore();
    }

    createPayment(data: PaymentType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionPayments(), data.paymentId)
            setDoc(docRef, data)
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }
}