import { Unsubscribe } from "firebase/firestore";
import { create } from "zustand";

import { AttachmentService } from "../services/firebase/firestore/AttachmentService";
import { AttachmentFileType } from "../types/AttachmentFileType";

import generateId from "../services/UUID";
import StorageTaskService from "../services/firebase/storage/StorageTaskService";
import { UserSessionType } from "../types/UserSessionType";
import { FirebaseError } from "firebase/app";

const initialState: State = {
    attachments: [],
    deletedAttachments: [],
    loadingAttachment: false,
    attachmentsFile: [],
    uploadLimit: 10000000,
    progress: 0,
    uploading: false
}

interface State {
    attachments: AttachmentFileType[];
    deletedAttachments: AttachmentFileType[];

    attachment?: AttachmentFileType;
    loadingAttachment: boolean;
    uploadLimit: number;
    attachmentsFile?: File[]
    progress: number;
    uploading: boolean;
}

interface Actions {
    observingAllAttachments: (workspace: string, callback: (attachment: AttachmentFileType, isRemoving: boolean, isUpdating: boolean) => void) => Unsubscribe
    setDeletedAttachments: (attachment: AttachmentFileType[]) => void
    setAttachments: (attachment: AttachmentFileType[]) => void;
    deleteAttachments: (workspaceId: string, userId: string, attachments: AttachmentFileType[], isToEliminate: boolean) => Promise<void>;
    setAttachmentsFile: (attachmentsFile: File[]) => void
    uploadAttachmentFiles: (user: UserSessionType, workspaceId: string, attachmentsFile: File[]) => Promise<AttachmentFileType[]>
    addAttachmentDocuments: (userSession: UserSessionType, workspaceId: string, progressCallback?: (progress: number) => void) => Promise<void>
    setUploadProgress: (progress: number) => void
    clearAttachements: () => void
}

export const useAttachmentStore = create<Actions & State>()((set, get) => ({
    ...initialState,
    uploadAttachmentFiles: (user: UserSessionType, workspaceId: string, attachmentsFile: File[]): Promise<AttachmentFileType[]> => {
        return new Promise((resolve, reject) => {
            let iteration = 0, timeout: NodeJS.Timeout
            const attachments: AttachmentFileType[] = []

            const runner = () => {
                if (iteration < attachmentsFile.length) {
                    StorageTaskService.shared.uploadTaskFilesAttachment(user.email, workspaceId, attachmentsFile[iteration])
                        .then(url => {
                            attachments.push({
                                attachId: generateId(),
                                fileName: attachmentsFile![iteration].name,
                                fileUrl: url,
                                createdAt: new Date(),
                                accountId: user.id,
                                size: attachmentsFile![iteration].size,
                                wasDeleted: false,
                                type: attachmentsFile![iteration].type
                            })

                            AttachmentService.shared.addAttachmentDocumentsOfTask(attachments[iteration])
                                .then(() => {
                                    iteration += 1
                                    timeout = setTimeout(runner, 0);
                                })
                                .catch(reject)
                        })
                        .catch(err => {
                            clearTimeout(timeout)
                        })
                } else {
                    clearTimeout(timeout)
                    resolve(attachments)
                }
            }
            runner()
        })
    },
    observingAllAttachments: (workspace: string, callback: (attachment: AttachmentFileType, isRemoving: boolean, isUpdating: boolean) => void): Unsubscribe => {
        return AttachmentService.shared.getAttachments(workspace, (attachment, isRemoving, isUpdating) => {

            set(state => ({
                attachments: [...state.attachments, attachment],
                loadingWorkspaces: false,
            }))

            callback(attachment, isRemoving, isUpdating)
        })
    },

    clearAttachements: () => set(({
        attachmentsFile: []
    })),

    setUploadProgress: (progress: number) => set({ progress }),

    addAttachmentDocuments: (userSession: UserSessionType, workspaceId: string, progressCallback?: (progress: number) => void): Promise<void> => {
        return new Promise((resolve, reject) => {


            const attachments: AttachmentFileType[] = []
            const { attachmentsFile } = get() ?? { attachmentsFile: [] };

            if (attachmentsFile) {
                set(({
                    uploading: true,
                    loadingAttachment: true
                }))

                const totalFiles = attachmentsFile.length;

                const uploadNextFile = (index: number) => {
                    if (index >= totalFiles) {
                        set(({
                            ...initialState,
                        }))
                        return resolve()
                    }

                    const file = attachmentsFile[index];
                    StorageTaskService.shared.uploadFilesAttachmentWithProgressBar(userSession.email, workspaceId, file, progressCallback)
                        .then(url => {
                            const nextIndex = index + 1;
                            attachments.push({
                                attachId: generateId(),
                                fileName: attachmentsFile[index].name,
                                fileUrl: url,
                                createdAt: new Date(),
                                accountId: userSession.id,
                                size: attachmentsFile[index].size,
                                wasDeleted: false,
                                type: attachmentsFile[index].type
                            })

                            set(state => ({
                                attachmentsFile: state.attachmentsFile?.filter(attachment => (attachment.size === attachments[index].size) && (attachment.name === attachments[index].fileName))
                            }))

                            AttachmentService.shared.addAttachmentDocumentsOfTask(attachments[index])
                                .then(() => {
                                    uploadNextFile(nextIndex);
                                })
                                .catch(reject)
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }

                uploadNextFile(0);
            } else {
                set(({
                    ...initialState,
                }))
                reject({ message: 'Nenhum ficheiro selecionado' });
            }
        })
    },

    setAttachmentsFile: (attachmentsFile: File[]) => set({ attachmentsFile }),

    setDeletedAttachments: (deletedAttachments: AttachmentFileType[]) => set({ deletedAttachments }),
    setAttachments: (attachments: AttachmentFileType[]) => set({ attachments }),
    deleteAttachments: (workspaceId: string, userId: string, attachments: AttachmentFileType[], isToEliminate) => {
        set({ loadingAttachment: true })

        const filesNames: string[] = []

        attachments.forEach((attachment) => {
            filesNames.push(attachment.fileName)
        })

        return AttachmentService.shared.deleteAttachments(workspaceId, userId, attachments, isToEliminate)
            .then(() => {
                set(({
                    ...initialState,
                }))
            })
            .catch((error: FirebaseError) => {
                set(({
                    ...initialState,
                }))
                return Promise.reject(error.message)
            });

    }
}))