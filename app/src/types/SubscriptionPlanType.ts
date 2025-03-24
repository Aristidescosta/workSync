import { PlanType } from "./PlanType"

export type SubscriptionPlanType = {
    expiration?: Date
    package: PlanType
}