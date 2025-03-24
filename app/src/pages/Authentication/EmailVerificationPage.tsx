import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { ToqueButton } from "../../components/Button";
import { Box, Text, Button } from "@chakra-ui/react";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { StepsAuth } from "@/src/enums/StepsAuth";


export default function EmailVerificationPage(): JSX.Element {
    const resendEmailVerification = useUserSessionStore(state => state.sendEmailVerification)
    const { toastMessage, ToastStatus } = useToastMessage()
    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)

    function handleSendEmailVerification() {
        resendEmailVerification()
            .then(() => {
                toastMessage({
                    title: "Email de verificação de conta",
                    description: "E-mail enviado com sucesso",
                    statusToast: ToastStatus.SUCCESS,
                    position: "bottom"
                })
            })
            .catch(() => {
                toastMessage({
                    title: "Email de verificação de conta",
                    description: "Erro ao enviar e-mail",
                    statusToast: ToastStatus.ERROR,
                    position: "bottom"
                })
            })
    }

    function isVerified() {
        setStepsAuth(StepsAuth.AUTHENTICATION)
    }

    return (
        <Box
            w='100%'
            color='black'
            display='flex'
            flexDir='column'
        >
            Verifique a sua caixa de correio para confirmar o seu e-mail e validar a sua conta.
            <ToqueButton
                variant="primary"
                size="sm"
                mt="30px"
                onClick={isVerified}
                mr="10px"
            >
                <Text>
                    Já verifiquei
                </Text>
            </ToqueButton>

            <Button
                m={2}
                variant='link'
                onClick={handleSendEmailVerification}
            >
                <Text
                    as='u'
                    fontSize='12px'
                >
                    Reenviar e-mail de verificação.
                </Text>
            </Button>
        </Box>
    )
}