export type McxDataParamsType = {
    pos: number
    amount: number
    orderOrigin: "MOBILE"
    currency: "AOA"
    merchantReferenceNumber: string
    paymentInfo: {
        mobile: {
            phoneNumber: string
        }
    },
    env: "prd" | "dev" | "dev_err"
}