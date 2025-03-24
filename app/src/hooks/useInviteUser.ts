import { create } from "zustand";
import { UserType } from "@/src/types/UserType";

import TeamService from "../services/firebase/firestore/TeamService";
import { InviteService } from "../services/firebase/firestore/InviteService";
import { InviteType } from "../types/InviteType";
import { TeamType } from "../types/TeamType";
import FunctionInviteService from "../services/firebase/functions/FunctionInviteService";
import { Unsubscribe } from "firebase/firestore";
import UserService from "../services/firebase/firestore/UserService";


const initialState: State = {
    loadingUsers: true,
    errorUsers: null,
    users: [],
    emailToSearch: "",
}

interface State {
    emailToSearch: string
    loadingUsers: boolean
    errorUsers: string | null
    users: UserType[]
}

interface Actions {
    setEmailToSearch: (emailToSearch: string) => void
    acceptOrRejectInvite: (invite: InviteType, userId: string, wasAccept: boolean) => Promise<void>
    sendEmailToInviteUser: (emailTo: string, nameFrom: string, teamName: string, teamId: string) => Promise<void>
    sendInvitationToUser: (userToInvite: UserType, team: TeamType) => Promise<void>
    getAllUserInvitation: (email: string, callback: (invite: InviteType, isRemoving: boolean) => void) => Unsubscribe
}

export const useInviteUserStore = create<Actions & State>((set, get) => ({
    ...initialState,
    setEmailToSearch: (emailToSearch: string) => set({ emailToSearch }),
    acceptOrRejectInvite: (invite: InviteType, userId: string, wasAccept: boolean) => {
        return new Promise((resolve, reject) => {
            if (wasAccept) {
                InviteService.shared.acceptOrRejectInvite(invite, wasAccept)
                    .then(() => {
                        UserService.shared.associateUserAsMemberToTeam(userId, invite.team)
                            .then(resolve)
                            .catch(reject)
                    })
                    .catch(reject)
            } else {
                InviteService.shared.acceptOrRejectInvite(invite, wasAccept)
                    .then(resolve)
                    .catch(reject)
            }
        })
    },
    sendInvitationToUser: (userToInvite: UserType, team: TeamType): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (userToInvite) {
                TeamService.shared.getMember(userToInvite.session.id, team.teamId)
                    .then(user => {
                        if (user) {
                            reject("Este utilizador já se encontra na tua equipa.")
                        } else {

                            const invite: InviteType = {
                                to: userToInvite,
                                team,
                                createdAt: new Date(),
                                wasAccept: false
                            }

                            InviteService.shared.sendInvite(invite)
                                .then(resolve)
                                .catch(reject)
                        }
                    })
                    .catch(reject)
            }
        })
    },
    sendEmailToInviteUser: (emailTo: string, nameFrom: string, teamName: string, teamId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            FunctionInviteService.shared.sendEmailToInviteUser(emailTo, nameFrom, teamName, teamId)
                .then(resolve)
                .catch(reject)
        })
    },
    getAllUserInvitation: (email: string, callback: (invite: InviteType, isRemoving: boolean) => void): Unsubscribe => {
        return InviteService.shared.getAllInvites(email, callback)
    }
}))