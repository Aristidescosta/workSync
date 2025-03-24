export interface NotificationType {
    teamName: string
    userNameNotificationFrom: string
    taskName: string
    workspaceName: string
    userAddressTo: UserOnNotificationMessage[]
}

export type UserOnNotificationMessage = {
    displayName: string
    email: string
    phoneNumber: string | undefined
}
