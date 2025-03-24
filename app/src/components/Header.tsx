import { ZenTaakIcon } from "@/react-icons";
import {
	Avatar,
	Box,
	Divider,
	Flex,
	HStack,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { ZentaakButton } from "./Button";
import { useUserSessionStore } from "../hooks/useUserSession";
import { useTeamStore } from "../hooks/useTeam";
import { useEffect, useState } from "react";
import { useInviteUserStore } from "../hooks/useInviteUser";
import { InviteType } from "../types/InviteType";
import WorkspaceSelectorList from "./WorkspaceSelectorList";
import { useWorkspaceStore } from "../hooks/useWorkspace";
import { useNotificationStore } from "../hooks/useNotification";
import { NotificationType, NotifyType } from "../types/NotificationType";
import NotificationPopover from "./NotificationPopover";
import { useTaskStore } from "../hooks/useTask";
import BadgeFree from "./BadgeFree";
import { useSubscriptionStore } from "../hooks/useSubscription";

interface Header {
	onClickToOpenInbox: () => void
	onLogout: () => void
	onChangeTeam: () => void
	onClickToBuyAPlan: () => void
	onClickToRenewPlan: () => void
}	

export function Header(props: Header) {

	const {
		onClickToOpenInbox,
		onLogout,
		onChangeTeam,
		onClickToBuyAPlan,
		onClickToRenewPlan
	} = props

	const [invites, setInvites] = useState<InviteType[]>([])
	const [notications, setNotifications] = useState<NotificationType[]>([])
	const [refresh, setRefresh] = useState<number>(0)

	const setOpenTaskDetailOnClickReadNotification = useTaskStore(state => state.setOpenTaskDetailOnClickReadNotification)
	const setTaskSelected = useTaskStore(state => state.setTaskSelected)
	const fetchTaskData = useTaskStore(state => state.fetchTaskData)

	const setWorkspace = useWorkspaceStore(state => state.setWorkspace)
	const workspace = useWorkspaceStore(state => state.workspace)

	const session = useUserSessionStore(state => state.userSession)

	const team = useTeamStore(state => state.team)

	const getAllUserInvitation = useInviteUserStore(state => state.getAllUserInvitation)

	const getNotifications = useNotificationStore(state => state.getNotifications)
	const readNotification = useNotificationStore(state => state.readNotification)

	const subscription = useSubscriptionStore(state => state.subscription)

	useEffect(() => {
		if (session) {
			const unsubscribe = getAllUserInvitation(session.email, (invite, isRemoving) => {
				setInvites(state => {

					if (isRemoving) {
						const allInvites = state.filter(i => i.id !== invite.id)
						return allInvites
					}
					return [...state, invite]
				})
			})

			return () => {
				unsubscribe()
			}
		}

	}, [])

	useEffect(() => {
		if (session && workspace) {
			const unsubscribeNotification = getNotifications(session.id, workspace.workspaceId, (notification, isRemoving) => {
				setNotifications(state => {
					if (isRemoving) {
						const index = state.findIndex(n => n.notificationId === notification.notificationId)
						state[index].read = true
						setRefresh(state => state + 1)
						return state
					}
					return [...state, notification]
				})
			})

			return () => {
				unsubscribeNotification()
			}
		}
	}, [workspace])

	useEffect(() => { }, [refresh])

	async function handleOnNotificationRead(notification: NotificationType, type: NotifyType) {

		switch (type) {
			case "payment":

				break;

			case "storage":

				break

			default:
				await readNotification(notification.notificationId)
				const task = await fetchTaskData(notification.origin.taskId)
				setOpenTaskDetailOnClickReadNotification(true)
				setTaskSelected(task)
				break;
		}
	}

	return (
		<Box
			px={12}
			height="10vh"
			display="flex"
			background="white"
			alignItems="center"
			justifyContent="space-between"
			borderBottomWidth="1px"
			borderBottomColor="#ddd"
		>
			<HStack
				gap={10}
			>
				<Image
					src="/logo.svg"
					alt="Zen Taak"
					h={10}
				/>
				<WorkspaceSelectorList
					onWorkspaceSelected={setWorkspace}
				/>
			</HStack>
			<Flex alignItems="center" gap={2}>
				{
					subscription?.expiration ?
						subscription.expiration.getRemainSubscriptionDays(true) as number <= 15 &&
							subscription.expiration.getRemainSubscriptionDays(true) as number >= 1 ?
							<BadgeFree
								info={`Seu plano irá terminar em ${subscription.expiration.getRemainSubscriptionDays()}`}
								onClickToRenewPlan={onClickToRenewPlan}
							/>
							:
							subscription.expiration.getRemainSubscriptionDays(true) as number <= 0 ?
								<BadgeFree
									info={"O seu plano expirou. Renove-o agora!"}
									onClickToRenewPlan={onClickToRenewPlan}
								/>
								:
								null
						:
						<BadgeFree
							info="Plano grátis limitado"
							onClickToBuyAPlan={onClickToBuyAPlan}
						/>
				}

				<NotificationPopover
					notifications={notications}
					onNotificationRead={handleOnNotificationRead}
					onButtonRender={() =>
						<Box
							pos={'relative'}
							w={8}
							h={8}
							display={'flex'}
							flexDir={'row'}
							alignItems={'center'}
							cursor={'pointer'}
							justifyContent={'center'}
							className="notification"
						>
							<ZenTaakIcon
								package="githubocticonsicons"
								name="GoBell"
								size={20}
								color="#555"
							/>
							{
								notications.filter(n => n.read !== true).length > 0 ?
									<Box
										boxSize={3}
										bg={'red.100'}
										borderRadius={20}
										position={'absolute'}
										top={0}
										right={0}
									/>
									:
									null
							}
						</Box>
					}
				/>
				<ZentaakButton
					variant="secondary"
					border="0px"
					bg="transparent"
					_hover={{ border: 0, opacity: 0.9 }}
					onClick={onClickToOpenInbox}
				>
					<Box
						pos={'relative'}
						w={8}
						h={8}
						display={'flex'}
						flexDir={'row'}
						alignItems={'center'}
						justifyContent={'center'}
						className="inbox"
					>
						<ZenTaakIcon
							package="githubocticonsicons"
							name="GoInbox"
							size={20}
							color="#555"
						/>
						{
							invites.length > 0 ?
								<Box
									boxSize={3}
									bg={'red.100'}
									borderRadius={20}
									position={'absolute'}
									top={0}
									right={0}
								/>
								:
								null
						}
					</Box>
				</ZentaakButton>

				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton
							aria-label='Options'
							className="profile"
						>
							<Avatar
								name={session?.displayName}
								src={session?.photoUrl as string | undefined}
							/>
						</MenuButton>
						<MenuList>
							<MenuItem
								icon={
									<ZenTaakIcon
										package={"githubocticonsicons"}
										name={"GoArrowSwitch"}
									/>
								}
								onClick={onChangeTeam}
							>
								Trocar de equipa
							</MenuItem>
							<Divider />
							<MenuItem
								icon={
									<ZenTaakIcon
										package={"ionicons5"}
										name={"IoLogOutOutline"}
									/>
								}
								onClick={onLogout}
							>
								Terminar sessão
							</MenuItem>
						</MenuList>
					</Menu>
					<Box ml={3}>
						<Text fontWeight={'bold'}>
							{session?.displayName}
						</Text>
						<Text fontSize={'sm'} lineHeight={1}>
							{team?.teamName}
						</Text>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
}
