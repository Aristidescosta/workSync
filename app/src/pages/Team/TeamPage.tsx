import { ZenTaakIcon } from "@/react-icons";
import { ZentaakButton } from "@components/Button";
import { Heading, Spinner, Box, Text, useDisclosure } from "@chakra-ui/react";
import AddUserToTeamPage from "./AddUserToTeamPage";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useAppStore } from "@/src/hooks/useAppStore";
import { useTeamStore } from "@/src/hooks/useTeam";
import { UserType } from "@/src/types/UserType";
import { useState, useEffect } from "react";
import ListCardableUsersTeam from "./components/ListCardableUsersTeam";
import RowCardableUserTeam from "./components/RowCardableUserTeam";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { ZenTaakPlanType } from "@/src/types/PlanType";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";

export default function TeamPage() {

	const { isOpen: isOpenAddTeam, onClose: onCloseAddTeam, onOpen: onOpenAddTeam } = useDisclosure()
	const [members, setMembers] = useState<UserType[]>([])

	const session = useUserSessionStore(state => state.userSession)
	const user = useUserSessionStore(state => state.user)

	const onAuthOpen = useAppStore(state => state.onModalOpen)

	const subscription = useSubscriptionStore(state => state.subscription)

	const membersOfTeam = useTeamStore(state => state.membersOfTeam)
	const team = useTeamStore(state => state.team)
	const removeUserMember = useTeamStore(state => state.removeUserMember)

	const { ToastStatus, toastMessage } = useToastMessage()

	const conditionalForTeams = {
		get usersInTeam(): number {
            if ((subscription?.package as ZenTaakPlanType)?.feature.usersInTeam === 0) {
                return 100000000000000000000000000000000000
            }

            return (subscription?.package as ZenTaakPlanType)?.feature.usersInTeam
        }
	}

	useEffect(() => {

		if (user && team) {
			const members: UserType[] = []

			for (const user of membersOfTeam) {
				let dataUser: UserType = {
					session: user.value,
					teams: [],
					memberOfTeams: [],
					createdAt: new Date()
				}
				if (team.owner.session.id === user.value.id) {
					dataUser.role = "Proprietário"
					//user.value.role = "Proprietário"
					//members.push(user.value)
					members.push(dataUser)
				} else {
					dataUser!.role = "Colaborador"
					//user.value.role = "Colaborador"	
					//members.push(user.value)
					members.push(dataUser)
				}
			}
			setMembers(members)
		}

	}, [membersOfTeam])

	function openNewTeam() {
		if (session) {
			const plan = subscription?.package as ZenTaakPlanType

			/* if (plan?.feature.usersInTeam === 0 || plan?.feature.usersInTeam >= membersOfTeam.length) {
				onOpenAddTeam()
			} else if (plan?.feature.usersInTeam <= membersOfTeam.length) {
				toastMessage({
					title: "Convidar colaborador",
					description: "O seu plano actual não lhe permite ter mais de 5 utilizadores numa mesma equipa. Considere fazer actualização para um plano melhor.",
					duration: 5000,
					statusToast: ToastStatus.INFO,
					position: "bottom"
				})
			} */
			onOpenAddTeam()
		} else {
			onAuthOpen()
		}
	}

	async function handleUserDelete(user: UserType) {
		try {
			setMembers(state => state.filter(u => u.session.id !== user.session.id))
			return await removeUserMember(user.session.id)
		} catch (error) {
			toastMessage({
				title: "Membros da equipa.",
				description: error as string,
				statusToast: ToastStatus.INFO,
				position: "bottom"
			})
		}
	}

	return (
		<Box>
			<Box
				bg="white"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				px={10}
                h={'7vh'}
			>
				<Heading as="h1" fontSize="22px">
					Equipa
				</Heading>

				{
					session?.id === team?.owner.session.id ?
						<ZentaakButton
							variant="info"
							borderRadius="5px"
							py="1.5rem"
							width="15rem"
							bg={'red.100'}
							onClick={openNewTeam}
						>
							<ZenTaakIcon
								package="feather"
								name="FiPlusSquare"
								color="#fff"
								size={16}
							/>
							<Text ml="3">Adicionar Equipa</Text>
						</ZentaakButton>
						:
						null
				}
			</Box>
			{
				members.length === 0 ?
					<Box
						justifyContent="center"
						alignItems="center"
						display="flex"
						height="50vh"
					>
						<Heading>Nenhum colaborador na tua equipa</Heading>
					</Box>
					:
					<ListCardableUsersTeam
						users={members.reverse().slice(0, conditionalForTeams.usersInTeam)}
						onRender={(user, index) => (
							<RowCardableUserTeam
								key={index}
								user={user}
								role={user.role}
								team={team}
								onDeleteUser={handleUserDelete}
							/>
						)}
					/>
			}
			<AddUserToTeamPage
				isOpen={isOpenAddTeam}
				onClose={onCloseAddTeam}
			/>
		</Box>
	);
}
