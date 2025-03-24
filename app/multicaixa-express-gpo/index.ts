import { ZenTaakResponseError, workSyncInstancePayment } from "@/axios";
import { McxDataParamsType } from "@/src/types/McxDataParamsType";
import { McxDataResponseType } from "@/src/types/McxDataResponseType";

export class MulticaixaExpressGpoApi {

    private requestEndpoint: string

    static shared = new MulticaixaExpressGpoApi()

    constructor() {
        this.requestEndpoint = "/payment/mcx/request"
    }

    requestPayment(data: McxDataParamsType): Promise<McxDataResponseType> {
        return new Promise((resolve, reject) => {
            workSyncInstancePayment
                .post<McxDataResponseType>(this.requestEndpoint, data)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error: ZenTaakResponseError<McxDataResponseType>) => {
                    switch (error.response?.data.errorCode) {
                        case 'PROCESSOR_907':
                            reject('Operação recusada. Por favor, tente novamente. Caso persista, entre em contacto connosco.');
                            break;

                        case 'ISSUER_810':
                            reject('Não existem fundos suficientes na tua conta.');
                            break;

                        case 'EPMS_907':
                            reject('Operação recusada pelo processador de pagamentos - EMIS.');
                            break;

                        case 'EPMS_940':
                            reject('Você cancelou o pagamento.');
                            break;

                        case 'TIMEOUT':
                            reject('O tempo para concluir o pagamento esgotou. Por favor, tente novamente.')
                            break;

                        case 'PROCESSOR_TIMEOUT':
                            reject('O tempo para concluir o pagamento esgotou. Por favor, tente novamente.')
                            break;

                        case 'PROCESSOR_ABORTED':
                            reject('A transação enviada foi abortada pelo processador por motivos internos. Entre em contacto com o suporte.')
                            break;

                        case 'BANK_822':
                            reject('Excedido o limite de pagamento.');
                            break;

                        case 'EXT_AUTH_907':
                            reject('O tempo para concluir o pagamento esgotou. Por favor, tente novamente.');
                            
                        default:
                            reject('Ocorreu um erro desconhecido. Por favor, contacte o suporte técnico');
                            break;
                    }
                });
        })
    }
}