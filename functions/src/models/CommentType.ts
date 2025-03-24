import { Timestamp } from "firebase/firestore";
import { UserType } from "./UserType";

export type CommentType = {
    id: string
    createdAt: Date
    user: UserType
    message: string
    commentDeleted: boolean
    taskId: string
    edited: { message: string, updatedAt: Timestamp }[]
}
