import {
	Box,
	Spacer,
	Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ZentaakButton } from "@/src/components/Button";
import DividerAuth from "./components/DividirAuth";

import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import SocialAuth from "./components/SocialAuth";
import { FormAuth } from "@/src/enums/FormAuth";
import CreateEmailAccountForm from "./components/CreateEmailAccountForm";
import LoginEmailAccountForm from "./components/LoginEmailAccountForm";
import { useUserSessionStore } from "@hooks/useUserSession";
import { useAppStore } from "@/src/hooks/useAppStore";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeamStore } from "@/src/hooks/useTeam";
import { UserType } from "@/src/types/UserType";
import { ACCOUNT_NOT_VERIFIED_MESSAGE } from "@/src/utils/constants";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import generateId from "@/src/services/UUID";
import { UserSessionType } from "@/src/types/UserSessionType";
import { TeamType } from "@/src/types/TeamType";


export default function AuthenticationPage() {

	const [showAuthForm, setShowAuthForm] = useState<FormAuth>(FormAuth.EMAIL_LOGIN);

	const location = useLocation()
	const params = new URLSearchParams(location.search)
	const navigate = useNavigate()
	const teamId = params.get('teamId')
	const invited = params.get('invited')

	const userPassword = useUserSessionStore(state => state.userPassword)
	const userFullName = useUserSessionStore(state => state.userFullName)
	const userEmail = useUserSessionStore(state => state.userEmail)
	const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
	const setUserEmail = useUserSessionStore(state => state.setUserEmail)
	const setUser = useUserSessionStore(state => state.setUser)
	const setUserPassword = useUserSessionStore(state => state.setUserPassword)
	const setUserFullName = useUserSessionStore(state => state.setUserFullName)
	const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
	const createUserWithEmailAndPassword = useUserSessionStore(state => state.createUserWithEmailAndPassword)
	const signInWithGoogle = useUserSessionStore(state => state.signInWithGoogle)
	const signInWithEmailAndPassword = useUserSessionStore(state => state.signInWithEmailAndPassword)
	const addMemberInvited = useUserSessionStore(state => state.addMemberInvited)

	const createNewWorkspace = useWorkspaceStore(state => state.createNewWorkspace)

	const onAuthClose = useAppStore(state => state.onModalClose)

	const createTeam = useTeamStore(state => state.createTeam)
	const getAllUserTeams = useTeamStore(state => state.getAllUserTeams)
	const selectCurrentTeam = useTeamStore(state => state.selectCurrentTeam)
	const resendEmailVerification = useUserSessionStore(state => state.sendEmailVerification)

	const { toastMessage, ToastStatus, } = useToastMessage();

	const [sendVerificationLink, setSendVerificationLink] = useState<boolean>(false)

	useEffect(() => {
		if (invited) {
			setUserEmail(invited)
		}

	}, [invited])

	function onChangeAuthState() {
		if (showAuthForm === FormAuth.EMAIL_LOGIN) {
			setShowAuthForm(FormAuth.EMAIL_REGISTER)
		} else {
			setShowAuthForm(FormAuth.EMAIL_LOGIN)
		}
	}

	function onForgotPassword() {
		setStepsAuth(StepsAuth.ACCOUNTRECOVEVY)
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


	function handleRegisterWithEmailAndPassword() {
		createUserWithEmailAndPassword()
			.then((session) => {
				if (invited && teamId) {
					addMemberInvited(teamId, session)
						.then((team) => {
							handleCreateTeamAndWorkspace(session, team)
								.then((user) => {
									setUser(user)
									selectCurrentTeam(team)
									setStepsAuth(StepsAuth.PLANS)
									//setStepsAuth(StepsAuth.EMAIL_VERIFICATION)
								})
						})
						.catch(error => {
							setStepsAuth(StepsAuth.CREATE_TEAM)
							toastMessage({
								title: "Adicionar na equipe",
								description: error,
								statusToast: ToastStatus.WARNING,
								position: "bottom"
							})
						})
				} else {
					setStepsAuth(StepsAuth.CREATE_TEAM)
				}
			})
			.catch(err => {
				toastMessage({
					title: "Criar conta",
					description: err,
					statusToast: ToastStatus.ERROR,
					position: "bottom"
				})
			})
	}

	function handleLoginWithEmailAndPassword() {
		signInWithEmailAndPassword()
			.then(async (user) => {

				getAllUserTeams(user.session.id)
					.then(() => {
						setStepsAuth(StepsAuth.HOME)
						navigate(`/home`)
						onAuthClose()
					})
					.catch(err => {
						toastMessage({
							title: "Entrar na conta",
							description: err,
							statusToast: ToastStatus.ERROR,
							position: "bottom"
						})
					})
			})
			.catch(err => {
				if (err === ACCOUNT_NOT_VERIFIED_MESSAGE) {
					setSendVerificationLink(true)

					toastMessage({
						title: "Entrar na conta",
						description: err,
						statusToast: ToastStatus.ERROR,
						position: "bottom"
					})
				} else {
					toastMessage({
						title: "Entrar na conta",
						description: err,
						statusToast: ToastStatus.ERROR,
						position: "bottom"
					})
				}
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
									title: "Adicionar na equipe",
									description: error,
									statusToast: ToastStatus.WARNING,
									position: "bottom"
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
							onAuthClose()
						})
						.catch(err => {
							toastMessage({
								title: "Continuar com o google",
								description: err,
								statusToast: ToastStatus.ERROR,
								position: "bottom"
							})
						})
				}
			})
			.catch(err => {
				toastMessage({
					title: "Continuar com o google",
					description: err,
					statusToast: ToastStatus.ERROR,
					position: "bottom"
				})
			})
	}

	function handleAuthOperation() {
		if (showAuthForm === FormAuth.EMAIL_LOGIN) {
			handleLoginWithEmailAndPassword()
		} else {
			handleRegisterWithEmailAndPassword()
		}
	}

	function handleTextButtonAuthOperation(): string {
		if (showAuthForm === FormAuth.EMAIL_LOGIN) {
			return "Entra na conta"
		}
		return "Criar conta"
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleAuthOperation()
		}
	}

	function handleSendEmailVerification() {
		resendEmailVerification()
			.then(() => {
				toastMessage({
					title: "Email de verificação de conta",
					description: "E-mail enviado com sucesso",
					statusToast: ToastStatus.SUCCESS,
					position: "bottom"
				})
			})
			.catch(() => {
				toastMessage({
					title: "Email de verificação de conta",
					description: "Erro ao enviar e-mail",
					statusToast: ToastStatus.ERROR,
					position: "bottom"
				})
			})
	}

	return (
		<Box as="form">
			<CreateEmailAccountForm
				showAuthForm={showAuthForm}
				fullName={userFullName}
				email={userEmail}
				password={userPassword}
				onChangeFullName={setUserFullName}
				onChangeEmail={setUserEmail}
				onChangePassword={setUserPassword}
			/>

			<LoginEmailAccountForm
				email={userEmail}
				password={userPassword}
				showAuthForm={showAuthForm}
				onKeyDown={onKeyDown}
				onChangeEmail={setUserEmail}
				onChangePassword={setUserPassword}
				onClickToRecoverPassword={onForgotPassword}
			/>

			<Spacer height={4} />

			<ZentaakButton
				variant="primary"
				width="100%"
				mt="5"
				isDisabled={userEmail === "" || userPassword === ""}
				isLoading={loadingUserSession}
				_disabled={{ background: "red.100", opacity: 0.5 }}
				onClick={handleAuthOperation}
			>
				{handleTextButtonAuthOperation()}
			</ZentaakButton>
			{
				sendVerificationLink ?
					<ZentaakButton
						mt={2}
						variant='link'
						onClick={handleSendEmailVerification}
						w='100%'
					>
						<Text
							as='u'
							fontSize='12px'
							alignSelf={'center'}
						>
							Reenviar e-mail de verificação
						</Text>
					</ZentaakButton>
					: null
			}
			<DividerAuth />
			{
				showAuthForm === FormAuth.EMAIL_LOGIN ?
					<SocialAuth
						googleTitleButton="Entrar com o Google"
						phoneNumberTitleButton="Entrar com o Telefone"
						emailTitleButton="Entrar com o E-mail"
						hasAlreadyAccount={onChangeAuthState}
						onGoogleSignIn={handleGoogleSignIn}
						type={1}
					/>
					:
					<SocialAuth
						googleTitleButton="Regista-se com o Google"
						phoneNumberTitleButton="Regista-se com o Telefone"
						emailTitleButton="Regista-se com o E-mail"
						hasAlreadyAccount={onChangeAuthState}
						onGoogleSignIn={handleGoogleSignIn}
						type={0}
					/>
			}
		</Box>
	);
}