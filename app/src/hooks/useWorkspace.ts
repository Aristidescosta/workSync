import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { TeamType } from "../types/TeamType";
import WorkspaceService from "../services/firebase/firestore/WorkspaceService";
import { WorkspaceType } from "../types/WorkspaceType";
import generateId from "../services/UUID";
import { Unsubscribe } from "firebase/firestore";

interface State {
    workspaceName: string
    workspaceDescription: string
    infoMessage: string
    workspaces: WorkspaceType[]
    workspace?: WorkspaceType
    loadingWorkspaces: boolean
    errorWorkspace: string | null
}

interface Actions {
    setWorkspaceName: (value: string) => void
    setWorkspaceDescription: (value: string) => void
    editWorkspace(workspace: WorkspaceType): Promise<void>
    setWorkspace: (workspace: WorkspaceType | undefined) => void
    setWorkspaces: (workspace: WorkspaceType[]) => void
    createNewWorkspace: (team: TeamType, myWorkspace?: WorkspaceType) => Promise<void>
    getTeamWorkspaces: (teamId: string) => Promise<WorkspaceType[]>
    observingAllWorkspaces: (teamId: string, callback: (workspace: WorkspaceType | null, isRemoving: boolean) => void) => Unsubscribe
}

const initialStates: State = {
    workspaceName: "",
    workspaceDescription: "",
    infoMessage: "",
    workspaces: [],
    workspace: undefined,
    loadingWorkspaces: true,
    errorWorkspace: null,
}

export const useWorkspaceStore = create<Actions & State>()(
    persist(
        (set, get) => ({
            ...initialStates,
            setWorkspaceName: (workspaceName: string) => set({ workspaceName }),
            setWorkspaceDescription: (workspaceDescription: string) => set({ workspaceDescription }),
            setWorkspace: (workspace: WorkspaceType | undefined) => set({ workspace }),
            setWorkspaces: (workspaces: WorkspaceType[]) => set({ workspaces }),
            createNewWorkspace: async (team: TeamType, myWorkspace?: WorkspaceType) => {

                const { workspaceName, workspaceDescription } = get()

                if (myWorkspace) {
                    try {
                        await WorkspaceService.shared.createNewWorkspace(myWorkspace)
                        set({
                            infoMessage: "",
                            workspace: myWorkspace,
                            loadingWorkspaces: false
                        })
                    } catch (error: any) {
                        set({
                            infoMessage: new Error(error).message,
                            loadingWorkspaces: false
                        })
                    }
                } else {
                    if (workspaceName === "") {
                        set({ infoMessage: "Digite o nome do workspace." })
                    } else if (team === undefined) {
                        set({ infoMessage: "Ocorreu um erro desconhecido." })
                    } else {
                        const workspace: WorkspaceType = {
                            workspaceId: generateId(),
                            workspaceName,
                            workspaceDescription,
                            team,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            isClosed: false,
                        }
    
                        try {
                            await WorkspaceService.shared.createNewWorkspace(workspace)
                            set({
                                infoMessage: "",
                                workspace: workspace,
                                loadingWorkspaces: false
                            })
                        } catch (error: any) {
                            set({
                                infoMessage: new Error(error).message,
                                loadingWorkspaces: false
                            })
                        }
                    }
                }
            },
            getTeamWorkspaces: async (teamId: string): Promise<WorkspaceType[]> => {
                const workspaces = await WorkspaceService.shared.getTeamWorkspaces(teamId)
                set({ workspaces })
                return Promise.resolve(workspaces)
            },
            observingAllWorkspaces: (teamId: string, callback: (workspace: WorkspaceType | null, isRemoving: boolean) => void): Unsubscribe => {
                return WorkspaceService.shared.getAllWorkspaces(teamId, (workspace, isRemoving) => {
                    if (workspace) {
                        set(state => ({
                            workspaces: [...state.workspaces, workspace],
                            loadingWorkspaces: false,
                        }))

                        callback(workspace, isRemoving)
                    } else {
                        set({
                            loadingWorkspaces: false,
                        })
                        callback(null, isRemoving)
                    }
                })
            },
            editWorkspace: (workspace: WorkspaceType) => {
                set({
                    loadingWorkspaces: true
                })
                return WorkspaceService.shared.editWorkspace(workspace)
                    .then(() => {
                        set(state => ({
                            workspaces: state.workspaces.map(workspaceFinded => workspaceFinded.workspaceId === workspace.workspaceId ? workspace : workspaceFinded),
                            loadingWorkspaces: false
                        }))
                    })
                    .catch(error => {
                        return Promise.reject(error)
                    })
            },
        }),
        {
            partialize: (state) => ({ workspace: state.workspace }),
            name: "@zenWorkspaces",
            storage: createJSONStorage(() => localStorage)
        }
    )
)