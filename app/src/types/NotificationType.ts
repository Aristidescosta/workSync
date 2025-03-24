export type NotificationType = {
    notificationId: string
    title: string
    body: string
    createAt: Date
    to: string
    read: boolean
    type: NotifyType
    origin?: any
    workspaceId: string | undefined
}

export type NotifyType = "comment" | "task" | "payment" | "storage" | "mention"

export type UserOnNotificationMessage = {
    displayName: string
    email: string
    phoneNumber: string | undefined
}

export interface NotificationMessageType {
    teamName: string
    userNameNotificationFrom: string
    taskName: string
    workspaceName: string
    userAddressTo: UserOnNotificationMessage[]
}