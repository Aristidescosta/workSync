import { UserSessionType } from "./UserSessionType"

export type LogActivityType = {
    logId?: string
    user: UserSessionType
    action: string
    teamId: string
    createdAt: Date
}