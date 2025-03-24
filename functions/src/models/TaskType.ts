import { ActivityType } from "./ActivityType";
import { AttachmentFileType } from "./AttachmentFileType";
import { CommentType } from "./CommentType";
import { WorkspaceType } from "./WorkspaceType";
import { TagType } from "./TagType";
import { UserSessionType } from "./UserSessionType";

export type TaskType = {
    taskId: string
    assignedOf: UserSessionType[]
    beginDate: Date
    deadline: Date
    workspace: WorkspaceType;
    taskTitle: string
    tags: TagType[]
    notes: string
    state: StateTask
    userReport?: string
    progress: number
    activities: ActivityType[]
    comments?: CommentType[];
    attachments?: AttachmentFileType[]
    numberOfComments?: number
    statsId: string
    createdAt?: Date
    updatedAt?: Date
    isOpen: boolean
};

export type StateTask = "Não iniciada" | "Em andamento" | "Concluída" | "Em revisão" | "Incompleta";
