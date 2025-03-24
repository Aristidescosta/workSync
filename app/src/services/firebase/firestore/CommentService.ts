import { Firestore, FirestoreError, Timestamp, arrayUnion, collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { CommentType } from "@/src/types/CommentType";
import LogsActivityService from "./LogsActivityService";
import { TaskType } from "@/src/types/TaskType";

export default class CommentService extends FirestoreService {

	dbFirestore: Firestore;

	static shared = new CommentService()

	constructor() {
		super()
		this.dbFirestore = getFirestore()
	}

	saveUserComment(task: TaskType, comment: CommentType): Promise<void> {
		return new Promise((resolve, reject) => {
			const docRef = doc(this.dbFirestore, this.getCollectionNameTasks(), task.taskId, this.getCollectionNameComments(), comment.id)
			setDoc(docRef, comment)
				.then(async () => {

					await LogsActivityService.shared.saveActivity({
						user: comment.user.session,
						action: `comentou na tarefa ${task.taskTitle} do workspace ${task.workspace.workspaceName}.`,
						teamId: task.workspace.team.teamId,
						createdAt: new Date()
					})

					resolve()
				})
				.catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
		})
	}

	getAllComments(taskId: string): Promise<CommentType[]> {
		return new Promise((resolve, reject) => {
			const collRef = collection(this.dbFirestore, this.getCollectionNameTasks(), taskId, this.getCollectionNameComments())
			const q = query(collRef, where("commentDeleted", "==", false))
			getDocs(q)
				.then(snapshot => {
					if (snapshot.empty) {
						resolve([])
					} else {
						const comments: CommentType[] = []

						snapshot.forEach(doc => {
							const data = doc.data() as CommentType
							const created = data.createdAt as unknown as Timestamp
							data.id = doc.id
							data.createdAt = created.toDate()
							comments.push(data)
						})
						resolve(comments)
					}
				})
				.catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
		})
	}

	updateComment(taskId: string, commentId: string, message: string): Promise<{ message: string, updatedAt: Timestamp }> {
		return new Promise((resolve, reject) => {
			const collRef = doc(this.dbFirestore, this.getCollectionNameTasks(), taskId, this.getCollectionNameComments(), commentId)
			updateDoc(collRef, {
				edited: arrayUnion({
					message,
					updatedAt: new Date()
				})
			})
				.then(() => resolve({
					message,
					updatedAt: Timestamp.now()
				}))
				.catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
		})
	}

	deleteComment(taskId: string, commentId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const docRef = doc(this.dbFirestore, this.getCollectionNameTasks(), taskId, this.getCollectionNameComments(), commentId)
			setDoc(docRef, { commentDeleted: true }, { merge: true })
				.then(resolve)
				.catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
		})
	}
}