import { create } from "zustand";
import { StateTask, TaskType } from "@/src/types/TaskType";
import { TaskService } from "@/src/services/firebase/firestore/TaskService";
import { TagType } from "../types/TagType";
import generateId from "../services/UUID";
import { ActivityType } from "../types/ActivityType";
import StorageTaskService from "../services/firebase/storage/StorageTaskService";
import { AttachmentFileType } from "../types/AttachmentFileType";
import { WorkspaceType } from "../types/WorkspaceType";
import { AttachmentService } from "../services/firebase/firestore/AttachmentService";
import { DocumentChangeType, Unsubscribe } from "firebase/firestore";
import { TaskLogType } from "../types/TaskLogType";
import GithubService from "../services/github/GitHubService";
import { GitHubIntegrationType } from "../types/IntegrationType";
import { UserSessionType } from "../types/UserSessionType";
import LogsActivityService from "../services/firebase/firestore/LogsActivityService";
import FunctionNotificationService from "../services/firebase/functions/FunctionNotificationService";

const initialStateForm: FormState = {
	taskName: "",
	notesTask: "",
	startDate: new Date(),
	deadline: new Date(),
	assignedOf: [],
	tags: [],
	attachmentsFile: [],
	taskActivities: [],
	progressTask: 0,
	stateTask: "Não iniciada",
}

const initialState: State = {
	task: null,
	tasks: [],
	workspaceTask: null,
	isTaskOpen: true,
	forceRefreshListTasks: 0,
	taskDetailOpen: false,
	logs: [],
	createdBy: null,
	editedBy: undefined,
	...initialStateForm
}

interface State {
	taskName: string
	notesTask: string
	startDate: Date
	workspaceTask: WorkspaceType | null
	deadline: Date
	assignedOf: UserSessionType[]
	taskActivities: ActivityType[]
	tags: TagType[]
	attachmentsFile?: File[]
	task: TaskType | null
	tasks: TaskType[]
	progressTask: number
	stateTask: StateTask
	isTaskOpen: boolean
	taskDetailOpen: boolean
	forceRefreshListTasks: number
	logs: TaskLogType[]
	createdBy: UserSessionType | null
	editedBy?: UserSessionType
}

interface FormState {
	taskName: string
	notesTask: string
	startDate: Date
	deadline: Date
	assignedOf: UserSessionType[]
	taskActivities: ActivityType[]
	tags: TagType[]
	attachmentsFile?: File[]
	progressTask: number
	stateTask: StateTask
}

interface Actions {
	setOpenTaskDetailOnClickReadNotification: (taskDetailOpen: boolean) => void
	setStateTask: (state: StateTask) => void
	setProgressTask: (progress: number) => void
	setTaskName: (arg: string) => void
	setWorkspaceTask: (workspaceTask: WorkspaceType) => void
	setNotesTask: (notesTask: string) => void
	setAssignedOf: (assignedOf: UserSessionType[]) => void
	setCreatedBy: (user: UserSessionType | null) => void
	setEditedBy?: (user?: UserSessionType) => void
	setStartDate: (startDate: Date) => void
	setDeadline: (deadline: Date) => void
	setTags: (tags: TagType[]) => void
	setTaskSelected: (task: TaskType | null) => void
	setTaskActivities: (taskActivities: ActivityType[]) => void
	setAttachmentsFile: (attachmentsFile: File[]) => void
	setIsTaskOpen: (isTaskOpen: boolean) => void
	createTask: (gitHubIntegration?: GitHubIntegrationType) => Promise<void>
	observingTasks: (teamId: string) => Unsubscribe
	fetchTaskData: (taskId: string) => Promise<TaskType>
	resetLogs: () => void
	assignUserToTask: (task: TaskType, session: UserSessionType, user: UserSessionType[], isRemoving: boolean) => Promise<void>
	updateStateActivityProgressTask: (session: UserSessionType, activity?: ActivityType, progress?: number, state?: StateTask, report?: string, dueDays?: number) => Promise<void>
	updateTask: (taskId: string, gitHubIntegration?: GitHubIntegrationType, gitHubIssueId?: number) => Promise<void>
	saveLogs: (log: TaskLogType) => Promise<void>
	observingCommentOnTask: (taskId: string, callback: (numberOfComments: number) => void) => Unsubscribe
	observingLogsOnTask: (taskId: string) => Unsubscribe
	closeTask: (task: TaskType, isOpen: boolean, gitHubIntegration?: GitHubIntegrationType, gitHubIssueId?: number) => Promise<void>
	aproveOrRejectTask: (isAproved: boolean) => Promise<void>
	resetFormState: () => void
	clearTasks: () => void
}

export const useTaskStore = create<Actions & State>((set, get) => ({
	...initialState,
	resetFormState: () => set({ ...initialStateForm, task: undefined }),
	clearTasks: () => set({ tasks: [] }),
	observingLogsOnTask: (taskId: string): Unsubscribe => {
		return TaskService.shared.observingLogsOnTask(taskId, (log) => {
			set((state) => ({
				logs: [...state.logs, log]
			}))
		})
	},
	saveLogs: async (log: TaskLogType): Promise<void> => {
		const { task } = get()

		if (task) {
			return await TaskService.shared.saveLogs(task?.taskId, log)
		}
	},
	setOpenTaskDetailOnClickReadNotification: (taskDetailOpen: boolean) => set({ taskDetailOpen }),
	setStateTask: (stateTask: StateTask) => set({ stateTask }),
	setProgressTask: (progressTask: number) => set({ progressTask }),
	resetLogs: () => set({ logs: [] }),
	setTaskSelected: (task: TaskType | null) => set({ task }),
	setTaskName: (taskName: string) => set({ taskName }),
	setWorkspaceTask: (workspaceTask: WorkspaceType | null) => set({ workspaceTask }),
	setNotesTask: (notesTask: string) => set({ notesTask }),
	setAssignedOf: (assignedOf: UserSessionType[]) => set({ assignedOf: [...assignedOf.map(u => u)] }),
	setCreatedBy: (createdBy: UserSessionType | null) => set({ createdBy }),
	setEditedBy: (editedBy?: UserSessionType) => set({ editedBy }),
	setStartDate: (startDate: Date) => set({ startDate }),
	setDeadline: (deadline: Date) => set({ deadline }),
	setTags: (tags: TagType[]) => set({ tags }),
	setTaskActivities: (taskActivities: ActivityType[]) => set({ taskActivities }),
	setAttachmentsFile: (attachmentsFile: File[]) => set({ attachmentsFile }),
	setIsTaskOpen: (isTaskOpen: boolean) => set({ isTaskOpen }),
	createTask: (gitHubIntegration?: GitHubIntegrationType): Promise<void> => {
		return new Promise((resolve, reject) => {
			const { taskName, tags, notesTask, deadline, startDate, assignedOf, workspaceTask, taskActivities, attachmentsFile, isTaskOpen, createdBy } = get()
			let newTask: TaskType
			let iteration = 0, timeout: NodeJS.Timeout
			const attachments: AttachmentFileType[] = []

			if (taskName === "") {
				reject("Informa o nome da tarefa")
			} else if (workspaceTask === null) {
				reject("Você precisa estar associado ou ser responsável por uma equipa")
			} else if (tags.length === 0) {
				reject("Adicione pelo menos 1 (uma) etiqueta")
			} else if (createdBy === null) {
				reject("Você parece não está logado na tua conta. Experimente actualizar a página.")
			} else {
				const taskId = generateId()

				if (attachmentsFile === undefined) {
					newTask = {
						taskId,
						assignedOf,
						beginDate: startDate,
						deadline,
						createdBy,
						deadlineString: deadline.toStringDate(),
						tags,
						workspace: workspaceTask,
						taskTitle: taskName.trim(),
						notes: notesTask.trim(),
						state: "Não iniciada",
						progress: 0,
						createdAt: new Date(),
						activities: taskActivities,
						attachments,
						isOpen: isTaskOpen
					}

					handleSavingLogs(assignedOf, workspaceTask, tags, taskId, taskName.trim())

					TaskService.shared.createTask(newTask)
						.then(() => {
							if (gitHubIntegration) {
								new GithubService(gitHubIntegration.token).createIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, newTask.taskTitle, newTask.notes, newTask.tags)
									.then((gitHubIssueId) => {
										const taskToUpdate = {
											...newTask,
											gitHubIssueId
										}
										TaskService.shared.updateTask(taskToUpdate)
											.then(() => {
												resolve()
											})
											.catch(err => {
												reject(err)
											})
									})
									.catch(() => (console.log('NAOAQUI')))
							} else {
								resolve()
							}
						})
						.catch(reject)
				} else {
					const runner = () => {

						if (iteration < attachmentsFile!.length) {

							StorageTaskService.shared.uploadTaskFilesAttachment(workspaceTask.team.owner.session.email, workspaceTask.workspaceId, attachmentsFile![iteration])
								.then(url => {
									attachments.push({
										attachId: generateId(),
										fileName: attachmentsFile![iteration].name,
										fileUrl: url,
										createdAt: new Date(),
										taskId,
										accountId: workspaceTask.team.owner.session.id,
										size: attachmentsFile![iteration].size,
										wasDeleted: false,
										type: attachmentsFile![iteration].type
									})

									AttachmentService.shared.addAttachmentDocumentsOfTask(attachments[iteration])
										.then(() => {
											iteration += 1
											timeout = setTimeout(runner, 500);
										})
										.catch(reject)
								})
								.catch(err => {
									clearTimeout(timeout)
								})
						} else {
							clearTimeout(timeout)

							newTask = {
								taskId,
								assignedOf,
								beginDate: startDate,
								deadline,
								createdBy,
								deadlineString: deadline.toStringDate(),
								tags,
								workspace: workspaceTask,
								taskTitle: taskName.trim(),
								notes: notesTask.trim(),
								state: "Não iniciada",
								progress: 0,
								createdAt: new Date(),
								activities: taskActivities,
								attachments,
								isOpen: isTaskOpen
							}

							handleSavingLogs(assignedOf, workspaceTask, tags, taskId, taskName.trim())

							TaskService.shared.createTask(newTask)
								.then(() => {
									if (gitHubIntegration) {
										new GithubService(gitHubIntegration.token).createIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, newTask.taskTitle, newTask.notes, newTask.tags)
											.then((gitHubIssueId) => {
												const taskToUpdate = {
													...newTask,
													gitHubIssueId
												}
												TaskService.shared.updateTask(taskToUpdate)
													.then(() => {
														resolve()
													})
													.catch(err => {
														reject(err)
													})
											})
											.catch()
									} else {
										resolve()
									}
								})
								.catch(reject)
						}
					}
					runner()
				}
			}
		})
	},
	updateTask: (taskId: string, gitHubIntegration?: GitHubIntegrationType, gitHubIssueId?: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			const { taskName, tags, notesTask, deadline, startDate, assignedOf, workspaceTask, taskActivities, attachmentsFile, isTaskOpen, createdBy, editedBy } = get()
			let taskToUpdate: TaskType
			let iteration = 0, timeout: NodeJS.Timeout
			const attachments: AttachmentFileType[] = []

			if (taskName === "") {
				reject("Informa o nome da tarefa")
			} else if (workspaceTask === null) {
				reject("Você precisa estar associado ou ser responsável por uma equipa")
			} else if (tags.length === 0) {
				reject("Adicione pelo menos 1 (uma) etiqueta")
			} else if (editedBy === null) {
				reject("Você parece não está logado na tua conta. Experimente actualizar a página.")
			} else {
				if (attachmentsFile) {

					const runner = () => {
						if (iteration < attachmentsFile.length) {
							StorageTaskService.shared.uploadTaskFilesAttachment(workspaceTask.team.owner.session.email, workspaceTask.workspaceId, attachmentsFile[iteration])
								.then(url => {
									attachments.push({
										attachId: generateId(),
										fileName: attachmentsFile[iteration].name,
										fileUrl: url,
										createdAt: new Date(),
										taskId,
										accountId: workspaceTask.team.owner.session.id,
										size: attachmentsFile[iteration].size,
										wasDeleted: false,
										type: attachmentsFile[iteration].type
									})
									iteration += 1
									timeout = setTimeout(runner, 500);
								})
								.catch(err => {
									clearTimeout(timeout)
								})
						} else {
							clearTimeout(timeout)
							taskToUpdate = {
								taskId,
								assignedOf,
								beginDate: startDate,
								createdBy: createdBy!,
								editedBy,
								deadline,
								deadlineString: deadline.toStringDate(),
								tags,
								workspace: workspaceTask,
								taskTitle: taskName.trim(),
								notes: notesTask.trim(),
								state: "Não iniciada",
								progress: 0,
								updatedAt: new Date(),
								activities: taskActivities,
								attachments,
								isOpen: isTaskOpen
							}

							TaskService.shared.updateTask(taskToUpdate)
								.then(() => {
									if (gitHubIssueId && gitHubIntegration) {
										new GithubService(gitHubIntegration.token).updateIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, gitHubIssueId, taskToUpdate.taskTitle, taskToUpdate.notes, taskToUpdate.tags)
										resolve()
									} else {
										resolve()
									}
								})
								.catch(err => {
									reject(err)
								})
						}
					}
					runner()
				} else {
					taskToUpdate = {
						taskId,
						assignedOf,
						beginDate: startDate,
						deadline,
						deadlineString: deadline.toStringDate(),
						createdBy: createdBy!,
						editedBy,
						tags,
						workspace: workspaceTask,
						taskTitle: taskName.trim(),
						notes: notesTask.trim(),
						state: "Não iniciada",
						progress: 0,
						updatedAt: new Date(),
						activities: taskActivities,
						attachments,
						isOpen: isTaskOpen
					}

					TaskService.shared.updateTask(taskToUpdate)
						.then(() => {
							if (gitHubIssueId && gitHubIntegration) {
								new GithubService(gitHubIntegration.token).updateIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, gitHubIssueId, taskToUpdate.taskTitle, taskToUpdate.notes, taskToUpdate.tags)
								resolve()
							} else {
								resolve()
							}
						})
						.catch(err => {
							reject(err)
						})
				}
			}
		})

	},
	closeTask: (task: TaskType, isOpen: boolean, gitHubIntegration?: GitHubIntegrationType, gitHubIssueId?: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			TaskService.shared.closeTask(task, isOpen)
				.then(() => {
					if (gitHubIssueId && gitHubIntegration) {
						if (!isOpen) {
							new GithubService(gitHubIntegration.token).closeIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, gitHubIssueId)
							resolve()
						} else {
							new GithubService(gitHubIntegration.token).reOpenIssueGitHubIntegration(gitHubIntegration.userName, gitHubIntegration.repoName, gitHubIssueId)
							resolve()
						}
					} else {
						resolve()
					}
				})
				.catch(reject)
		})
	},
	assignUserToTask: (task: TaskType, session: UserSessionType, user: UserSessionType[], isRemoving: boolean): Promise<void> => {
		return new Promise((resolve, reject) => {
			TaskService.shared.assignUserToTask(task, session, user, isRemoving)
				.then(resolve)
				.catch(reject)
		})
	},
	fetchTaskData: async (taskId: string) => {
		try {
			return await TaskService.shared.getTask(taskId)
		} catch (error) {
			return Promise.reject(error)
		}
	},
	observingTasks: (workspaceId: string) => {
		return TaskService.shared.getTasks(workspaceId, (task: TaskType | null, type: DocumentChangeType) => {
			set((state) => {

				if (task) {
					if (type === "modified") {
						const index = state.tasks.findIndex(t => t.taskId === task.taskId)
						state.tasks[index] = task

						return ({
							tasks: state.tasks,
							forceRefreshListTasks: state.forceRefreshListTasks + 1
						})
					}

					if (type === "removed") {
						return ({
							tasks: state.tasks.filter(t => t.taskId !== task.taskId),
						})
					}

					return ({
						tasks: [...state.tasks, task],
					})
				} else {
					return ({
						tasks: [],
					})
				}
			})
		})
	},
	aproveOrRejectTask: (isAproved: boolean): Promise<void> => {
		return new Promise((resolve, reject) => {
			const { task } = get()

			if (task) {
				TaskService.shared.updateFinalStateTask(task, isAproved)
					.then(resolve)
					.catch(reject)
			}
		})
	},
	updateStateActivityProgressTask: (session: UserSessionType, activity?: ActivityType, progress?: number, state?: StateTask, report?: string, dueDays?: number): Promise<void> => {
		return new Promise((resolve, reject) => {

			const { task, tasks } = get()

			if (task) {
				TaskService.shared.updateStateActivityProgressTask(task.taskId, session, activity, progress, state, report, dueDays)
					.then(task => {

						const index = tasks.findIndex(t => t.taskId === task.taskId)
						tasks[index].userReport = task.userReport

						set({ task: tasks[index] })
						resolve()
					})
					.catch(reject)
			}
		})
	},
	observingCommentOnTask: (taskId: string, callback: (numberOfComments: number) => void): Unsubscribe => {
		return TaskService.shared.observingCommentOnTask(taskId, callback)
	}
}));

async function handleSavingLogs(assignedOf: UserSessionType[], workspaceTask: WorkspaceType, tags: TagType[], taskId: string, taskName?: string) {
	for (const userAssigned of assignedOf) {
		
		if (workspaceTask.team.owner.session.id === userAssigned.id) {

			await TaskService.shared.saveLogs(taskId, {
				logId: generateId(),
				action: "atribuiu-se",
				createAt: new Date(),
				data: "à esta tarefa",
				icon: "GoPerson",
				user: workspaceTask.team.owner
			})

		} else {
			await TaskService.shared.saveLogs(taskId, {
				logId: generateId(),
				action: "atribuiu",
				createAt: new Date(),
				data: `${userAssigned.displayName} esta tarefa`,
				icon: "GoPerson",
				user: workspaceTask.team.owner
			})
		}

		await FunctionNotificationService.shared.onSendMessageNotification(
			workspaceTask.team.owner.session.id,
			{
				userAddressTo: [{ displayName: userAssigned.displayName, email: userAssigned.email, phoneNumber: userAssigned.phoneNumber }],
				taskName: taskName!,
				teamName: workspaceTask.team.teamName,
				userNameNotificationFrom: workspaceTask.team.owner.session.displayName,
				workspaceName: workspaceTask.workspaceName
			},
			"task_assigned"
		)
	}

	await TaskService.shared.saveLogs(taskId, {
		logId: generateId(),
		action: "adicionou",
		createAt: new Date(),
		data: `${tags.length > 1 ? "as etiquetas" : "a etiqueta"} ${tags.map(tag => tag.tag).join(", ")}`,
		icon: "GoTag",
		user: workspaceTask.team.owner
	})
}