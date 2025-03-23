import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserType } from "@/src/types/UserType";
import UserService from "@services/firebase/firestore/UserService";
import GoogleAuthService from "@services/firebase/authentication/GoogleAuthService";
import EmailAndPasswordService from "@services/firebase/authentication/EmailAndPasswordService";
import { UserSessionType } from "../types/UserSessionType";
import { Unsubscribe as UnsubscribeAuth } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import { redirect } from "react-router-dom";
import { StepsAuth } from "../enums/StepsAuth";
import { ACCOUNT_NOT_VERIFIED_MESSAGE } from "@utils/constants";
import TeamService from "../services/firebase/firestore/TeamService";
import { TeamType } from "../types/TeamType";

const initalState: State = {
    userEmail: "",
    userPassword: "",
    userFullName: "",
    stepsAuth: StepsAuth.AUTHENTICATION,
    currentUser: null,
    loadingUserSession: false,
}

interface State {
    userSession?: UserSessionType | null
    user?: UserType
    userFullName: string
    userEmail: string
    userPassword: string
    stepsAuth: StepsAuth
    loadingUserSession: boolean
    currentUser: UserSessionType | null
}

interface Actions {
    setUser: (user?: UserType) => void
    setUserSession: (session: UserSessionType | null) => void
    setStepsAuth: (arg: StepsAuth) => void
    setUserEmail: (email: string) => void
    setUserPassword: (password: string) => void
    setUserFullName: (fullName: string) => void
    authenticationListener: (callback: (user: UserSessionType | null) => void) => UnsubscribeAuth
    createUserWithEmailAndPassword: () => Promise<UserSessionType>
    signInWithEmailAndPassword: () => Promise<UserType>
    signInWithGoogle: () => Promise<[UserType, boolean]>
    resetPassword: () => Promise<string>
    onResetPassword: (oobCode: string, password: string, confirmedPassword: string) => Promise<{ message: string, type: string }>
    isAuthenticationRoute: () => Response | null
    observingUserData: (userId: string) => Unsubscribe
    logout: () => Promise<void>
    addMemberInvited: (teamIdInvited: string, session: UserSessionType) => Promise<TeamType>
}

export const useUserSessionStore = create<Actions & State>()(
    persist(
        (set, get) => ({
            ...initalState,
            setUser: (user?: UserType) => set({ user }),
            setUserSession: (userSession: UserSessionType | null) => set({ userSession }),
            setStepsAuth: (stepsAuth: StepsAuth) => set({ stepsAuth }),
            setUserEmail: (email: string) => set({ userEmail: email }),
            setUserPassword: (password: string) => set({ userPassword: password }),
            setUserFullName: (fullName: string) => set({ userFullName: fullName }),
            isAuthenticationRoute: (): Response | null => {
                const { userSession } = get()
                if (userSession) {
                    return null
                } else {
                    return redirect("/auth")
                }
            },
            signInWithGoogle: async (): Promise<[UserType, boolean]> => {
                return new Promise((resolve, reject) => {
                    set({ loadingUserSession: true })
                    GoogleAuthService.shared.loginWithGoogle()
                        .then(data => {
                            const session = data.session
                            const userData: UserType = {
                                session,
                                teams: [],
                                createdAt: new Date(),
                                memberOfTeams: []
                            };

                            if (session.isNewAccount) {
                                UserService.shared.createUser(userData)
                                    .then(() => {
                                        set(() => ({
                                            userSession: session,
                                            user: userData,
                                            loadingUserSession: false,
                                            errorUsers: null
                                        }));
                                    })
                                    .catch(error => {
                                        set({
                                            loadingUserSession: false
                                        });
                                    });

                                resolve([userData, session.isNewAccount])
                            } else {
                                set(() => ({
                                    userSession: session,
                                    user: data.user,
                                    loadingUserSession: false,
                                    errorUsers: null
                                }));
                                resolve([userData, false])
                            }
                        })
                        .catch(err => {
                            set({ loadingUserSession: false })
                            reject(err)
                        })
                })
            },
            createUserWithEmailAndPassword: async () => {
                return new Promise((resolve, reject) => {
                    const { userEmail, userPassword, userFullName } = get()

                    set({ loadingUserSession: true })
                    EmailAndPasswordService.shared.registerWithEmailAndPassword(userEmail, userPassword)
                        .then(user => {
                            user.displayName = userFullName

                            const userData: UserType = {
                                session: user,
                                teams: [],
                                createdAt: new Date(),
                                memberOfTeams: []
                            };
                            UserService.shared.createUser(userData)
                                .then(() => {
                                    set(() => ({
                                        userSession: userData.session,
                                        user: userData,
                                        loadingUserSession: false,
                                        readyToGo: null
                                    }));
                                    resolve(user)
                                })
                                .catch(() => {
                                    set({
                                        loadingUserSession: false
                                    });
                                    reject("Ocorreu um erro desconhecido ao salvar as informações.")
                                });

                        })
                        .catch(err => {
                            set({
                                loadingUserSession: false
                            });
                            reject(err)
                        })
                })
            },
            signInWithEmailAndPassword: async (): Promise<UserType> => {
                return new Promise((resolve, reject) => {
                    const { userEmail, userPassword } = get()
                    set({
                        loadingUserSession: true
                    });
                    EmailAndPasswordService.shared.loginWithEmailAndPassword(userEmail, userPassword)
                        .then(data => {
                            if (!data.session.isEmailVerified) {
                                return Promise.reject(ACCOUNT_NOT_VERIFIED_MESSAGE)
                            } else {
                                set(() => ({
                                    userSession: data.session,
                                    user: data.user,
                                    loadingUserSession: false,
                                    errorUsers: null
                                }));

                                if (data.user) {
                                    resolve(data.user)
                                }
                            }
                        })
                        .catch(error => {
                            set({
                                loadingUserSession: false
                            });
                            reject(error)
                        })
                })
            },
            observingUserData: (userId: string): Unsubscribe => {
                return UserService.shared.observingUserData(userId, (user) => {
                    set({ user })
                })
            },
            resetPassword: (): Promise<string> => {
                const { userEmail } = get();
                return new Promise((resolve, reject) => {
                    EmailAndPasswordService.shared.resetPassWord(userEmail)
                        .then(() => {
                            resolve('E-mail de redefinição de palavra-passe enviado com sucesso!');
                        })
                        .catch(() => {
                            reject('Erro ao enviar e-mail de redefinição de palavra-passe, por favor, verifique o seu e-mail!');
                        });
                });
            },
            onResetPassword: (oobCode: string, password: string, confirmedPassword: string): Promise<{ message: string, type: string }> => {
                return new Promise((resolve, reject) => {
                    if (password === '') {
                        reject({ message: 'Digite a palavra-passe', type: 'warning' });
                    } else if (confirmedPassword === '') {
                        reject({ message: 'Confirme a palavra-passe', type: 'warning' });
                    } else if (password !== confirmedPassword) {
                        reject({ message: 'Palavra-passe mal confirmada.', type: 'warning' });
                    } else if (oobCode) {
                        EmailAndPasswordService.shared.forResetPassword(oobCode, password)
                            .then(() => {
                                resolve({ message: 'Palavra-passe redefinida com sucesso!', type: 'success' });
                            })
                            .catch(() => {
                                reject({ message: 'Ocorreu algum erro ao redefinir a sua palavra-passe.', type: 'error' });
                            });
                    }
                });
            },
            authenticationListener: (callback: (user: UserSessionType | null) => void) => {
                return EmailAndPasswordService.shared.onAuthenticationListener(session => {
                    if (session) {
                        callback(session)
                    } else {
                        set({ userSession: undefined })
                        useUserSessionStore.persist.clearStorage()
                        callback(null)
                    }
                })
            },
            logout: async () => {
                EmailAndPasswordService.shared.logoutSession()
                    .then(() => {
                        useUserSessionStore.persist.clearStorage()
                        set({ stepsAuth: StepsAuth.AUTHENTICATION })
                    })
            },
            addMemberInvited: (teamIdInvited: string, session: UserSessionType) => {
                return new Promise((resolve, reject) => {
                    const userData: UserType = {
                        session,
                        teams: [],
                        createdAt: new Date(),
                        memberOfTeams: []
                    };

                    if (teamIdInvited) {
                        TeamService.shared.addMemberToTeam(userData, teamIdInvited)
                            .then(async (team) => {
                                await UserService.shared.associateUserAsMemberToTeam(session.id, team)
                                resolve(team)
                            })
                            .catch(reject)
                    }
                })
            },
        }),
        {
            name: "@workSyncSession",
            storage: createJSONStorage(() => localStorage),
            partialize: (persistedState) =>
                ({ userSession: persistedState.userSession, user: persistedState.user }),
        }
    )
)
