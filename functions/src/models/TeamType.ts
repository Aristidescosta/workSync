import { UserType } from "./UserType";

export class TeamType {
	teamId: string;
	teamName: string;
	teamImage?: string;
	createdAt: Date;
	owner: UserType;

	constructor(teamId: string, teamName: string, owner: UserType, teamImage?: string) {
		this.teamId = teamId;
		this.teamName = teamName;
		this.owner = owner;
		this.teamImage = teamImage;
		this.createdAt = new Date();
	}
}
