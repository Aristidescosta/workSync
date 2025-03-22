export type UserSessionType = {
    id: string
    displayName: string
    email: string
    phoneNumber?: string
    photoUrl?: string | null
    isNewAccount?: boolean
    isEmailVerified?: boolean
}