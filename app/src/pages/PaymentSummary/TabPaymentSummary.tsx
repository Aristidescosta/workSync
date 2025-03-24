import { Button, Flex, HStack, Heading, Image, ModalBody, ModalHeader, Radio, RadioGroup, Select, Stack, Text, useRadioGroup } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { PlanType, StoragePlanType } from '../../types/PlanType'

import { ToqueButton } from '../../components/Button'
import { RadioCard } from './components/RadioCard'
import { usePaymentStore } from '@/src/hooks/usePayment'


interface ITabPaymentSummaryProps {
    setTypeOfPayment: (typeOfPayment: string) => void
    setTabIndex: (index: number) => void
    onClose: () => void
    setSelectedMethod: (value: string) => void
    planType: "subscription" | "storage" | "notification",
    planSelected: PlanType | undefined
    expandingStorage: boolean
    typeOfPayment: string
    selectedMethod: string
}

export const TabPaymentSummary: React.FC<ITabPaymentSummaryProps> = (props) => {

    const {
        selectedMethod,
        typeOfPayment,
        expandingStorage,
        planSelected,
        planType,
        setSelectedMethod,
        onClose,
        setTabIndex,
        setTypeOfPayment
    } = props

    const [qtd, setQtd] = useState<number>(1)

    const setTotalToBuyStorage = usePaymentStore(state => state.setTotalToBuyStorage)
    const setQtdMonthToBuyStorage = usePaymentStore(state => state.setQtdMonthToBuyStorage)

    useEffect(() => {
        if (planType === "storage") {
            setQtdMonthToBuyStorage(qtd)
            setTotalToBuyStorage(planSelected?.anualPrice as number * qtd)

            return () => {
                setQtdMonthToBuyStorage(0)
                setTotalToBuyStorage(0)
            }
        }
    }, [qtd])

    const options = ['mensal', 'anual']
    const { getRadioProps } = useRadioGroup({
        name: 'plans',
        defaultValue: 'anual',
        onChange: setTypeOfPayment,
    })

    function handleQtd(e: React.ChangeEvent<HTMLSelectElement>) {
        setQtd(parseInt(e.target.value))
    }

    return (
        <>
            <ModalHeader>
                <Flex alignItems={'center'} justifyContent={'center'} display={'flex'} flexDir={'column'}>
                    <Heading as='h3' size='lg'>Sumário de pagamento</Heading>
                    {
                        planType === "subscription" ?
                            <Flex bg={'#F4F4F4'} mt={8} borderRadius={15}>
                                {options.map((value) => {
                                    const radio = getRadioProps({ value })
                                    return (
                                        <RadioCard key={value} {...radio}>
                                            {value.toUpperCase()}
                                        </RadioCard>
                                    )
                                })}
                            </Flex>
                            :
                            null
                    }
                </Flex>
            </ModalHeader>

            <ModalBody
                alignSelf={'flex-start'}
                gap={4}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                flexDir={'column'}
                w={'full'}
            >
                <Flex w={'full'} gap={16} justifyContent={'space-between'}>
                    <Flex flexDir={'column'}>
                        <Heading as='h4' size='md'>{`${planSelected?.planName}`}</Heading>
                        {
                            expandingStorage ?
                                <Text
                                    fontSize='md'
                                    fontWeight={'normal'}
                                >
                                    {`Armazenamento de ${(planSelected as StoragePlanType).storage.convertToSystemNumerical(true)}/mês`}
                                </Text>
                                :
                                <Text
                                    fontSize='md'
                                    fontWeight={'normal'}
                                >
                                    {`Plano ${planSelected?.planName}: ${(typeOfPayment === 'anual' ? planSelected?.anualPrice : planSelected?.monthyPrice)?.convertToKwanzaMoney()}/utilizador/mês`}
                                </Text>
                        }
                    </Flex>
                    {
                        planType === 'storage' ?
                            <Flex flexDir={'column'} textAlign={'end'}>
                                <Heading as='h4' size='md'>{(planSelected?.anualPrice as number * qtd)?.convertToKwanzaMoney()}</Heading>
                                <Select
                                    defaultValue={"x1"}
                                    onChange={handleQtd}
                                    variant='flushed'
                                >
                                    <option value={1}>x1</option>
                                    <option value={3}>x3</option>
                                    <option value={6}>x6</option>
                                    <option value={12}>x12</option>
                                </Select>
                            </Flex>
                            :
                            <Flex flexDir={'column'} textAlign={'end'}>
                                <Heading as='h4' size='md'>{(typeOfPayment === 'anual' ? planSelected?.anualPrice : planSelected?.monthyPrice)?.convertToKwanzaMoney()}</Heading>
                                <Text fontSize='md' fontWeight={'normal'}>{`x${typeOfPayment === 'anual' ? '12' : '1'}`}</Text>
                            </Flex>
                    }
                </Flex>

                <Flex
                    flexDir={'column'}
                    alignSelf={'flex-start'}
                    width={'full'}
                >
                    <Heading
                        size='md'
                        mb={2}
                    >
                        Pagar com
                    </Heading>
                    <RadioGroup defaultValue='1'>
                        <Stack
                            spacing={4}
                            width={'full'}
                        >
                            <HStack
                                justifyContent={'space-between'}
                            >
                                <Radio
                                    size={'lg'}
                                    value='1'
                                    _checked={{
                                        bgColor: '#97321F',
                                        border: 'none'
                                    }}
                                    borderColor={'#97321F'}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                >
                                    <Image
                                        src='/logo_ekwanza.png'
                                        height={7}
                                    />
                                </Radio>
                                <Heading
                                    as='h4'
                                    size='md'
                                    hidden={selectedMethod === '2'}
                                >
                                    {(typeOfPayment === 'anual' ? (planSelected?.anualPrice as number * 12) : planSelected?.monthyPrice)?.convertToKwanzaMoney()}
                                </Heading>
                            </HStack>
                            <HStack
                                justifyContent={'space-between'}
                            >
                                <Radio
                                    size={'lg'}
                                    value='2'
                                    _checked={{
                                        bgColor: '#ec6b08',
                                        border: 'none'
                                    }}
                                    borderColor={'#EC7008'}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                >
                                    <Flex
                                        gap={2}
                                        alignItems={'center'}
                                    >
                                        <Image h={6} src='/mcx_logo.png' />
                                        <Text
                                            color={'#ec6b08'}
                                            fontSize={'18'}
                                            fontWeight={'bold'}
                                        >
                                            Multicaixa Express
                                        </Text>
                                    </Flex>
                                </Radio>
                                <Heading
                                    as='h4'
                                    size='md'
                                    hidden={selectedMethod === '1'}
                                >
                                    {(typeOfPayment === 'anual' ? planSelected?.anualPrice as number * 12 : planSelected?.monthyPrice)?.convertToKwanzaMoney()}
                                </Heading>
                            </HStack>
                        </Stack>
                    </RadioGroup>
                </Flex>

                <ToqueButton
                    variant="info"
                    borderRadius="5px"
                    py="1.5rem"
                    width="15rem"
                    bg={selectedMethod === '1' ? '#97321F' : '#ec6b08'}
                    loadingText="Concluindo..."
                    isLoading={false}
                    mt={5}
                    w={'full'}
                    onClick={() => setTabIndex(1)}
                >
                    <Text ml="3">{`Continuar com ${selectedMethod === '1' ? 'E-KWANZA' : 'Multicaixa Express'}`.toUpperCase()}</Text>
                </ToqueButton>

                <Button
                    variant='link'
                    onClick={onClose}
                >
                    Cancelar
                </Button>
            </ModalBody>
        </>
    )
}