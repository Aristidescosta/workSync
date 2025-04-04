import { Firestore, FirestoreErrorCode } from "firebase/firestore";
import FirebaseService from "../FirebaseService";

export default abstract class FirestoreService extends FirebaseService {
    abstract dbFirestore: Firestore

    constructor() {
        super()
    }

    errorMessage(errorCode: string): string {
        if (errorCode === "aborted" satisfies FirestoreErrorCode) {
            return "A operação foi abortada";
        } else if (errorCode === "deadline-exceeded" satisfies FirestoreErrorCode) {
            return "Tempo de operação excedido. Verifique se estás conectado a internet";
        } else if (errorCode === "unauthenticated" satisfies FirestoreErrorCode) {
            return "Ocorreu um erro porque não estás autenticado na tua conta.";
        } else if (errorCode === "permission-denied" satisfies FirestoreErrorCode) {
            return "Permissão negada para esta operação.";
        } else if (errorCode === "not-found" satisfies FirestoreErrorCode) {
            return "Ocorreu um erro com a operação porque o que pretendia buscar não foi encontrado";
        } else {
            return "Ocorreu um erro desconhecido. Contacte a equipa de suporte";
        }
    }

    getCollectionNameCompanies() {
        return "companies"
    }

    getCollectionNameActivities() {
        return "activities"
    }

    getCollectionNameInvites() {
        return "invites"
    }

    getCollectionNameTeams() {
        return "teams"
    }

    getCollectionNameUsers() {
        return "users"
    }

    getCollectionNameTasks() {
        return "tasks"
    }

    getCollectionNameComments() {
        return "comments"
    }

    getCollectionNameWorkspaces() {
        return "workspaces"
    }

    getCollectionNameNotifications() {
        return "notifications"
    }

    getCollectionAttachmentDocuments() {
        return "attachmentDocuments"
    }

    getCollectionStorages(){
        return "storages"
    }

    getCollectionPlans(){
        return "plans"
    }
    
    getCollectionIntegrations(){
        return "integrations"
    }

    getCollectionSubscriptions(){
        return "subscriptions"
    }

    getCollectionStorageSubscriptions(){
        return "storageSubscriptions"
    }

    getCollectionPayments(){
        return "payments"
    }

    getColletionTaskStats() {
        return "statsResumeTask"
    }

    getColletionLogsActivities() {
        return "logsActivities"
    }
}