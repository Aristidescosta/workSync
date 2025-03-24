import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { ZentaakButton } from '../../../components/Button'

interface IPaymentCardProps {
    buttonTitle: string
    isDisabled: boolean
    onConfirm: () => void
    onBack: () => void
}

export const GroupButtons: React.FC<IPaymentCardProps> = (props) => {

    const { 
        onBack, 
        isDisabled, 
        onConfirm, 
        buttonTitle 
    } = props

    return (
        <Flex gap={4} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDir={'column'} w={'full'}>
            <ZentaakButton
                variant="info"
                borderRadius="5px"
                py={6}
                width="15rem"
                bg={'#97321F'}
                loadingText="Concluindo..."
                isLoading={false}
                w={'full'}
                onClick={onConfirm}
                isDisabled={isDisabled}
            >
                <Text ml="3">{buttonTitle}</Text>
            </ZentaakButton>
            <ZentaakButton
                variant='ghost'
                px={6}
                onClick={onBack}
            >
                <Text ml="3">Fechar</Text>
            </ZentaakButton>
        </Flex>
    )
}