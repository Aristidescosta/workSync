import { TeamType } from "./TeamType";

export type WorkspaceType = {
    workspaceId: string
    workspaceName: string
    workspaceDescription: string
    team: TeamType
    updatedAt: Date;
    createdAt: Date;
    isClosed: boolean
}
