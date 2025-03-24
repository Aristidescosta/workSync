import { ZentaakButton } from "@/src/components/Button";
import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { useTaskStore } from "@/src/hooks/useTask";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateTaskForm from "./components/CreateTaskForm";
import CheckListActivity from "./CheckListActivity";
import Attachments from "./Attachments";

import { convertToSimulatedFile } from "@/src/utils/helpers";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { useIntegrationStore } from "@/src/hooks/useIntegration";
import { useUserSessionStore } from "@/src/hooks/useUserSession";

interface CreateTaskPage extends iModalPage {}

export default function CreateTaskPage(props: CreateTaskPage) {
	const {
		isOpen,
		onClose
	} = props

	const [loading, setLoading] = useState<boolean>(false)
	const [fileSizeExceeded, setFileSizeExceeded] = useState<boolean>(false)
	const [sizeSpaceExceeded, setSizeSpaceExceeded] = useState<boolean>(false)
	const [isEditting, setIsEditting] = useState<boolean>(false)
	const [isEdittingActivity, setIsEdittingAtivity] = useState<boolean>(false)

	const workspace = useWorkspaceStore(state => state.workspace)

	const userSession = useUserSessionStore(state => state.userSession)
	
	const taskName = useTaskStore(state => state.taskName);
	const notesTask = useTaskStore(state => state.notesTask);
	const tags = useTaskStore(state => state.tags);
	const attachmentsFile = useTaskStore(state => state.attachmentsFile);
	const taskActivities = useTaskStore(state => state.taskActivities);
	const deadline = useTaskStore(state => state.deadline);
	const startDate = useTaskStore(state => state.startDate);
	const task = useTaskStore(state => state.task)
	const assignedOf = useTaskStore(state => state.assignedOf)
	const createTask = useTaskStore(state => state.createTask);
	const updateTask = useTaskStore(state => state.updateTask);
	const setAssignedOf = useTaskStore(state => state.setAssignedOf);
	const setTaskName = useTaskStore(state => state.setTaskName);
	const setWorkspaceTask = useTaskStore(state => state.setWorkspaceTask);
	const setNotesTask = useTaskStore(state => state.setNotesTask);
	const setDeadline = useTaskStore(state => state.setDeadline);
	const setStartDate = useTaskStore(state => state.setStartDate);
	const setCreatedBy = useTaskStore(state => state.setCreatedBy)
	const setEditedBy = useTaskStore(state => state.setEditedBy)
	const setTaskActivities = useTaskStore(state => state.setTaskActivities);
	const setAttachmentsFile = useTaskStore(state => state.setAttachmentsFile);
	const setTags = useTaskStore(state => state.setTags);
	const resetFormState = useTaskStore(state => state.resetFormState);
	
    const integrationWithGithub = useIntegrationStore(state => state.integrationWithGithub)

	const { toastMessage, ToastStatus } = useToastMessage();

	useEffect(() => {

		if (task) {
			setTaskName(task.taskTitle)
			setStartDate(task.beginDate)
			setDeadline(task.deadline)
			setNotesTask(task.notes)
			setTaskActivities(task.activities)
			setCreatedBy(task.createdBy)
			
			if (userSession && setEditedBy) {
				setEditedBy(userSession)
			}

			if (task.tags) {
				setTags(task.tags)
			}
			if (task.attachments) {
				const simulatedFiles = task.attachments.map(convertToSimulatedFile);
				setAttachmentsFile(simulatedFiles)
			}
			setAssignedOf(task.assignedOf)
			setIsEditting(true)
		} else {
			if (userSession) {
				setCreatedBy(userSession)
			}
		}

	}, [task, isOpen])

	function handleCreateTask() {

		if (task) {

			if (workspace) {
				setWorkspaceTask(workspace)
			}

			setLoading(true)
			updateTask(task.taskId, integrationWithGithub, task.gitHubIssueId)
				.then(() => {
					setLoading(false)
					toastMessage({
						title: "Actualizar tarefa",
						description: "Tarefa actualizada",
						statusToast: ToastStatus.SUCCESS,
						position: "bottom",
					});
					handleClose()
				})
				.catch(error => {
					setLoading(false)
					toastMessage({
						title: "Actualizar tarefa",
						description: error,
						statusToast: ToastStatus.WARNING,
						position: "bottom",
					});
				})
		} else {
			if (workspace) {
				setWorkspaceTask(workspace)
			}

			setLoading(true)
			createTask(integrationWithGithub)
				.then(() => {
					setLoading(false)
					handleClose()
				})
				.catch(error => {
					setLoading(false)
					toastMessage({
						title: "Adicionar tarefa",
						description: error,
						statusToast: ToastStatus.WARNING,
						position: "bottom",
					});
				})
		}
	}

	function handleClose() {
		resetFormState()
		onClose()
		setIsEditting(false)
	}

	function edittingActivity(isEditting: boolean) {
		setIsEdittingAtivity(isEditting)		
	}

	return (
		<ZenTaakModal
			title={task ? "Actualizar tarefa" : "Adicionar tarefa"}
			subtitle="Edite os detalhes da tarefa."
			isOpen={isOpen}
			position="relative"
			size="5xl"
			onClose={handleClose}
		>
			<CreateTaskForm
				taskName={taskName}
				description={notesTask}
				existingTags={tags}
				startDate={startDate}
				deadline={deadline}
				assignedOf={assignedOf}
				onChangeTaskName={setTaskName}
				onChangeTaskDescription={setNotesTask}
				onChangeTaskStartDate={setStartDate}
				onChangeTaskDeadline={setDeadline}
				onChangeAssignedOf={setAssignedOf}
				selectedTags={setTags}
				isEditting={isEditting}
			/>
			<CheckListActivity
				onActivitiesAdded={setTaskActivities}
				existingActivities={taskActivities}
				setEditting={edittingActivity}
			/>
			<Attachments
				onAttachments={setAttachmentsFile}
				onFileSizeExceeded={setFileSizeExceeded}
				onSizeSpaceExceeded={setSizeSpaceExceeded}
				ExistingsAttachments={attachmentsFile}
			/>
			<HStack
				mt="20px"
				justifyContent="flex-end"
				width={'100%'}
			>
				<ZentaakButton
					variant="secondary"
					width="20%"
					borderColor={'red.100'}
					color={'red.100'}
					height="50px"
					mr="20px"
					onClick={handleClose}
				>
					Fechar
				</ZentaakButton>

				<ZentaakButton
					bg={'red.100'}
					variant="info"
					width="20%"
					height="50px"
					isLoading={loading}
					isDisabled={isEdittingActivity || fileSizeExceeded || sizeSpaceExceeded}
					loadingText={task ? "A actualizar" : "A criar tarefa"}
					onClick={handleCreateTask}
				>
					{task ? "Actualizar" : "Criar tarefa"}
				</ZentaakButton>
			</HStack>
		</ZenTaakModal>
	);
}
