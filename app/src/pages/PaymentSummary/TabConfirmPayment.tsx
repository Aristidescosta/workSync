import { Heading, Image, Input, InputGroup, InputLeftAddon, ModalBody, ModalHeader, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useToastMessage } from '../../services/chakra-ui-api/toast'
import { GroupButtons } from './components/GroupButtons'
import EkwanzaReferenceAndQrCode from './components/EkwanzaReferenceAndQrCode'
import { usePaymentStore } from '@/src/hooks/usePayment'
import { useSubscriptionStore } from '@/src/hooks/useSubscription'
import { useUserSessionStore } from '@/src/hooks/useUserSession'
import { PlanType } from '@/src/types/PlanType'
import { StorageString } from '@/src/types/StorageType'

interface ITabConfirmPaymentProps {
    setTabIndex: (index: number) => void
    onClose: () => void
    onPaymentComplete: () => void
    planType: "subscription" | "storage" | "notification",
    selectedMethod: string
    description: string
    typeOfPayment: string
    planSelected: PlanType | undefined
}

export const TabConfirmPayment: React.FC<ITabConfirmPaymentProps> = (props) => {

    const {
        planSelected,
        selectedMethod,
        description,
        typeOfPayment,
        planType,
        setTabIndex,
        onPaymentComplete
    } = props

    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [messageStatus, setMessageStatus] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [priceTotalToPay, setPriceTotalToPay] = useState<number>(0)
    const [subscriptionDays, setSubscriptionDays] = useState<number>(typeOfPayment === 'anual' ? 364 : 30)

    const { toastMessage, ToastStatus } = useToastMessage()

    const userSession = useUserSessionStore(state => state.userSession)

    const ekwanzaReference = usePaymentStore(state => state.ekwanzaReference)
    const requestEkwanzaPayment = usePaymentStore(state => state.requestEkwanzaPayment)
    const requestMulticaixaExpressPayment = usePaymentStore(state => state.requestMulticaixaExpressPayment)
    const checkEkwanzaPayment = usePaymentStore(state => state.checkEkwanzaPayment)
    const setClearStoragePayment = usePaymentStore(state => state.setClearStoragePayment)
    const totalToBuyStorage = usePaymentStore(state => state.totalToBuyStorage)
    const qtdMonthToBuyStorage = usePaymentStore(state => state.qtdMonthToBuyStorage)

    const createSubscription = useSubscriptionStore(state => state.createSubscription)

    useEffect(() => {
        if (planSelected) {
            if (totalToBuyStorage > 0) {
                setPriceTotalToPay(totalToBuyStorage)
                setSubscriptionDays(qtdMonthToBuyStorage * 30.3)
            } else if (planSelected.anualPrice && planSelected.monthyPrice) {
                setPriceTotalToPay(typeOfPayment === 'anual' ? planSelected.anualPrice * 12 : planSelected.monthyPrice)
                setSubscriptionDays(typeOfPayment === 'anual' ? 364 : 30)
            }
        }
    }, [planSelected, typeOfPayment, qtdMonthToBuyStorage])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(event.target.value);
    };

    function handleFinalOperation(accountId: string, planSelected: PlanType, expiration: Date) {
        return new Promise((resolve, reject) => {
            if (planType === "subscription") {
                createSubscription(accountId, planSelected, planSelected.planName as StorageString, "subscription", expiration)
                    .then(resolve)
                    .catch(reject)
            } else {
                createSubscription(accountId, planSelected, planSelected.planName as StorageString, "storage", expiration)
                    .then(resolve)
                    .catch(reject)
            }
        })
    }

    function handleRequestPayment() {
        if (userSession && planSelected) {
            setIsLoading(true);
            if (selectedMethod === '1') {
                requestEkwanzaPayment({
                    phoneNumber,
                    amount: priceTotalToPay,
                    env: 'dev'
                })
                    .then(() => {
                        setIsLoading(false);
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toastMessage({
                            title: 'Subscrição | ZenTaak',
                            description: error,
                            statusToast: ToastStatus.WARNING,
                            position: 'bottom'
                        });
                    })
            } else {
                requestMulticaixaExpressPayment(userSession.id, planSelected, {
                    pos: 194850,
                    amount: priceTotalToPay,
                    orderOrigin: 'MOBILE',
                    currency: 'AOA',
                    merchantReferenceNumber: new Date().getTime().toString(),
                    paymentInfo: {
                        mobile: {
                            phoneNumber
                        }
                    },
                    env: 'prd'
                })
                    .then(() => {
                        const expiration = new Date().addDaysToGetDateOfSubscription(subscriptionDays)
                        handleFinalOperation(userSession.id, planSelected, expiration)
                            .then(() => {
                                setIsLoading(false)
                                setTabIndex(0)
                                onPaymentComplete()
                            })
                            .catch(error => {
                                toastMessage({
                                    title: 'Subscrição | ZenTaak',
                                    description: error,
                                    statusToast: ToastStatus.ERROR,
                                    position: 'bottom'
                                });
                            })
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toastMessage({
                            title: 'Subscrição | ZenTaak',
                            description: error,
                            statusToast: ToastStatus.WARNING,
                            position: 'bottom'
                        });
                    })
            }
        }
    }

    function handleCheckEkwanzaPayment() {
        if (userSession && planSelected) {
            setCheckingPayment(true)

            checkEkwanzaPayment(userSession.id, planSelected)
                .then(response => {
                    if (response.status === 0) {
                        setMessageStatus("O pagamento ainda não foi concluído")
                    } else if (response.status === 2) {
                        setMessageStatus("O pagamento foi cancelado")
                        setTimeout(() => {
                            handleBack()
                        }, 1500);
                    } else if (response.status === 3) {
                        setMessageStatus("A referência expirou.")
                        setTimeout(() => {
                            handleBack()
                        }, 1500);
                    } else {
                        const expiration = new Date().addDaysToGetDateOfSubscription(subscriptionDays)
                        handleFinalOperation(userSession.id, planSelected, expiration)
                            .then(() => {
                                setTabIndex(0)
                                onPaymentComplete()
                            })
                            .catch(error => {
                                toastMessage({
                                    title: 'Subscrição | ZenTaak',
                                    description: error,
                                    statusToast: ToastStatus.ERROR,
                                    position: 'bottom'
                                });
                            })
                    }
                    setCheckingPayment(false)
                })
                .catch(error => {
                    setCheckingPayment(false)
                    toastMessage({
                        title: 'Subscrição | ZenTaak',
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: 'bottom'
                    });
                })
        }
    }

    function handleBack() {
        setTabIndex(0)
        setMessageStatus("")
        setClearStoragePayment()
    }

    return (
        <>
            <ModalHeader
                alignItems={'center'}
                justifyContent={'center'}
                display={'flex'}
                flexDir={'column'}
                gap={4}
            >
                <Image
                    src={selectedMethod === '1' ? '/logo_ekwanza.png' : '/mcx_logo.png'}
                    height={16}
                />
                <Heading
                    as='h3'
                    size='lg'
                >
                    {`Pagar com ${selectedMethod === '1' ? 'E-KWANZA' : 'Multicaixa Express'}`.toUpperCase()}
                </Heading>
            </ModalHeader>

            <ModalBody>
                <VStack
                    gap={4}
                >
                    <Text>{description}</Text>
                    <InputGroup>
                        <InputLeftAddon>
                            +244
                        </InputLeftAddon>
                        <Input
                            type='text'
                            value={phoneNumber}
                            onChange={handleChange}
                            p={2}
                            placeholder='Número de telefone'
                        />
                    </InputGroup>
                    {
                        isLoading ?
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='#97321F'
                                size='xl'
                            />
                            :
                            <VStack
                                w={'full'}
                            >
                                {/* {<Text>{`O pagamento expirará em: ${formattedTime}`}</Text>} */}
                                <GroupButtons
                                    onConfirm={handleRequestPayment}
                                    isDisabled={phoneNumber.length !== 9}
                                    buttonTitle={"Continuar"}
                                    onBack={handleBack}
                                />
                            </VStack>
                    }
                    {
                        ekwanzaReference !== 0 && selectedMethod === '1' ?
                            <EkwanzaReferenceAndQrCode
                                reference={ekwanzaReference}
                                qrcodeString='qwertyuiop'
                                messageStatus={messageStatus}
                                checkingPayment={checkingPayment}
                                onCheckPayment={handleCheckEkwanzaPayment}
                            />
                            :
                            null
                    }
                </VStack>
            </ModalBody>
        </>
    )
}