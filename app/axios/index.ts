import axios, { AxiosResponse, AxiosError } from 'axios';

export const toquemediaInstancePayment = axios.create({
    baseURL: 'https://payments.toquemedia.net'
});

export type ZenTaakResponseData<T = any, D = any> = AxiosResponse<T, D>
export type ZenTaakResponseError<T = any, D = any> = AxiosError<T, D>