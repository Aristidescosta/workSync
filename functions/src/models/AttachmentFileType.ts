export type AttachmentFileType = {
    attachId: string
    fileName: string
    fileUrl: string
    taskId?: string
    accountId: string
    createdAt: Date
    size: number
    wasDeleted: boolean
    type: string
    noPhysicalAttachment?: boolean;
}
