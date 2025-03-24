import { Unsubscribe } from "firebase/firestore";
import { create } from "zustand";

import { StorageService } from "../services/firebase/firestore/StorageService";
import { StorageAdvancedStaticEnum, StorageFreeStaticEnum, StorageGrowStaticEnum, StorageString, StorageType } from "../types/StorageType";

const initialState: State = {
    totalSpace: 0,
    totalSpaceUsed: 0,
    uploadLimit: 10000000
}

interface State {
    totalSpaceUsed: number
    totalSpace: number
    uploadLimit: number
}

interface Actions {
    createStorageAccount(accountId: string, storageString: StorageString): Promise<void>
    observingSpaces(workspaceId: string): Unsubscribe
}

export const useStorage = create<Actions & State>()((set) => ({
    ...initialState,
    createStorageAccount: async (accountId: string, storageString: StorageString): Promise<void> => {
        let storage: StorageType

        switch (storageString) {
            case "Startups (Grátis)":
                storage = {
                    totalSpace: StorageFreeStaticEnum.TOTAL_SPACE,
                    totalSpaceUsed: 0,
                    createdAt: new Date(),
                    uploadLimit: StorageFreeStaticEnum.UPLOAD_LIMIT,
                    accountId,
                    extraSpace: []
                }
                break;

            case "Crescimento":
                storage = {
                    totalSpace: StorageGrowStaticEnum.TOTAL_SPACE,
                    totalSpaceUsed: 0,
                    createdAt: new Date(),
                    uploadLimit: StorageGrowStaticEnum.UPLOAD_LIMIT,
                    accountId,
                    extraSpace: []
                }
                break;

            default:
                storage = {
                    totalSpace: StorageAdvancedStaticEnum.TOTAL_SPACE,
                    totalSpaceUsed: 0,
                    createdAt: new Date(),
                    uploadLimit: StorageAdvancedStaticEnum.UPLOAD_LIMIT,
                    accountId,
                    extraSpace: []
                }
                break;
        }

        return await StorageService.shared.createStorage(storage)
    },
    observingSpaces: (workspaceId: string): Unsubscribe => {
        return StorageService.shared.getSpaces(workspaceId, (storage, isRemoving) => {

            set(() => ({
                totalSpaceUsed: storage.totalSpaceUsed,
                totalSpace: storage.totalSpace + storage.extraSpace.reduce((prevValue, currentValue) => prevValue + currentValue, 0),
                loadingWorkspaces: false,
                uploadLimit: storage.uploadLimit
            }))

            //callback(storageSpace, isRemoving)
        })
    },
}))