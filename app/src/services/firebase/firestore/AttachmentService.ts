import { Firestore, FirestoreError, Unsubscribe, collection, doc, getFirestore, onSnapshot, query, setDoc, where, writeBatch } from "firebase/firestore";
import FirestoreService from "./FirestoreService";
import { AttachmentFileType } from "@/src/types/AttachmentFileType";
import { TaskService } from "./TaskService";
import { TaskType } from "@/src/types/TaskType";
import StorageTaskService from "../storage/StorageTaskService";

export class AttachmentService extends FirestoreService {
    dbFirestore: Firestore;
    static shared = new AttachmentService()

    constructor() {
        super()
        this.dbFirestore = getFirestore();
    }

    addAttachmentDocumentsOfTask(attachmentDocuments: AttachmentFileType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionAttachmentDocuments(), attachmentDocuments.attachId)
            setDoc(docData, attachmentDocuments)
                .then(resolve)
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    private async updateTaskAttachments(task: TaskType, attachment: AttachmentFileType, workspaceId: string): Promise<void> {
        const existingAttachment = task.attachments?.find(a => a.attachId === attachment.attachId);

        if (!existingAttachment) {
            return;
        }

        task.attachments = task.attachments?.map(taskAttachment =>
            taskAttachment.attachId === existingAttachment.attachId ? { ...existingAttachment, noPhysicalAttachment: true } : taskAttachment
        );

        await Promise.all([
            TaskService.shared.updateTask(task),
            StorageTaskService.shared.deleteTaskFileAttachments(task.workspace.team.owner.session.email, workspaceId, attachment.fileName)
        ]);
    }

    async deleteAttachments(workspaceId: string, accountId: string, attachments: AttachmentFileType[], shouldDelete: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const BATCH = writeBatch(this.dbFirestore);
            try {
                for (const attachment of attachments) {
                    const docRef = doc(this.dbFirestore, this.getCollectionAttachmentDocuments(), attachment.attachId);

                    if (shouldDelete) {
                        if (attachment.taskId) {
                            const task = await TaskService.shared.getTask(attachment.taskId);
                            await this.updateTaskAttachments(task, attachment, workspaceId);
                        }
                        else {
                            await StorageTaskService.shared.deleteTaskFileAttachments(accountId, workspaceId, attachment.fileName);
                        }
                        BATCH.delete(docRef)
                    } else {
                        BATCH.set(docRef, attachment, { merge: true });
                    }
                }
                resolve(BATCH.commit())
            } catch (error) {
                reject(error);
            }
        })
    }

    getAttachments(accountId: string, callback: (attachment: AttachmentFileType, isRemoving: boolean, isUpdating: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionAttachmentDocuments())
        const q = query(collRef, where("accountId", "==", accountId))

        return onSnapshot(q, (querySnapshot) => {

            querySnapshot.docChanges().forEach(change => {
                switch (change.type) {
                    case "added":
                        const data = change.doc.data() as AttachmentFileType
                        callback(data, false, false)
                        break;
                    case "modified":
                        const dataModified = change.doc.data() as AttachmentFileType
                        callback(dataModified, false, true)
                        break;
                    case "removed":
                        const dataRemoved = change.doc.data() as AttachmentFileType
                        callback(dataRemoved, true, false)
                        break;
                }
            })
        })
    }

}
