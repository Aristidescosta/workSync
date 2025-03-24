import { Functions } from "firebase/functions";
import FirebaseService from "../FirebaseService";

export default abstract class FunctionService extends FirebaseService {
    abstract functions: Functions

    constructor() {
        super()
    }
}