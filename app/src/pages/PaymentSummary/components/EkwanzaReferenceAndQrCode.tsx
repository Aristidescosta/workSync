import { ZentaakButton } from "@/src/components/Button";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";

interface EkwanzaReferenceAndQrCode {
    reference: number
    qrcodeString: string
    messageStatus: string
    checkingPayment: boolean
    onCheckPayment: () => void
}

export default function EkwanzaReferenceAndQrCode(props: EkwanzaReferenceAndQrCode): JSX.Element {

    const {
        reference,
        qrcodeString,
        checkingPayment,
        messageStatus,
        onCheckPayment
    } = props

    return (
        <VStack
            w={'full'}
        >
            <Text>
                Pague por referência
            </Text>
            <Heading>
                {reference}
            </Heading>
            <Text>
                Ou
            </Text>
            <Image
                src="https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg"
                height={40}
            />
            <ZentaakButton
                variant="info"
                borderRadius="5px"
                py="1.5rem"
                bg={'#97321F'}
                loadingText="A verificar..."
                isLoading={checkingPayment}
                mt={5}
                w={'full'}
                onClick={onCheckPayment}
            >
                <Text 
                    textTransform={"uppercase"}
                >
                    Já autorizei
                </Text>
            </ZentaakButton>
            <Text 
                color={'red.200'}
                fontWeight={'bold'}
            >
                {messageStatus}
            </Text>
        </VStack>
    )
}