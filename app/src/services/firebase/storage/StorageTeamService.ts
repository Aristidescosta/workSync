import { getStorage, FirebaseStorage } from "firebase/storage";
import StorageService from "./StorageService";

export default class StorageTeamService extends StorageService {
    storage: FirebaseStorage;

    private folderPathRef = "/team/"
    static shared = new StorageTeamService()

    constructor() {
        super()
        this.storage = getStorage()
    }

    async uploadTeamImage(id: string, file: File): Promise<string> {
        return await super.uploadFiles(`${this.folderPathRef}image/`, id, file)
    }
}