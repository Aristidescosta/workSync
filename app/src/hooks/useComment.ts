import { create } from "zustand";
import CommentService from "../services/firebase/firestore/CommentService";
import { CommentType } from "../types/CommentType";
import { UserType } from "../types/UserType";
import generateId from "../services/UUID";
import FunctionNotificationService from "../services/firebase/functions/FunctionNotificationService";
import { MentionItem } from "react-mentions";
import { TeamType } from "../types/TeamType";
import { TaskType } from "../types/TaskType";
import { AttachmentFileType } from "../types/AttachmentFileType";
import { UserSessionType } from "../types/UserSessionType";

interface CommentState {
	message: string
	comment: CommentType | null
	comments: CommentType[]
	attachmentMessage: AttachmentFileType[]
}

interface CommentActions {
	setMessage: (message: string) => void
	clearAll: () => void
	saveUserComment: (task: TaskType, user: UserType, attachs: AttachmentFileType[]) => Promise<void>
	updateComment: (taskId: string, commentId: string, message: string) => Promise<void>
	getComments: (taskId: string) => Promise<void>
	setComment: (comment: CommentType | null) => void
	deleteComment: (taskId: string, commentId: string) => Promise<void>
	mentionOnComment: (usersMentions: MentionItem[], membersOfTeam: UserSessionType[], userCommented: string, team: TeamType | undefined, task: TaskType) => Promise<void>
}

const initialState: CommentState = {
	message: "",
	comment: null,
	comments: [],
	attachmentMessage: []
}

export const useCommentStore = create<CommentActions & CommentState>((set, get) => ({
	...initialState,
	clearAll: () => set({ ...initialState }),
	setComment: (comment: CommentType | null) => set({ comment }),
	setMessage: (message: string) => set({ message }),

	saveUserComment: (task: TaskType, user: UserType, attachs: AttachmentFileType[]): Promise<void> => {
		return new Promise((resolve, reject) => {
			const { message } = get()
			let comment: CommentType 

			if (attachs) {

				comment = {
					id: generateId(),
					createdAt: new Date(),
					taskId: task.taskId,
					user,
					message,
					edited: [],
					commentDeleted: false,
					attachs
				}

			} else {
				comment = {
					id: generateId(),
					createdAt: new Date(),
					taskId: task.taskId,
					user,
					message,
					edited: [],
					commentDeleted: false
				}
			}

			CommentService.shared.saveUserComment(task, comment)
				.then(() => {
					set(state => ({ comments: [...state.comments, comment] }))
					resolve()
				})
				.catch(reject)
		})
	},
	updateComment: (taskId: string, commentId: string, messageEdited: string): Promise<void> => {
		return new Promise((resolve, reject) => {

			if (messageEdited) {
				CommentService.shared.updateComment(taskId, commentId, messageEdited)
					.then((commentEdited) => {
						set(state => {
							const commentPosition = state.comments.findIndex(c => c.id === commentId)
							state.comments[commentPosition].edited.push(commentEdited)
							return ({ comments: state.comments })
						})
						resolve()
					})
					.catch(reject)
			}
		})
	},
	getComments: (taskId: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			CommentService.shared.getAllComments(taskId)
				.then(comments => {
					set({ comments })
					resolve()
				})
				.catch(reject)
		})
	},
	deleteComment: (taskId: string, commentId: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			CommentService.shared.deleteComment(taskId, commentId)
				.then(() => {
					set(state => ({ comments: state.comments.filter(c => c.id !== commentId) }))
					resolve()
				})
				.catch(reject)
		})
	},
	mentionOnComment: (mentions: MentionItem[], assignedOf: UserSessionType[], userCommented: string, team: TeamType | undefined, task: TaskType): Promise<void> => {
		return new Promise((resolve, reject) => {
			
			let iteration = 0
			let cancel: NodeJS.Timeout

			const runner = () => {
				if (iteration < mentions.length) {
					const userFounded = assignedOf.filter(user => user.id === mentions[iteration].id)
	
					if (userFounded.length === 1 && team) {
	
						const user = userFounded[0]
						
						FunctionNotificationService.shared.sendEmailMentionNotification(
							user.email, 
							userCommented, 
							team.teamName, 
							team.teamId, 
							task.taskTitle, 
							task.taskId
						)
						.then(() => {
							iteration += 1
							cancel = setTimeout(runner, 0)
						})
						.catch(error => {
							iteration = 0
							clearTimeout(cancel)
							reject(error)
						})
					} else {
						iteration = 0
						resolve()
					}
				} else {
					clearTimeout(cancel)
					resolve()
				}
			}
			runner()
		})
	}
}))