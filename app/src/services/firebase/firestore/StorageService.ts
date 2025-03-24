import { Firestore, Unsubscribe, collection, doc, getFirestore, onSnapshot, query, setDoc, updateDoc, where, arrayUnion, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp, WithFieldValue } from "firebase/firestore";

import { StorageType } from "@/src/types/StorageType";

import FirestoreService from "./FirestoreService";
import { space } from "@chakra-ui/react";

export class StorageService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new StorageService();

    constructor() {
        super();
        this.dbFirestore = getFirestore();
    }

    async createStorage(storage: StorageType) {
        const docRef = doc(this.dbFirestore, this.getCollectionStorages(), storage.accountId)
        return await setDoc(docRef, storage)
    }

    async updateStorage(accountId: string, storage: StorageType) {
        const docRef = doc(this.dbFirestore, this.getCollectionStorages(), accountId).withConverter(storageConverter)
        return await updateDoc(docRef, {
            totalSpace: storage.totalSpace,
            uploadLimit: storage.uploadLimit
        })
    }

    async updateExtraSpace(accountId: string, space: number) {
        const docRef = doc(this.dbFirestore, this.getCollectionStorages(), accountId).withConverter(storageConverter)
        return await updateDoc(docRef, {
            extraSpace: arrayUnion(space)
        })
    }

    getSpaces(accountId: string, callback: (storage: StorageType, isRemoving: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionStorages())
        const q = query(collRef, where("accountId", "==", accountId)).withConverter(storageConverter)

        return onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                return;
            }
            querySnapshot.docChanges().forEach(change => {
                switch (change.type) {
                    case "added":
                        const data = change.doc.data() as StorageType
                        callback(data, false)
                        break;
                    case "modified":
                        const modifiedDate = change.doc.data() as StorageType
                        callback(modifiedDate, false)
                        break;
                }
            })
        })
    }
}

const storageConverter: FirestoreDataConverter<StorageType> = {
    toFirestore: function (modelObject: WithFieldValue<StorageType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<StorageType>, options?: SnapshotOptions | undefined): StorageType {
        const data = snapshot.data(options)

        if (data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate()
        }

        return data
    }
}