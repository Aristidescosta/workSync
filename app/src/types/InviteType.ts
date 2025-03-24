import { TeamType } from "./TeamType";
import { UserType } from "./UserType";

export type InviteType = {
	id?: string
	to: UserType
	team: TeamType
	createdAt: Date
	wasAccept: boolean
}