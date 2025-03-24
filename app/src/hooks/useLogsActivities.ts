import { create } from "zustand"
import { Unsubscribe } from "firebase/firestore"
import { LogActivityType } from "../types/LogActivityType"
import LogsActivityService from "../services/firebase/firestore/LogsActivityService"

interface State {
    logs: LogActivityType[]
}

const initialState: State = {
    logs: []
}

interface Actions {
    showLogs: (teamId: string) => Unsubscribe
}

export const useLogsActivitiesStore = create<Actions & State>((set) => ({
    ...initialState,
    showLogs(teamId) {
        return LogsActivityService.shared.showActivities(teamId, (log) => {
            if (log) {
                set((state) => {

                    state.logs.push(log)
                    const reversedArray = state.logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

                    return ({ logs: reversedArray })
                })
            } else {
                set({ logs: [] })
            }
        })
    }
}))