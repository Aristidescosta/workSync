import { FirebaseStorage, deleteObject, getStorage, ref, } from "firebase/storage";

import StorageService from "./StorageService";

export default class StorageTaskService extends StorageService {
    storage: FirebaseStorage;

    private folderPathRef = "/team/"

    static shared = new StorageTaskService()

    constructor() {
        super()
        this.storage = getStorage()
    }

    async uploadTaskFilesAttachment(userId: string, workspaceId: string, file: File) {
        return await super.uploadFiles(`${this.folderPathRef}files/${workspaceId}/`, userId, file)
    }

    async uploadFilesAttachmentWithProgressBar(userId: string, workspaceId: string, file: File, callback?: (progress: number) => void) {
        console.log(userId, workspaceId, file)
        return await super.uploadFiles(`${this.folderPathRef}files/${workspaceId}/`, userId, file, callback);
    }

    async deleteTaskFileAttachments(userId: string, workspaceId: string, fileName: string) {
        const storageRef = ref(this.storage, `${userId}${this.folderPathRef}files/${workspaceId}/`);

        try {
            const fileRef = ref(storageRef, fileName);
            return await deleteObject(fileRef);
        } catch (error) {
            return Promise.reject(error)
        }
    }
}