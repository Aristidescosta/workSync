import { FirebaseStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import FirebaseService from "../FirebaseService";

export default abstract class StorageService extends FirebaseService {
    abstract storage: FirebaseStorage

    constructor() {
        super()
    }

    uploadFiles(folderPathRef: string, id: string, file: File, progressCallback?: (progress: number) => void): Promise<string> {
        return new Promise((resolve, reject) => {

            const storageRef = ref(this.storage, `${id}${folderPathRef}${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressCallback?.(progress)
            }, (error) => {
                console.log(error)
                reject(error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        console.log(downloadURL)
                        resolve(downloadURL);
                    });
            });
        });
    }
}