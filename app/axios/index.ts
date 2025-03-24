import axios, { AxiosResponse, AxiosError } from 'axios';

export const workSyncInstancePayment = axios.create({
    baseURL: ''
});

export type ZenTaakResponseData<T = any, D = any> = AxiosResponse<T, D>
export type ZenTaakResponseError<T = any, D = any> = AxiosError<T, D>