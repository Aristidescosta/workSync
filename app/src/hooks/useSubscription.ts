import { Unsubscribe } from "firebase/firestore";
import { create } from "zustand";

import { SubscriptionPlanType } from "../types/SubscriptionPlanType";
import { SubscriptionService } from "../services/firebase/firestore/SubscriptionService";
import { StorageAdvancedStaticEnum, StorageFreeStaticEnum, StorageGrowStaticEnum, StorageString, StorageType } from "../types/StorageType";
import { StorageService } from "../services/firebase/firestore/StorageService";
import { PlanType, StoragePlanType } from "../types/PlanType";
import { StorageSubscriptionService } from "../services/firebase/firestore/StorageSubscriptionService";

const initialState: State = {
    subscription: null,
    storageSubscription: null
}

interface State {
    subscription: SubscriptionPlanType | null
    storageSubscription: SubscriptionPlanType | null
}

interface Actions {
    createSubscription(sessionId: string, plan: PlanType, storageString: StorageString, type: "subscription" | "storage", expiration?: Date): Promise<void>
    upgradeSubscription(sessionId: string, plan: PlanType, storageString: StorageString, expiration?: Date): Promise<void>
    downgradeSubscription(sessionId: string, plan: PlanType): Promise<void>
    observingSubscription(sessionId: string, type: "subscription" | "storage"): Unsubscribe
}

export const useSubscriptionStore = create<Actions & State>()((set, get) => ({
    ...initialState,
    createSubscription: async (sessionId: string, plan: PlanType, storageString: StorageString, type: "subscription" | "storage", expiration?: Date): Promise<void> => {

        const { subscription } = get()

        if (type === "subscription") {
            const data = handleSubscriptionSelection(sessionId, plan, storageString, expiration)

            if (subscription) {
                const remainDays = subscription?.expiration?.getRemainSubscriptionDays(true) as number
                subscription.expiration = expiration?.addDaysToGetDateOfSubscription(remainDays)
                await StorageService.shared.updateStorage(sessionId, data.storage)
            } else {
                await StorageService.shared.createStorage(data.storage)
            }

            return SubscriptionService.shared.saveSubscriptionPlan(sessionId, data.subscription)
        }

        const storage = plan as StoragePlanType

        await StorageService.shared.updateExtraSpace(sessionId, storage.storage)
        return await StorageSubscriptionService.shared.saveStorageSubscriptionPlan(
            sessionId,
            {
                expiration,
                package: plan
            }
        )
    },
    upgradeSubscription: async (sessionId: string, plan: PlanType, storageString: StorageString, expiration: Date): Promise<void> => {
        const data = handleSubscriptionSelection(sessionId, plan, storageString, expiration)
        await StorageService.shared.updateStorage(sessionId, data.storage)
        return SubscriptionService.shared.updateSubscription(sessionId, data.subscription)
    },
    downgradeSubscription: async (sessionId: string): Promise<void> => {
        return SubscriptionService.shared.downgradeSubscription(sessionId)
    },
    observingSubscription: (sessionId: string, type: "subscription" | "storage"): Unsubscribe => {
        if (type === "subscription") {
            return SubscriptionService.shared.getSubscription(sessionId, (subscription: SubscriptionPlanType) => {
                set({ subscription })
            })
        }

        return StorageSubscriptionService.shared.getStorageSubscription(sessionId, (storageSubscription: SubscriptionPlanType | null) => {
            set({ storageSubscription })
        })
    },
}))

function handleSubscriptionSelection(sessionId: string, plan: PlanType, storageString: StorageString, expiration?: Date): { storage: StorageType, subscription: SubscriptionPlanType } {

    let storage: StorageType
    let subscription: SubscriptionPlanType

    switch (storageString) {
        case "Startups (Grátis)":

            subscription = {
                package: plan
            }

            storage = {
                totalSpace: StorageFreeStaticEnum.TOTAL_SPACE,
                totalSpaceUsed: 0,
                createdAt: new Date(),
                uploadLimit: StorageFreeStaticEnum.UPLOAD_LIMIT,
                accountId: sessionId,
                extraSpace: []
            }
            break;

        case "Crescimento":

            subscription = {
                expiration,
                package: plan
            }

            storage = {
                totalSpace: StorageGrowStaticEnum.TOTAL_SPACE,
                totalSpaceUsed: 0,
                createdAt: new Date(),
                uploadLimit: StorageGrowStaticEnum.UPLOAD_LIMIT,
                accountId: sessionId,
                extraSpace: []
            }
            break;

        default:

            subscription = {
                expiration,
                package: plan
            }

            storage = {
                totalSpace: StorageAdvancedStaticEnum.TOTAL_SPACE,
                totalSpaceUsed: 0,
                createdAt: new Date(),
                uploadLimit: StorageAdvancedStaticEnum.UPLOAD_LIMIT,
                accountId: sessionId,
                extraSpace: []
            }
            break;
    }

    return {
        storage,
        subscription
    }
}