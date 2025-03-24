import { FirestoreDataConverter } from "firebase-admin/firestore";

interface PlanType {
    planId: string
    planName: string
    description: string
    anualPrice?: number
    monthyPrice?: number
    active: boolean
    type: "subscription" | "storage" | "notification"
}

export interface StoragePlanType extends PlanType {
    storage: number
}

export interface NotificationPlanType extends PlanType {
    messages: number
}

export interface ZenTaakPlanType extends PlanType {
    feature: {
        teamNumber: number
        usersInTeam: number
        workspacesNumber: number
        zenTaakDrive: number[]
    }
}

type SubscriptionPlanType = {
    expiration?: Date
    package: PlanType
}

export const subscriptionConverter: FirestoreDataConverter<SubscriptionPlanType> = {
	toFirestore: function(modelObject: FirebaseFirestore.WithFieldValue<SubscriptionPlanType>): FirebaseFirestore.DocumentData {
		return { ...modelObject };
	},
	fromFirestore: function(snapshot: FirebaseFirestore.QueryDocumentSnapshot<SubscriptionPlanType>): SubscriptionPlanType {
		return snapshot.data();
	},
};
