import { UserType } from "./UserType"

export type TaskLogType = {
    logId: string
    icon: string
    user: UserType
    action: TaskLogActionType
    data: any
    createAt: Date
}

export type TaskLogActionType = "adicionou" | "atribuiu" | "atribuiu-se" | "completou" | "removeu" | "removeu-se" | "anulou"