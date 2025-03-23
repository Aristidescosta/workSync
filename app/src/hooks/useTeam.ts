import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { TeamType } from "@/src/types/TeamType";
import TeamService from "../services/firebase/firestore/TeamService";
import generateId from "../services/UUID";
import { UserType } from "../types/UserType";
import UserService from "../services/firebase/firestore/UserService";
import { Unsubscribe } from "firebase/firestore";
import { UserSessionType } from "../types/UserSessionType";
import StorageTeamService from "../services/firebase/storage/StorageTeamService";

const initalState: State = {
	loadingTeams: false,
	message: "",
	errorTeams: null,
	teams: [],
	membersOfTeam: [],
	teamName: "",
	membersOfTeamClean: [],
	team: undefined,
}

interface State {
	teamName?: string
	message?: string
	fileToUpload?: File
	loadingTeams: boolean
	errorTeams: string | null
	membersOfTeam: {
		value: UserSessionType;
		label: string;
	}[]
	teams: TeamType[]
	team?: TeamType
	membersOfTeamClean: UserType[]
}

interface Actions {
	setFileToUpload: (fileToUpload: File | undefined) => void
	setTeamName: (teamName: string) => void
	setOwner?: (owner?: UserType) => void
	selectCurrentTeam: (team: TeamType | undefined) => void
	createTeam: (owner: UserType, teamId?: string, teamName?: string) => Promise<TeamType>
	addMemberToTeam: (user: UserType, teamId: string) => Promise<TeamType>
	updateCurrentTeam: (team: TeamType) => void
	getAllMembers: () => Unsubscribe
	getAllUserTeams: (userId: string) => Promise<void>
	removeUserMember: (userId: string) => Promise<void>
}

export const useTeamStore = create<Actions & State>()(
	persist(
		(set, get) => ({
			...initalState,
			selectCurrentTeam: (team: TeamType | undefined) => set({ team }),
			setFileToUpload: (fileToUpload: File | undefined) => set({ fileToUpload }),
			updateCurrentTeam: (team: TeamType) => set({ team }),
			setTeamName: (teamName?: string) => set({ teamName }),

			createTeam: (owner: UserType, teamId?: string, myTeamName?: string): Promise<TeamType> => {
				return new Promise(async (resolve, reject) => {
					const { teamName, fileToUpload } = get()
					set(state => ({
						loadingTeams: true
					}))
					if (myTeamName && teamId) {

						const teamToSave = {
							teamId,
							teamName: myTeamName,
							createdAt: new Date(),
							owner: owner
						}

						try {
							await TeamService.shared.createTeam(teamToSave)
							await UserService.shared.associateTeamToUser(owner.session.id, teamToSave)
							set(state => ({
								team: teamToSave,
								teams: [...state.teams, teamToSave],
								loadingTeams: false
							}))
							resolve(teamToSave)
						} catch (error: any) {
							set({
								errorTeams: error,
								loadingTeams: false
							})
							reject(error)
						}

					} else {
						if (teamName === "" && myTeamName === undefined) {
							set({ message: "Introduza o nome da equipa" })
						} else {
							let teamToSave: TeamType

							if (fileToUpload) {
								const teamImage = await StorageTeamService.shared.uploadTeamImage(owner.session.email, fileToUpload)
								teamToSave = {
									teamId: generateId(),
									teamName: get().teamName as string,
									createdAt: new Date(),
									owner: owner,
									teamImage,
								}
							} else {
								teamToSave = {
									teamId: generateId(),
									teamName: get().teamName as string,
									createdAt: new Date(),
									owner: owner
								}
							}

							try {
								await TeamService.shared.createTeam(teamToSave)
								await UserService.shared.associateTeamToUser(owner.session.id, teamToSave)
								set(state => ({
									team: teamToSave,
									teams: [...state.teams, teamToSave],
									loadingTeams: false
								}))
								resolve(teamToSave)
							} catch (error: any) {
								set({
									errorTeams: error,
									loadingTeams: false
								})
								reject(error)
							}
						}
					}
				})
			},
			getAllUserTeams: (userId: string): Promise<void> => {
				return new Promise((resolve, reject) => {
					TeamService.shared.getAllTeam(userId)
						.then((teams) => {
							set({ teams })
							resolve()
						})
						.catch(reject)
				})
			},
			addMemberToTeam: (user: UserType, teamId: string): Promise<TeamType> => {
				return new Promise((resolve, reject) => {
					TeamService.shared.addMemberToTeam(user, teamId)
						.then(team => {
							set((state) => {

								if (state.team === undefined) {
									({ team })
								}

								state.teams.push(team)
								return ({ teams: state.teams })
							})
							resolve(team)
						})
						.catch(reject)
				})
			},
			getAllMembers: (): Unsubscribe => {
				const { team } = get()

				const teamId = team?.teamId ?? ""

				return TeamService.shared.getAllMembers(teamId, (users) => {
					let membersOfTeamReadyOnly: {
						value: UserSessionType;
						label: string;
					}[]
					const membersOfTeam = []
					const userSuggestions = []

					for (const user of users) {
						membersOfTeam.push({
							value: user.session,
							label: user.session.displayName
						})
						userSuggestions.push({
							id: user.session.id,
							display: user.session.displayName
						})
					}

					userSuggestions.push({
						id: team?.owner.session.id as string,
						display: team?.owner.session.displayName
					})

					if (team) {
						membersOfTeam.push({
							value: team.owner.session,
							label: team.owner.session.displayName
						})
					}

					membersOfTeamReadyOnly = membersOfTeam
					set({
						membersOfTeam: membersOfTeamReadyOnly,
						membersOfTeamClean: users.concat(team?.owner!)
					})
				})
			},
			removeUserMember: (userId: string): Promise<void> => {
				return new Promise((resolve, reject) => {
					const { team } = get()
					if (team) {
						TeamService.shared.removeUserMember(userId, team.teamId)
							.then(resolve)
							.catch(reject)
					}
				})
			}
		}),
		{
			partialize: (state) => ({ team: state.team, teams: state.teams }),
			name: "@workSyncTeams",
			storage: createJSONStorage(() => localStorage)
		}
	)
)