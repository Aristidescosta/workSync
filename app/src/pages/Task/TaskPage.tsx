import { Box, HStack, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ZenTaakIcon } from "@/react-icons";
import { ToqueButton } from "@/src/components/Button";
import { useTaskStore } from "@/src/hooks/useTask";
import { useAppStore } from "@/src/hooks/useAppStore";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import CreateTaskPage from "./CreateTaskPage";
import DetailTaskPage from "../DetailTask/DetailTaskPage";
import { StateTask, TaskType } from "@/src/types/TaskType";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import ListCardableTask from "./components/ListCardableTask";
import RowCardableTask from "./components/RowCardableTask";
import { TagType } from "@/src/types/TagType";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/src/types/UserType";
import CloseTaskModal from "./components/CloseTaskModal";
import { useStorage } from "@/src/hooks/useStorage";
import TaskOverview from "./components/TaskOverview";

export default function TaskPage() {
	const { isOpen, onClose, onOpen } = useDisclosure()
	const { isOpen: isOpenTaskDetail, onClose: onCloseTaskDetail, onOpen: onOpenTaskDetail } = useDisclosure()
	const { isOpen: isOpenCloseTaskModal, onClose: closeTaskModal, onOpen: onOpenCloseTaskModal } = useDisclosure()

	const session = useUserSessionStore(state => state.userSession)

	const workspace = useWorkspaceStore(state => state.workspace)

	const team = useTeamStore(state => state.team)

	const observingSpaces = useStorage(state => state.observingSpaces)

	const tasks = useTaskStore(state => state.tasks)
	const forceRefreshListTasks = useTaskStore(state => state.forceRefreshListTasks)
	const setOpenTaskDetailOnClickReadNotification = useTaskStore(state => state.setOpenTaskDetailOnClickReadNotification)
	const taskDetailOpen = useTaskStore(state => state.taskDetailOpen)
	const setTaskSelected = useTaskStore(state => state.setTaskSelected)
	const observingTasks = useTaskStore(state => state.observingTasks)

	const onAuthOpen = useAppStore(state => state.onModalOpen)

	const { toastMessage, ToastStatus } = useToastMessage()
	const [tags, setTags] = useState<TagType[]>([])
	const [state, setState] = useState<StateTask>("Não iniciada")
	const [member, setMember] = useState<UserType>()

	const navigate = useNavigate()

	useEffect(() => {
		if (workspace) {
			const unsubscribe = observingTasks(workspace.workspaceId)
			return () => {
				unsubscribe()
			}
		}
	}, [workspace])

	useEffect(() => {

		if (session) {
			const unsubscribe = observingSpaces(session.id)
			return () => {
				unsubscribe()
			}
		}
	}, [session])

	useEffect(() => {

		if ((isOpen || isOpenTaskDetail) === false) {
			navigate(`/home/${team?.teamId}/${workspace?.workspaceName}/tasks`)
			//navigate(-1)
		}

	}, [isOpenTaskDetail, isOpen])

	//useEffect(() => { }, [forceRefreshListTasks])

	useEffect(() => {

		if (taskDetailOpen) {
			onOpenTaskDetail()
		}

	}, [taskDetailOpen])

	function openNewTask(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		if (session) {
			if (!session.isEmailVerified) {
				toastMessage({
					title: "Email não verificado.",
					description: "Para criar tarefa precisa verificar a sua conta.",
					statusToast: ToastStatus.WARNING,
					position: "bottom"
				})
			} else if (workspace === undefined) {
				toastMessage({
					title: "Projecto não seleccionado.",
					description: "Você precisa antes selecionar o projecto para criar as tarefas.",
					statusToast: ToastStatus.INFO,
					position: "bottom"
				})
			} else {
				onOpen()
			}
		} else {
			onAuthOpen()
		}
	}

	function handleTaskSelected(task: TaskType, option: number) {
		setTaskSelected(task)

		switch (option) {
			case 0:
				navigate(`/home/${team?.teamId}/${workspace?.workspaceName}/tasks/${task.taskId}`)
				onOpenTaskDetail()
				break;
			case 1:
				navigate(`/home/${team?.teamId}/${workspace?.workspaceName}/tasks/${task.taskId}`)
				onOpen()
				break;

			default:
				onOpenCloseTaskModal()
				break;
		}
	}

	function onTagSelected(tag?: TagType) {
		setTags(state => {

			if (tag && state.some(t => t.tag === tag.tag)) {
				return state.filter(t => t.tag !== tag.tag)
			}

			return tag ? [...state, tag] : state
		})
	}

	function onStateSelected(state: StateTask) {
		setState(state)
	}

	function onMemberSelected(member?: UserType) {
		setMember(member)
	}

	function clearTagFilter() {
		onTagSelected(undefined)
		setTags([])
	}

	function clearMemberFilter() {
		onMemberSelected(undefined)
		setMember(undefined)
	}

	const filtered = useCallback((task: TaskType) => {
		if (tags.length > 0) {
			return task.state === state && task.tags.some(t => tags.some(tag => tag.tag === t.tag));
		}
		if (member) {
			return task.state === state && task.assignedOf.filter(t => t.id === member.session.id).length === 1;
		}

		return task.state === state;

	}, [tags, state, member])

	function handleCloseTaskDetail() {
		setOpenTaskDetailOnClickReadNotification(false)
		onCloseTaskDetail()
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
					Tarefas
				</Heading>
				{
					team?.owner.session.id === session?.id ?
						<ToqueButton
							variant="info"
							borderRadius="5px"
							py="1.5rem"
							width="15rem"
							bg={'red.100'}
							onClick={openNewTask}
							loadingText="A criar tarefa"
							isLoading={false}
							id="buttonCreateTask"
						>
							<ZenTaakIcon
								package="feather"
								name="FiPlusSquare"
								color="#fff"
								size={16}
							/>
							<Text ml="3">Adicionar Tarefa</Text>
						</ToqueButton>
						:
						null
				}
			</Box>
			{useMemo(() => <ListCardableTask
				tasks={tasks.sort((a, b) => (b.createdAt?.getTime() as number) - (a.createdAt?.getTime() as number)).filter(filtered).filter(t => t.workspace.workspaceId === workspace?.workspaceId)}
				onRender={(task) => (
					<RowCardableTask
						key={task.taskId}
						task={task}
						onEditTask={handleTaskSelected}
						onCloseTask={handleTaskSelected}
						onTaskSelected={handleTaskSelected}
					/>
				)}
				onTagSelected={onTagSelected}
				onStateSelected={onStateSelected}
				onMemberSelected={onMemberSelected}
				state={state}
				tags={tags}
				member={member}
				clearTagFilter={clearTagFilter}
				clearMemberFilter={clearMemberFilter}

			/>, [tasks.length, forceRefreshListTasks, state, tags, member])}

			<CreateTaskPage
				isOpen={isOpen}
				onClose={onClose}
			/>
			<DetailTaskPage
				isOpen={isOpenTaskDetail}
				onClose={handleCloseTaskDetail}
			/>
			<CloseTaskModal
				isOpen={isOpenCloseTaskModal}
				onClose={closeTaskModal}
			/>
		</Box>
	);
}
