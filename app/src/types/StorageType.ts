export type StorageType = {
    totalSpace: number
    totalSpaceUsed: number
    createdAt: Date
    uploadLimit: number
    accountId: string
    extraSpace: number[]
}

export type StorageString = "Startups (Grátis)" | "Crescimento" | "Avançado" 

export enum StorageFreeStaticEnum {
    TOTAL_SPACE = 500000000,
    UPLOAD_LIMIT = 10000000
}

export enum StorageGrowStaticEnum {
    TOTAL_SPACE = 2000000000,
    UPLOAD_LIMIT = 50000000
}

export enum StorageAdvancedStaticEnum {
    TOTAL_SPACE = 5000000000,
    UPLOAD_LIMIT = 100000000
}