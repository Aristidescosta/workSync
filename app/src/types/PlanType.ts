export interface PlanType {
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