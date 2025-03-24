import { create } from "zustand";
import GithubService from "../services/github/GitHubService";
import { GitHubIntegrationType } from "@/src/types/IntegrationType";
import { createJSONStorage, persist } from "zustand/middleware";

const initialState: State = {
    id: '',
    userName: '',
    repoName: '',
    token: '',
    integrationWithGithub: undefined,
}

interface State {
    id: string
    userName: string
    repoName: string
    token: string
    integrationWithGithub?: GitHubIntegrationType
}

interface Actions {
    setId: (value: string) => void
    setUserName: (value: string) => void
    setRepoName: (value: string) => void
    setToken: (value: string) => void
    setIntegrationWithGithub: (integrationWithGithub?: GitHubIntegrationType) => void
    fetchIntegrationWithGithubData: (integrationWithGithubId: string) => void
    createGitHubIntegration: () => Promise<void>
    updateGitHubIntegration: (newRepoName: string) => Promise<void>
}

export const useIntegrationStore = create<Actions & State>()(
    persist(
        (set, get) => ({
            ...initialState,
            setId: (id: string) => set({ id }),
            setUserName: (userName: string) => set({ userName }),
            setRepoName: (repoName: string) => set({ repoName }),
            setToken: (token: string) => set({ token }),
            setIntegrationWithGithub: (integrationWithGithub?: GitHubIntegrationType) => set({ integrationWithGithub }),
            fetchIntegrationWithGithubData: async (integrationWithGithubId: string) => {
                try {
                    const integrationData = await new GithubService('').getGitHubData(integrationWithGithubId);
                    set({ integrationWithGithub: integrationData });
                } catch (error) {
                    console.error('Erro ao buscar dados da integração:', error);
                    throw error;
                }
            },
            createGitHubIntegration: (): Promise<void> => {

                const { integrationWithGithub } = get()

                return new Promise((resolve, reject) => {

                    if (integrationWithGithub?.userName === '') {
                        reject('Informa o nome do proprietário do repositório')
                    } if (integrationWithGithub?.repoName === '') {
                        reject('Informa o nome do repositório')
                    } if (integrationWithGithub?.token === '') {
                        reject('Informa o Token')
                    } if (integrationWithGithub?.id === '') {
                        reject('Selecione o WorkSpace')
                    } else {

                        const data: GitHubIntegrationType = {
                            id: integrationWithGithub?.id as string,
                            userName: integrationWithGithub?.userName as string,
                            repoName: integrationWithGithub?.repoName as string,
                            token: integrationWithGithub?.token as string,
                        }

                        console.log('AAAA',integrationWithGithub)
                        new GithubService(data.token).createRepositoryGitHubIntegration(data)
                            .then(() => {
                                set({ integrationWithGithub: data });
                                resolve()
                            })
                            .catch(() => {
                                reject()
                            })
                    }
                })
            },
            updateGitHubIntegration: (newRepoName: string): Promise<void> => {
                const { integrationWithGithub } = get()

                return new Promise((resolve, reject) => {
                    if (integrationWithGithub?.userName === '') {
                        reject('Informa o nome do proprietário do repositório')
                    } if (integrationWithGithub?.repoName === '') {
                        reject('Informa o nome do repositório')
                    } if (integrationWithGithub?.token === '') {
                        reject('Informa o Token')
                    } else {

                        const NewGitHubIntegration: GitHubIntegrationType = {
                            id: integrationWithGithub?.id as string,
                            userName: integrationWithGithub?.userName as string,
                            repoName: integrationWithGithub?.repoName as string,
                            token: integrationWithGithub?.token as string,
                        }

                        new GithubService(NewGitHubIntegration.token).updateGitHubRepositoryIntegration(NewGitHubIntegration, newRepoName)
                            .then((result) => {
                                set({ integrationWithGithub: { ...NewGitHubIntegration, repoName: result } });
                                resolve()
                            })
                            .catch(() => {
                                reject()
                            })
                    }
                })
            }
        }),
        {
            partialize: (state) => ({ integrationWithGithub: state.integrationWithGithub }),
            name: "@IntegrationWithGithubStore",
            storage: createJSONStorage(() => localStorage)
        }
    )
)