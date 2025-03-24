import { ZenTaakResponseError, toquemediaInstancePayment } from "@/axios";
import { EkwanzaDataParamsType } from "@/src/types/EkwanzaDataParamsType";
import { EkwanzaDataResponseType } from "@/src/types/EkwanzaDataResponseType";

export class EKwanzaApi {

    private requestEndpoint: string
    private checkStatus: string

    static shared = new EKwanzaApi()

    constructor() {
        this.requestEndpoint = "/payment/ekwanza/request"
        this.checkStatus = "/payment/ekwanza/checkPayment"
    }

    requestPayment(data: EkwanzaDataParamsType): Promise<EkwanzaDataResponseType> {
        return new Promise((resolve, reject) => {
            toquemediaInstancePayment
                .post<EkwanzaDataResponseType>(this.requestEndpoint, data)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error: ZenTaakResponseError) => {
                    reject(error.message)
                });
        })
    }

    checkPaymentStatus(reference: number): Promise<{ Status: number, Amount: number }> {
        return new Promise((resolve, reject) => {
            const env = window.location.hostname === "localhost" ? "dev" : "prd"
            toquemediaInstancePayment
                .get<{ Status: number, Amount: number }>(`${this.checkStatus}/${env}/${reference}`)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error: ZenTaakResponseError) => {
                    reject(error.message)
                });
        })
    }
}