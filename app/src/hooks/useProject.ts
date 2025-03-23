import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProjectType } from "../types";
import ProjectService from "../services/firebase/firestore/ProjectService";
import { Unsubscribe } from "firebase/auth";

interface Actions {
    createProject: (project: ProjectType) => Promise<void>,
    observingAllProjects: (ownerId: string, callback: (project: ProjectType | null, isRemoving: boolean) => void) => Unsubscribe
}

interface State {
    projects: ProjectType[],
    loadingProjects: boolean,
    errorProject: string | null
    projectName: string
    project?: ProjectType
    infoMessage: string,
}

const initialStates: State = {
    errorProject: null,
    loadingProjects: false,
    projectName: "",
    projects: [],
    project: undefined,
    infoMessage: "",
}

export const useProject = create<Actions & State>()(
    persist(
        (set, get) => ({
            ...initialStates,
            createProject: async (project: ProjectType) => {
                set({ loadingProjects: true })
                try {
                    await ProjectService.shared.createProject(project)
                    set({
                        infoMessage: "Projecto criado com sucesso",
                        project: project,
                        loadingProjects: false
                    })
                } catch (error: any) {
                    set({
                        errorProject: new Error(error).message,
                        loadingProjects: false
                    })
                }
            },
            observingAllProjects: (ownerId: string, callback: (project: ProjectType | null, isRemoving: boolean) => void): Unsubscribe => {
                return ProjectService.shared.getAllProjects(ownerId, (project, isRemoving) => {
                    if (project) {
                        set(state => ({
                            projects: [...state.projects, project],
                            loadingProjects: false,
                        }))

                        callback(project, isRemoving)
                    } else {
                        set({
                            loadingProjects: false,
                        })
                        callback(null, isRemoving)
                    }
                })
            },
        }),
        {
            partialize: (state) => ({ project: state.project }),
            name: "@workSyncProjects",
            storage: createJSONStorage(() => localStorage)
        }
    )
)