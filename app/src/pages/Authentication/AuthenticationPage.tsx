import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthenticationSchema, createEmailAccountSchema } from '@/src/schemas'
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserSessionStore } from '@/src/hooks'
import { useToastMessage } from '@/react-toastify'
import { useState } from 'react'
import { FormAuth } from '@/src/enums/FormAuth'
import { UserSessionType, UserType } from '@/src/types'
import generateId from '@/src/services/UUID'
import { TeamType } from '@/src/types/TeamType'
import { useTeamStore } from '@/src/hooks/useTeam'
import { useWorkspaceStore } from '@/src/hooks/useWorkspace'
import { StepsAuth } from '@/src/enums/StepsAuth'
import { LoginForm, SignUpForm } from './components'
import { WorkSyncModal } from '@/src/components/modals'
import { CreateWorkSpacePage } from './CreateWorkSpacePage'
import { CreateTeamPage } from './CreateTeamPage'

export const AuthenticationPage = () => {
    const stepsAuth = useUserSessionStore(state => state.stepsAuth)
    const { toastMessage, ToastStatus, } = useToastMessage();
    const signInWithGoogle = useUserSessionStore(state => state.signInWithGoogle)
    const signInWithEmailAndPassword = useUserSessionStore(state => state.signInWithEmailAndPassword)
    const setUserEmail = useUserSessionStore(state => state.setUserEmail)
    const setUser = useUserSessionStore(state => state.setUser)
    const setUserPassword = useUserSessionStore(state => state.setUserPassword)
    const addMemberInvited = useUserSessionStore(state => state.addMemberInvited)
    const navigate = useNavigate()
    const createTeam = useTeamStore(state => state.createTeam)
    const createNewWorkspace = useWorkspaceStore(state => state.createNewWorkspace)
    const location = useLocation()
    const getAllUserTeams = useTeamStore(state => state.getAllUserTeams)
    const selectCurrentTeam = useTeamStore(state => state.selectCurrentTeam)
    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
    const params = new URLSearchParams(location.search)
    const teamId = params.get('teamId')
    const invited = params.get('invited')


    const formLogin = useForm<z.infer<typeof AuthenticationSchema>>({
        resolver: zodResolver(AuthenticationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const formSingUp = useForm<z.infer<typeof createEmailAccountSchema>>({
        resolver: zodResolver(createEmailAccountSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            phone: "+244"
        },
    })

    const [showAuthForm, setShowAuthForm] = useState<FormAuth>(FormAuth.EMAIL_LOGIN);

    function onChangeAuthState() {
        if (showAuthForm === FormAuth.EMAIL_LOGIN) {
            setShowAuthForm(FormAuth.EMAIL_REGISTER)
        } else {
            setShowAuthForm(FormAuth.EMAIL_LOGIN)
        }
    }

    function handleCreateTeamAndWorkspace(session: UserSessionType, teamFromInvitation: TeamType): Promise<UserType> {
        return new Promise((resolve, reject) => {
            const user: UserType = {
                session,
                teams: [],
                memberOfTeams: [teamFromInvitation],
                createdAt: new Date()
            }

            const teamId = generateId()

            Promise.all([
                createTeam(user, teamId, "Minha equipa"),
                createNewWorkspace(
                    {
                        createdAt: new Date(),
                        owner: user,
                        teamId,
                        teamName: "Minha equipa"
                    },
                    {
                        workspaceId: generateId(),
                        workspaceName: "Meu workspace",
                        workspaceDescription: "Meu workspace",
                        team: {
                            createdAt: new Date(),
                            owner: user,
                            teamId,
                            teamName: "Minha equipa"
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        isClosed: false,
                    }
                )
            ]).then(() => resolve(user))
                .catch(reject)
        })
    }

    function handleGoogleSignIn() {
        signInWithGoogle()
            .then((data) => {

                const user = data[0]
                const isNewUser = data[1]

                if (isNewUser) {
                    if (invited && teamId) {
                        addMemberInvited(teamId, user.session)
                            .then((team) => {
                                handleCreateTeamAndWorkspace(user.session, team)
                                    .then(() => {
                                        user.memberOfTeams.push(team)
                                        setUser(user)
                                        selectCurrentTeam(team)
                                        setStepsAuth(StepsAuth.PLANS)
                                        //setStepsAuth(StepsAuth.HOME)
                                        //navigate(`/home/${team.teamId}`)
                                        //onAuthClose()
                                    })
                            })
                            .catch(error => {
                                setStepsAuth(StepsAuth.CREATE_TEAM)
                                toastMessage({
                                    title: error,
                                    statusToast: ToastStatus.WARNING,
                                    position: "top-right"
                                })
                            })
                    } else {
                        setStepsAuth(StepsAuth.CREATE_TEAM)
                    }

                } else {
                    getAllUserTeams(user.session.id)
                        .then(() => {
                            setStepsAuth(StepsAuth.HOME)
                            navigate(`/home`)
                            /* onAuthClose() */
                        })
                        .catch(err => {
                            toastMessage({
                                title: err,
                                statusToast: ToastStatus.ERROR,
                                position: "top-right"
                            })
                        })
                }
                onOpenModal()
            })
            .catch(err => {
                toastMessage({
                    title: err,
                    statusToast: ToastStatus.ERROR,
                    position: "top-right"
                })
            })
    }

    function onSubmit(data: z.infer<typeof AuthenticationSchema>) {
        setUserEmail(data.email)
        setUserPassword(data.password)

        signInWithEmailAndPassword()
            .then(async (user) => {
                navigate(`/`)
            })
            .catch(err => {
                toastMessage({
                    title: err,
                    statusToast: ToastStatus.ERROR,
                    position: "top-right"
                })
            })
    }

    const [isModalOpen, setIsOpenModal] = useState(false)


    const onCloseModal = () => {
        setIsOpenModal(false)
    }
    const onOpenModal = () => {
        setIsOpenModal(true)
    }


    return (
        <>
            {showAuthForm === FormAuth.EMAIL_LOGIN && (
                <LoginForm
                    form={formLogin}
                    handleGoogleSignIn={handleGoogleSignIn}
                    onSubmit={onSubmit}
                    onChangeAuthState={onChangeAuthState}
                />
            )}

            {showAuthForm === FormAuth.EMAIL_REGISTER && (
                <SignUpForm
                    form={formSingUp}
                    handleGoogleSignIn={handleGoogleSignIn}
                    onSubmit={onSubmit}
                    onChangeAuthState={onChangeAuthState}
                />
            )}

            <WorkSyncModal
                isOpen={isModalOpen}
                onClose={() => console.log}
                title='Bem vindo ao Work Sync'
                subtitle='Faça login ou registe-se e desfrute de recursos exclusivos.'
            >
                {
                    stepsAuth === StepsAuth.CREATE_PROJECT ?
                        <CreateWorkSpacePage 
                        />
                        :
                        stepsAuth === StepsAuth.EMAIL_VERIFICATION ?
                            <h1>Verificar o email</h1>
                            :
                            stepsAuth === StepsAuth.PLANS ?
                                <h1>Planos</h1>
                                :
                                stepsAuth === StepsAuth.ACCOUNTRECOVEVY ?
                                    <h1>Recuperar conta</h1>
                                    :
                                    <CreateTeamPage buttonText='Seguinte' />


                }
            </WorkSyncModal>

        </>

    )
}
