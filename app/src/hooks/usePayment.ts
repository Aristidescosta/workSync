import { create } from "zustand";

import { EKwanzaApi } from "@/e-kwanza-api";
import { EkwanzaDataParamsType } from "../types/EkwanzaDataParamsType";
import { McxDataParamsType } from "../types/McxDataParamsType";
import { MulticaixaExpressGpoApi } from "@/multicaixa-express-gpo";
import { PaymentService } from "../services/firebase/firestore/PaymentService";
import { PaymentType } from "../types/PaymentType";
import generateId from "../services/UUID";
import { PlanType } from "../types/PlanType";

const initialState: State = {
    ekwanzaReference: 0,
    qrCode: "",
    status: null,
    gpoReferenceId: "",
    totalToBuyStorage: 0,
    qtdMonthToBuyStorage: 0
}

interface State {
    ekwanzaReference: number
    qrCode: string
    status: number | null
    gpoReferenceId: string
    totalToBuyStorage: number
    qtdMonthToBuyStorage: number
}

interface Actions {
    requestEkwanzaPayment(data: EkwanzaDataParamsType): Promise<void>
    checkEkwanzaPayment(accountId: string, planSelected: PlanType): Promise<{ status: number }>
    requestMulticaixaExpressPayment(sessionId: string, planSelected: PlanType, data: McxDataParamsType): Promise<void>
    setClearStoragePayment(): void
    setTotalToBuyStorage(value: number): void
    setQtdMonthToBuyStorage(qtdMonthToBuyStorage: number): void
}

export const usePaymentStore = create<Actions & State>()((set, get) => ({
    ...initialState,
    setTotalToBuyStorage: (totalToBuyStorage: number) => set({ totalToBuyStorage }),
    setQtdMonthToBuyStorage: (qtdMonthToBuyStorage: number) => set({ qtdMonthToBuyStorage }),
    setClearStoragePayment: () => set(initialState),
    requestEkwanzaPayment: (data: EkwanzaDataParamsType): Promise<void> => {
        return new Promise((resolve, reject) => {

            data.env = window.location.hostname === "localhost" ? "dev" : "prd"

            EKwanzaApi.shared.requestPayment(data)
                .then(response => {
                    if (response.Status === 9) {
                        reject("A quantia informada não é suportada.")
                    } else {
                        set({
                            ekwanzaReference: response.Code,
                            qrCode: response.QRCode,
                            status: response.Status
                        })
                        resolve()
                    }
                })
                .catch(reject)
        })
    },
    requestMulticaixaExpressPayment: (accountId: string, planSelected: PlanType, data: McxDataParamsType): Promise<void> => {
        return new Promise((resolve, reject) => {

            data.env = window.location.hostname === "localhost" ? "dev" : "prd"
            data.paymentInfo.mobile.phoneNumber = `244${data.paymentInfo.mobile.phoneNumber}`

            MulticaixaExpressGpoApi.shared.requestPayment(data)
                .then(async (response) => {
                    if (response.errorCode) {
                        reject(response.errorMessage)
                    } else {
                        const payment: PaymentType = {
                            amount: data.amount,
                            createdAt: new Date(),
                            paymentId: generateId(),
                            gpoReferenceId: response.id,
                            accountId,
                            bought: planSelected,
                            method: "mcx-gpo",
                            fee: 0
                        }
                        await createPayment(payment)
    
                        set({
                            gpoReferenceId: response.id
                        })
                        resolve()
                    }
                })
                .catch(reject)
        })
    },
    checkEkwanzaPayment: (accountId: string, planSelected: PlanType): Promise<{ status: number }> => {
        return new Promise((resolve, reject) => {

            const { ekwanzaReference } = get()

            EKwanzaApi.shared.checkPaymentStatus(ekwanzaReference)
                .then(async (response) => {
                    if (response.Status === 1) {
                        const payment: PaymentType = {
                            amount: response.Amount,
                            createdAt: new Date(),
                            paymentId: generateId(),
                            accountId,
                            bought: planSelected,
                            referenceEk: ekwanzaReference,
                            method: "e-kwanza",
                            fee: 0
                        }
                        await createPayment(payment)
                    }
                    resolve({ status: response.Status })
                })
                .catch(reject)
        })
    }
}))

async function createPayment(response: PaymentType) {
    return await PaymentService.shared.createPayment(response)
}