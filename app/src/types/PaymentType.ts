import { PlanType } from "./PlanType"

export type PaymentType = {
    amount: number
    createdAt: Date
    paymentId: string
    referenceEk?: number
    bought: PlanType
    gpoReferenceId?: string
    accountId: string
    method: "mcx-gpo" | "e-kwanza"
    fee: number
}