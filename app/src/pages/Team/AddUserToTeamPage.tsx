import { ZenTaakIcon } from "@/react-icons";
import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { FormLabel, InputGroup, Input, InputRightElement, Button, Box, Spinner, Text, Flex, HStack } from "@chakra-ui/react";
import { useUserStore } from "@/src/hooks/useUser";
import { useState } from "react";
import { TeamItem } from "./components/TeamItem";
import { ZentaakButton } from "@/src/components/Button";
import { useInviteUserStore } from "@/src/hooks/useInviteUser";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";

interface AddUserToTeamPage extends iModalPage { }

export default function AddUserToTeamPage(props: AddUserToTeamPage) {

	const {
		isOpen,
		onClose,
	} = props

	const height = window.innerHeight

	enum FlagResult {
		INIT,
		RESULT,
		NOT_FOUND
	}

	const [loading, setLoading] = useState<boolean>(false)
	const [sendingInvite, setSendingInvite] = useState<boolean>(false)
	const [sendingEmail, setSendingEmail] = useState<boolean>(false)
	const [emailSent, setEmailSent] = useState<boolean>(false)
	const [flagResult, setFlagResult] = useState<FlagResult>(FlagResult.INIT)

	const session = useUserSessionStore(state => state.userSession)

	const team = useTeamStore(state => state.team)

	const emailToSearch = useUserStore(state => state.emailToSearch)
	const userToInvite = useUserStore(state => state.userToInvite)
	const setEmailToSearch = useUserStore(state => state.setEmailToSearch)
	const searchUserToInvite = useUserStore(state => state.searchUserToInvite)

	const sendEmailToInviteUser = useInviteUserStore(state => state.sendEmailToInviteUser)
	const sendInvitationToUser = useInviteUserStore(state => state.sendInvitationToUser)

	const { toastMessage, ToastStatus } = useToastMessage()

	function onChangeValue(e: React.ChangeEvent<HTMLInputElement>) {
		setEmailToSearch(e.target.value)
	}

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleSearch();
		}
	}

	async function handleSearch() {
		setLoading(true)
		searchUserToInvite()
			.then(res => {
				if (res === null) {
					setFlagResult(FlagResult.NOT_FOUND)
				} else {
					setFlagResult(FlagResult.RESULT)
				}
				setLoading(false)
			})
			.catch(() => {
				setFlagResult(FlagResult.NOT_FOUND)
				setLoading(false)
			})
	}

	function handleSendEmail() {
		if (session && team) {
			setSendingEmail(true)
			sendEmailToInviteUser(emailToSearch, session.displayName, team.teamName, team.teamId)
				.then(() => {
					setSendingEmail(false)
					setEmailSent(true)
				})
				.catch(err => {
					setSendingEmail(false)
					setEmailSent(false)
				})
		}
	}

	function handleSendInvitation() {
		if (team && userToInvite) {
			setSendingInvite(true)
			sendInvitationToUser(userToInvite, team)
				.then(() => {
					setSendingInvite(false)
					handleClose()
					toastMessage({
						title: "Convidar colaborador",
						description: "Convite enviado com sucesso",
						statusToast: ToastStatus.SUCCESS,
						position: "bottom"
					})
				})
				.catch(error => {
					setSendingInvite(false)
					toastMessage({
						title: "Convidar colaborador",
						description: error,
						statusToast: ToastStatus.WARNING,
						position: "bottom"
					})
				})
		} else {
			toastMessage({
				title: "Convidar colaborador",
				description: "Ocorreu um erro desconhecido. Tenta sair e re-entrar em sua conta.",
				statusToast: ToastStatus.ERROR,
				position: "bottom"
			})
		}
	}

	function handleClose() {
		setEmailToSearch("")
		setSendingInvite(false)
		setEmailSent(false)
		setFlagResult(FlagResult.INIT)
		onClose()
	}

	return (
		<ZenTaakModal
			title={"Adicionar colaboradores"}
			subtitle="Insira os detalhes da tarefa."
			isOpen={isOpen}
			position="absolute"
			size="2xl"
			height={height}
			onClose={handleClose}
		>
			<Box>
				<Box>
					<FormLabel>E-mail do colaborador</FormLabel>
					<InputGroup size="md">
						<Input
							type="email"
							height="50px"
							value={emailToSearch}
							border="1px solid #ddd"
							onKeyDown={handleKeyPress}
							onChange={onChangeValue}
							placeholder="Digite o email de utilizador"
							_placeholder={{ fontSize: "13px", color: "#555" }}
						/>
						<InputRightElement width="4.5rem" height="50px">
							<Button
								h="1.75rem"
								size="sm"
								onClick={handleSearch}
								bgColor="#fff"
								_hover={{ background: "transparent", opacity: 0.9 }}
							>
								<ZenTaakIcon
									package="feather"
									name="FiSearch"
									color="#777"
								/>
							</Button>
						</InputRightElement>
					</InputGroup>
				</Box>
				<Flex
					mt="2rem"
					justifyContent={'center'}
				>
					{loading ?
						<Spinner size="lg" />
						: flagResult === FlagResult.NOT_FOUND ?
							<HStack

								justifyContent={'space-between'}
								flex={1}
							>
								<Flex
									alignItems={'center'}
									gap={2}
								>
									<ZenTaakIcon
										package="githubocticonsicons"
										name="GoMail"
										color="#777"
									/>
									<Text>
										{emailToSearch}
									</Text>
								</Flex>

								{
									emailSent ?
										<Text>Convite enviado</Text>
										:
										<ZentaakButton
											variant="info"
											size="sm"
											isLoading={sendingEmail}
											bg={'red.100'}
											onClick={handleSendEmail}
										>
											<Text mr="10px">Convidar</Text>
											<ZenTaakIcon
												package="githubocticonsicons"
												name="GoPaperAirplane"
												color="#fff"
												size={18}
											/>
										</ZentaakButton>
								}
							</HStack>
							:
							flagResult === FlagResult.RESULT && userToInvite ?
								<TeamItem
									user={userToInvite}
									sendingInvite={sendingInvite}
									onInviteSent={handleSendInvitation}
								/>
								: null
					}
				</Flex>
			</Box>
		</ZenTaakModal>
	);
}
