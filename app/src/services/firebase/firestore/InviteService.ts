import { Firestore, FirestoreError, Timestamp, Unsubscribe, addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { InviteType } from "@/src/types/InviteType";
import FirestoreService from "./FirestoreService";
import { SubscriptionService } from "./SubscriptionService";
import TeamService from "./TeamService";
import { ZenTaakPlanType } from "@/src/types/PlanType";

export class InviteService extends FirestoreService {
    dbFirestore: Firestore;
    static shared = new InviteService()

    constructor() {
        super()
        this.dbFirestore = getFirestore();
    }

    sendInvite(invite: InviteType): Promise<void> {
        return new Promise((resolve, reject) => {
            const collRef = collection(this.dbFirestore, this.getCollectionNameInvites())
            addDoc(collRef, invite)
                .then(() => {
                    resolve()
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    acceptOrRejectInvite(invite: InviteType, wasAccept: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const docRef = doc(this.dbFirestore, this.getCollectionNameInvites(), invite.id!)

            if (wasAccept) {
                const invitationAccountId = invite.team.owner.session.id
                const dataInvitation = await Promise.all([
                    TeamService.shared.checkNumberOfMembers(invite.team.teamId),
                    SubscriptionService.shared.getUserSubscription(invitationAccountId)
                ])

                const numberOfMembers = dataInvitation[0] + 1
                const subscription = dataInvitation[1]
                const usersInTeam = (subscription.package as ZenTaakPlanType)?.feature.usersInTeam === 0 ?
                    10000000000000000000000
                    :
                    (subscription.package as ZenTaakPlanType)?.feature.usersInTeam

                if (numberOfMembers >= usersInTeam) {
                    reject("A conta que enviou o convite atingiu o limite de elementos numa equipa.")
                } else {
                    updateDoc(docRef, { wasAccept })
                        .then(resolve)
                        .catch(reject)
                }
            } else {
                deleteDoc(docRef)
                    .then(resolve)
                    .catch(reject)
            }
        })
    }

    getAllInvites(email: string, callback: (invite: InviteType, isRemoving: boolean) => void): Unsubscribe {
        const collRef = collection(this.dbFirestore, this.getCollectionNameInvites())
        const q = query(collRef, where("to.session.email", "==", email), where("wasAccept", "==", false))

        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach(change => {
                switch (change.type) {
                    case 'added':
                        const data = change.doc.data() as InviteType
                        const created = data.createdAt as unknown as Timestamp
                        data.id = change.doc.id
                        data.createdAt = created.toDate()
                        callback(data, false)
                        break;

                    case 'modified':
                        console.log("Modificado")
                        break

                    case 'removed':
                        const dataRemoved = change.doc.data() as InviteType;
                        dataRemoved.id = change.doc.id

                        callback(dataRemoved, true)
                        break
                }
            })
        });
    }
}