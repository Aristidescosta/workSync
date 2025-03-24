import { Modal as ChakraModal, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React from 'react'

export const ModalChoosePaymentMethod = () => {
    return (
        <ChakraModal
            isOpen={true}
            onClose={() => console.log('Boa sorte com isso')}

        >
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent
                borderRadius="none"
                position={'relative'}
                top={0}
                right={0}
            /* bg={background}
            height={height} */
            >
                <ModalHeader textAlign={'center'}>
                    <Text>Sumário de pagamento</Text>
                </ModalHeader>
            </ModalContent>
        </ChakraModal >
    )
}
