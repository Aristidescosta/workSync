import { DocumentData, Firestore, FirestoreDataConverter, FirestoreError, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, addDoc, collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";

import FirestoreService from "./FirestoreService";
import { PlanType } from "@/src/types/PlanType";

export class PlanService extends FirestoreService {
    dbFirestore: Firestore;

    static shared = new PlanService();

    constructor() {
        super();
        this.dbFirestore = getFirestore();
    }

    async saveData() {
        const col = collection(this.dbFirestore, this.getCollectionPlans())
        await addDoc(col, {
            "planName": "Startups (Grátis)",
            "description": "1 equipa (5 pessoas) • 1 workspace • ZenTaak Drive 500 MB (10 MB/ficheiro)*",
            "active": true,
            "type": "subscription",
            "order": 1,
            "feature": {
                "teamNumber": 1,
                "usersInTeam": 5,
                "workspacesNumber": 1,
                "zenTaakDrive": [500000000, 10000000]
            }
        })
        await addDoc(col, {
            "planName": "Crescimento",
            "description": "5 equipas • 2 workspaces • ZenTaak Drive 2 GB (50 MB/ficheiro)*",
            "anualPrice": 8755,
            "monthyPrice": 10900,
            "active": true,
            "order": 2,
            "type": "subscription",
            "feature": {
                "teamNumber": 5,
                "usersInTeam": 0,
                "workspacesNumber": 5,
                "zenTaakDrive": [2000000000, 50000000]
            }
        })
        await addDoc(col, {
            "planName": "Avançado",
            "description": "Equipas ilimitadas • Workspaces ilimtados • ZenTaak Drive 5 GB (500 MB/ficheiro)*",
            "anualPrice": 13150,
            "monthyPrice": 16100,
            "order": 3,
            "active": true,
            "type": "subscription",
            "feature": {
                "teamNumber": 0,
                "usersInTeam": 0,
                "workspacesNumber": 0,
                "zenTaakDrive": [5000000000, 500000000]
            }
        })
        // ************
        await addDoc(col, {
            "planName": "50 GB",
            "description": "Para aquelas equipas em fase de crescimento e que precisam de mais um espaço extra para os seus arquivos.",
            "anualPrice": 9360.96,
            "active": true,
            "type": "storage",
            "order": 4,
            "storage": 50000000000
        })
        await addDoc(col, {
            "planName": "500 GB",
            "description": "Para equipas que precisam de mais espaço para os seus anexos e documentos colaborativos.",
            "anualPrice": 28750.96,
            "active": true,
            "type": "storage",
            "order": 5,
            "storage": 500000000000
        })
        await addDoc(col, {
            "planName": "2 TB",
            "description": "Para grandes equipas que procurar de um gestor de arquivos digitais sem ter a preocupação de limitação de espaço.",
            "anualPrice": 124798.96,
            "active": true,
            "type": "storage",
            "order": 6,
            "storage": 2000000000000
        })

        await addDoc(col, {
            "planName": "1000 WhatsApps",
            "description": "Pacote de 1000 mensagens de notificação via WhatsApp.",
            "anualPrice": 79.99,
            "active": true,
            "type": "notification",
            "order": 7,
            "messages": 1000
        })
        await addDoc(col, {
            "planName": "1000 SMS",
            "description": "Pacote de 1000 mensagens de notificação directo para o telefone.",
            "anualPrice": 9.99,
            "active": true,
            "type": "notification",
            "order": 8,
            "messages": 1000
        })
    }

    getAllPlans(): Promise<PlanType[]> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionPlans())
            const q = query(collRef, orderBy("order"), where("active", "==", true)).withConverter(planConverter)

            getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        resolve([])
                    } else {

                        const plans: PlanType[] = []

                        querySnapshot.docChanges().forEach(change => {
                            plans.push(change.doc.data())
                        })

                        resolve(plans)
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    getAllStoragePlans(): Promise<PlanType[]> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionPlans())
            const q = query(collRef, orderBy("order"), where("active", "==", true), where("type", "==", "storage")).withConverter(planConverter)

            getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        resolve([])
                    } else {

                        const plans: PlanType[] = []

                        querySnapshot.docChanges().forEach(change => {
                            plans.push(change.doc.data())
                        })

                        resolve(plans)
                    }
                })
                .catch((error: FirestoreError) => {
                    console.log(error)
                    reject(this.errorMessage(error.code))
                })
        })
    }
}

const planConverter: FirestoreDataConverter<PlanType> = {
    toFirestore: function (modelObject: WithFieldValue<PlanType>): WithFieldValue<DocumentData> {
        return {
            ...modelObject
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<PlanType, DocumentData>, options?: SnapshotOptions | undefined): PlanType {
        return {
            ...snapshot.data(options),
            planId: snapshot.id
        }
    }
}