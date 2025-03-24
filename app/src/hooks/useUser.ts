import { create } from "zustand";

import { UserType } from "@/src/types/UserType";
import UserService from "../services/firebase/firestore/UserService";

const initialState: State = {
	loadingUsers: true,
	errorUsers: null,
	users: [],
	emailToSearch: "",
	userToInvite: null,
}

interface State {
	userToInvite: UserType | null
	emailToSearch: string
	loadingUsers: boolean
	errorUsers: string | null
	users: UserType[]
}

interface Actions {
	setEmailToSearch: (emailToSearch: string) => void
	searchUserToInvite: () => Promise<UserType | null>
	
}

export const useUserStore = create<Actions & State>((set, get) => ({
	...initialState,
	setEmailToSearch: (emailToSearch: string) => set({ emailToSearch }),
	searchUserToInvite: () => {
		return new Promise((resolve, reject) => {
			UserService.shared.searchUserToInvite(get().emailToSearch)
				.then(userToInvite => {
					set({ userToInvite })
					resolve(userToInvite)
				})
				.catch(reject)
		})
	},
	
}))