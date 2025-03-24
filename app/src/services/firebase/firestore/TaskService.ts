import { StateTask, TaskType } from "@/src/types/TaskType";
import { Firestore, FirestoreError, collection, doc, getFirestore, query, setDoc, where, updateDoc, arrayUnion, arrayRemove, getDoc, Unsubscribe, onSnapshot, DocumentChangeType, addDoc, orderBy } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { ActivityType } from "@/src/types/ActivityType";
import { TaskLogType } from "@/src/types/TaskLogType";
import { taskConverter } from "../converter/TaskConverter";
import { taskLogConverter } from "../converter/TaskLogConverter";
import { UserSessionType } from "@/src/types/UserSessionType";
import LogsActivityService from "./LogsActivityService";

export class TaskService extends FirestoreService {
    dbFirestore: Firestore;
    static shared = new TaskService()

    private subCollection = "logs"

    constructor() {
        super()
        this.dbFirestore = getFirestore();
    }

    createTask(newTask: TaskType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionNameTasks(), newTask.taskId).withConverter(taskConverter)
            setDoc(docData, newTask)
                .then(async () => {
                    await LogsActivityService.shared.saveActivity({
                        user: newTask.createdBy,
                        action: `criou a tarefa ${newTask.taskTitle} no workspace ${newTask.workspace.workspaceName}.`,
                        teamId: newTask.workspace.team.teamId,
                        createdAt: new Date()
                    })
                    resolve()
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    updateTask(task: TaskType): Promise<void> {

        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionNameTasks(), task.taskId).withConverter(taskConverter)
            setDoc(docData, task, { merge: true })
                .then(async () => {
                    await LogsActivityService.shared.saveActivity({
                        user: task.editedBy!,
                        action: `fez alterações na tarefa ${task.taskTitle} do workspace ${task.workspace.workspaceName}.`,
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

    updateFinalStateTask(task: TaskType, isAproved: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionNameTasks(), task.taskId).withConverter(taskConverter)

            const data = isAproved ? { state: "Concluída" } : { state: "Incompleta" }
            const action = isAproved ?
                `aprovou e marcou como concluída a tarefa ${task.taskTitle} do workspace ${task.workspace.workspaceName}.`
                :
                `rejeitou a conclusão da tarefa ${task.taskTitle} do workspace ${task.workspace.workspaceName}.`

            setDoc(docData, data, { merge: true })
                .then(async () => {
                    await LogsActivityService.shared.saveActivity({
                        user: task.workspace.team.owner.session,
                        action,
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

    closeTask(task: TaskType, isOpen: boolean): Promise<void> {

        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionNameTasks(), task.taskId).withConverter(taskConverter)
            updateDoc(docData, { isOpen })
                .then(async () => {

                    await LogsActivityService.shared.saveActivity({
                        user: task.createdBy,
                        action: `fechou a tarefa ${task.taskTitle} do workspace ${task.workspace.workspaceName}.`,
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

    assignUserToTask(task: TaskType, session: UserSessionType, user: UserSessionType[], isRemoving: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTasks(), task.taskId).withConverter(taskConverter)
            updateDoc(docRef, { assignedOf: isRemoving ? arrayRemove(...user) : arrayUnion(...user) })
                .then(async () => {
                    let action: string

                    for (const u of user) {
                        if (u.id === session.id) {
                            action = isRemoving ? "removeu-se" : "atribuiu-se"
                        } else {
                            action = isRemoving ? "removeu" : "atribuiu a"
                        }

                        const taskAction = isRemoving ? "da tarefa" : "a tarefa"

                        await LogsActivityService.shared.saveActivity({
                            user: task.createdBy,
                            action: `${action} ${action === "atribuiu-se" || action === "removeu-se" ? "" : user.map(u => u.displayName).join(', ')} ${taskAction} ${task.taskTitle} no workspace ${task.workspace.workspaceName}.`,
                            teamId: task.workspace.team.teamId,
                            createdAt: new Date()
                        })
                    }

                    resolve()
                })
                .catch(reject)
        })
    }

    getTasks(workspaceId: string, callback: (task: TaskType | null, type: DocumentChangeType) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameTasks()).withConverter(taskConverter)
        const q = query(collRef, where("workspace.workspaceId", "==", workspaceId))

        return onSnapshot(q, (querySnapshot) => {

            if (querySnapshot.empty) {
                callback(null, "added")
            } else {
                querySnapshot.docChanges().forEach((changes) => {

                    const currentData = changes.doc.data();

                    switch (changes.type) {
                        case "added":
                            callback(currentData, changes.type)
                            break;
                        case "modified":
                            callback(currentData, changes.type)
                            break;
                        case "removed":
                            console.log("Tasks, removed")
                            break;

                        default:
                            break;
                    }
                });
            }
        });
    }

    updateStateActivityProgressTask(taskId: string, session: UserSessionType, activity?: ActivityType, progress?: number, state?: StateTask, report?: string, dueDays?: number): Promise<TaskType> {
        return new Promise(async (resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameTasks(), taskId).withConverter(taskConverter)
            const documentData = await getDoc(docRef)
            const task = documentData.data()
            let action: string

            if (task) {
                if (activity) {
                    const index = task.activities.findIndex(a => a.activityId === activity.activityId)
                    task.activities[index].isDone = activity.isDone
                    action = `${session.displayName} marcou como concluída a actividade ${task.activities[index].activity}, da tarefa ${task.taskTitle} no workspace ${task.workspace.workspaceName}.`
                } else {
                    action = `${session.displayName} actualizou o estado da tarefa ${task.taskTitle} no workspace ${task.workspace.workspaceName}.`
                }

                if (progress) {
                    task.progress = progress
                }

                if (state) {
                    task.state = state
                }

                if (dueDays) {
                    if (dueDays > 0) {
                        task.dueDays = dueDays
                    }
                }

                task.userReport = report

                updateDoc(docRef, task)
                    .then(async () => {

                        await LogsActivityService.shared.saveActivity({
                            user: task.createdBy,
                            action,
                            teamId: task.workspace.team.teamId,
                            createdAt: new Date()
                        })

                        resolve(task)
                    })
                    .catch((error: FirestoreError) => {
                        reject(this.errorMessage(error.code))
                    })
            }
        })
    }

    getTask(taskId: string): Promise<TaskType> {
        return new Promise((resolve, reject) => {
            const collRef = doc(this.dbFirestore, this.getCollectionNameTasks(), taskId).withConverter(taskConverter)
            getDoc(collRef)
                .then((doc) => {
                    const task = doc.data()
                    if (task) {
                        resolve(task);
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    observingCommentOnTask(taskId: string, callback: (task: number) => void): Unsubscribe {
        const docRef = doc(this.dbFirestore, this.getCollectionNameTasks(), taskId).withConverter(taskConverter)
        return onSnapshot(docRef, (querySnapshot) => {
            const task = querySnapshot.data()
            if (task) {
                callback(task.numberOfComments ?? 0)
            }
        });
    }

    async saveLogs(taskId: string, data: TaskLogType): Promise<void> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameTasks(), taskId, this.subCollection)
            addDoc(collRef, data)
                .then(() => resolve())
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    observingLogsOnTask(taskId: string, callback: (log: TaskLogType) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameTasks(), taskId, this.subCollection).withConverter(taskLogConverter)
        const q = query(collRef, orderBy("createAt"))
        return onSnapshot(q, (querySnapshot) => {

            querySnapshot.docChanges().forEach((changes) => {
                const currentData = changes.doc.data()

                if (currentData) {
                    switch (changes.type) {
                        case "added":
                            callback(currentData)
                            break;
                    }
                }
            })
        });
    }
}