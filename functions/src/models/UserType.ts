import { TeamType } from "./TeamType";
import { UserSessionType } from "./UserSessionType";

export type UserType = {
    session: UserSessionType
    phoneNumber?: string
    gender?: string
    job?: string
    role?: string
    teams: TeamType[]
    memberOfTeams: TeamType[]
    createdAt: Date
  }
