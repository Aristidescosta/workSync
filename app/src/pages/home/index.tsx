import { ZenTaakIcon } from "@/react-icons";
import { Header } from "@components/Header";
import { tabLinks } from "@utils/TabLinks";
import { Tabs, TabList, Tab, TabPanels, TabPanel, Text, useDisclosure, Box, Button, Heading, Modal, ModalBody, ModalContent, ModalOverlay, VStack, HStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import TaskPage from "@/src/pages/Task/TaskPage";
import TeamPage from "@/src/pages/Team/TeamPage";
import Dashboard from "@/src/pages/Charts/index";
import { useAppStore } from "@/src/hooks/useAppStore";
import { Link, useNavigate } from "react-router-dom";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import InboxPage from "../Inbox";
import { useTeamStore } from "@/src/hooks/useTeam";
import { WorkspacePage } from "../Workspace";
import { StoragePage } from "../FileManager";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import SettingsPage from "../Settings";
import { useIntegrationStore } from "@/src/hooks/useIntegration";
import PackagePlanPage from "../Package/PackagePlanPage";
import PaymentSummary from "../PaymentSummary";
import { PlanType } from "@/src/types/PlanType";
import TaskOverview from "../Task/components/TaskOverview";
import { useReactTour } from "@/Reactour-tour";
import { useTourStore } from "@/src/hooks/useTourStore";


export default function HomePage() {

	const { isOpen: isOpenInbox, onOpen: onOpenInbox, onClose: onCloseInbox } = useDisclosure()
	const { isOpen: isPackagePageOpen, onOpen: onPackagePageOpen, onClose: onPackagePageClose } = useDisclosure();
	const { isOpen: isResumePaymentOpen, onOpen: onResumePaymentOpen, onClose: onResumePaymentClose } = useDisclosure();

	const [selectedPlan, setSelectedPlan] = useState<PlanType>()
	const [typeOfPayment, setTypeOfPayment] = useState<string>('anual')
	const [selectedMethod, setSelectedMethod] = useState('1')

	const session = useUserSessionStore(state => state.userSession)
	const user = useUserSessionStore(state => state.user)
	const logout = useUserSessionStore(state => state.logout)

	const workspace = useWorkspaceStore(state => state.workspace)
	const setWorkspace = useWorkspaceStore(state => state.setWorkspace)

	const team = useTeamStore(state => state.team)
	const selectCurrentTeam = useTeamStore(state => state.selectCurrentTeam)
	const setIntegrationWithGithub = useIntegrationStore(state => state.setIntegrationWithGithub)
	const getAllMembers = useTeamStore(state => state.getAllMembers)
	const membersOfTeamClean = useTeamStore(state => state.membersOfTeamClean)

	const selectedTab = useAppStore(state => state.selectedTab)
	const setSelectedTab = useAppStore(state => state.setSelectedTab)

	const isTourOpened = useTourStore(state => state.isTourOpened)
	const tourOnTask = useTourStore(state => state.tourOnTask)
	const setToOpenTour = useTourStore(state => state.setToOpenTour)
	const setTourSectionDone = useTourStore(state => state.setTourSectionDone)

	const { setIsOpen } = useReactTour()

	const navigate = useNavigate();

	useEffect(() => {
		setToOpenTour(true)
	}, [])

	useEffect(() => {
		if (isTourOpened) {
			if (!tourOnTask) {
				setIsOpen(isTourOpened)
				setTourSectionDone("task")
			}
		}
	}, [isTourOpened])

	useEffect(() => {
		if (session) {
			if (team?.teamId) {
				const unsubscribe = getAllMembers()
				return () => unsubscribe()
			}
		}
	}, [session, team])

	useEffect(() => {
		if (team) {
			console.log("TEAM", team, workspace)
			if (workspace) {
				navigate(`/home/${team.teamId}/${encodeURI(workspace.workspaceName)}/${encodeURI(tabLinks[selectedTab].route.toLowerCase())}`)
			} else {
				navigate(`/home/${team.teamId}`)
			}
		} else {
			navigate("/home")
		}
	}, [workspace, selectedTab])

	/* useEffect(() => {
		if (team) {
			if (team.owner.session.id !== user?.session.id) {
				const isOnTeam = membersOfTeamClean.filter(u => u.session.id === user?.session.id).length === 1
				if (!isOnTeam) {
					onChangeTeam()
				}
			}
		}
	}, [user]) */

	function handleChangeTabs(tab: number) {
		if (team && workspace) {
			setSelectedTab(tab);
			navigate(`/home/${team.teamId}/${encodeURI(workspace.workspaceName)}/${encodeURIComponent(tabLinks[tab].route.toLowerCase())}`)
		}
	}

	function onChangeTeam() {
		selectCurrentTeam(undefined)
		setIntegrationWithGithub(undefined)
		setWorkspace(undefined)
		navigate("/home")
	}

	function onPlanSelected(plan: PlanType) {
		setSelectedPlan(plan)
		onResumePaymentOpen()
	}

	async function handleLogout() {
		await logout()
		//window.location.href = "https://zentaak.com/"
	}

	function handlePaymentComplete() {
		onPackagePageClose()
		onResumePaymentClose()
	}

	return (
		<Box>
			<HStack
				alignItems={'flex-start'}
			>
				<Box
					w={'full'}
				>
					<Header
						onClickToOpenInbox={onOpenInbox}
						onChangeTeam={onChangeTeam}
						onLogout={handleLogout}
						onClickToBuyAPlan={onPackagePageOpen}
						onClickToRenewPlan={onPackagePageOpen}
					/>

					<InboxPage
						isOpen={isOpenInbox}
						onClose={onCloseInbox}
					/>

					<Tabs
						index={selectedTab}
						onChange={handleChangeTabs}
					>
						<TabList
							bg="white"
							px={10}
							h={'7vh'}
							borderBottomWidth="1px"
							borderBottomColor="#ddd"
						>
							{tabLinks.map((link, index) => (
								<Tab
									_selected={{
										color: "red.200",
										borderColor: "red.200",
										fontWeight: "bold",
									}}
									fontSize="15px"
									key={index}
									className={link.route}
								>
									<ZenTaakIcon
										package="githubocticonsicons"
										name={link.icon}
										size={16}
										color={selectedTab === index ? "red.200" : "gray.500"}
									/>
									<Text marginLeft="8px">{link.label}</Text>
									<Link to={`/${encodeURIComponent(link.route.toLowerCase())}`} />
								</Tab>
							))}
						</TabList>

						<TabPanels>
							<TabPanel padding="0">
								{useMemo(() => <TaskPage />, [])}
							</TabPanel>

							<TabPanel padding="0">
								{useMemo(() => <TeamPage />, [])}
							</TabPanel>

							<TabPanel padding="0">
								{useMemo(() => <WorkspacePage />, [])}
							</TabPanel>

							<TabPanel padding="0">
								{useMemo(() => <Dashboard />, [])}
							</TabPanel>

							<TabPanel padding="0">
								{useMemo(() => <StoragePage />, [])}
							</TabPanel>

							<TabPanel padding="0">
								{useMemo(() => <SettingsPage />, [])}
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
				<TaskOverview

				/>
			</HStack>
			<Modal
				isOpen={isPackagePageOpen}
				onClose={onPackagePageClose}
				size={'full'}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalBody
						bg={"#F1F1F1"}
						display={'flex'}
						flexDir={'column'}
						justifyContent={'center'}
						alignItems={'center'}
					>
						<Box>
							<Heading size={'lg'}>Actualizar o plano</Heading>
							<Text>
								Escolha o plano para subscrever que mais se aplica às suas <br /> necessidades.
							</Text>
							<VStack
								borderWidth={0.5}
								boxSize={'lg'}
								mt={4}
								px={8}
								pt={24}
								pb={20}
								justifyContent={'center'}
								bg={'#fff'}
							>
								<PackagePlanPage
									planType='subscription'
									noHeader
									onPlanSelected={onPlanSelected}
								/>
							</VStack>
						</Box>
						<Button
							variant={'link'}
							my={4}
							onClick={onPackagePageClose}
						>
							Cancelar
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
			{
				selectedPlan &&
				<PaymentSummary
					planType='subscription'
					isOpenResumePayment={isResumePaymentOpen}
					selectedPlan={selectedPlan}
					expandingStorage={false}
					typeOfPayment={typeOfPayment}
					selectedMethod={selectedMethod}
					handlePaymentComplete={handlePaymentComplete}
					setTypeOfPayment={setTypeOfPayment}
					setSelectedMethod={setSelectedMethod}
					onCloseResumePayment={onResumePaymentClose}
				/>
			}
		</Box>
	);
}
