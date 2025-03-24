import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface State {
    isTourOpened: boolean
    tourOnTask: boolean
    tourOnTeam: boolean
    tourOnWorkspace: boolean
}

interface Actions {
    setToOpenTour: (value: boolean) => void
    setTourSectionDone: (type: "task" | "team" | "workspace") => void
}

const initialState: State = {
    isTourOpened: false,
    tourOnTask: false,
    tourOnTeam: false,
    tourOnWorkspace: false
}

export const useTourStore = create<Actions & State>()(
    persist(
        (set) => ({
            ...initialState,
            setTourSectionDone: (type: "task" | "team" | "workspace") => {
                if (type == "task") {
                    set({ tourOnTask: true })
                } else if (type == "team") {
                    set({ tourOnTeam: true })
                } else if (type == "workspace") {
                    set({ tourOnWorkspace: true })
                }
            },
            setToOpenTour: (isTourOpened: boolean) => {
                set({ isTourOpened})
            }
        }),
        {
            partialize: (state) => ({ tourOnTask: state.tourOnTask, tourOnTeam: state.tourOnTeam }),
            name: "@zenTour",
            storage: createJSONStorage(() => localStorage)
        }
    )
);