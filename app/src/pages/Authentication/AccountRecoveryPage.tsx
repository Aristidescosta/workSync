import { ZentaakButton } from "@/src/components/Button";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";


export default function AccountRecoveryPage(): JSX.Element {

    const refEmail = useRef<HTMLInputElement>(null);
    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)
    const setUserEmail = useUserSessionStore(state => state.setUserEmail)
    const resetPassWord = useUserSessionStore(state => state.resetPassword)

    const [loading, setLoading] = useState<boolean>(false)
    const [info, setInfo] = useState<string>('')

    function onSubmit() {
        setLoading(true)
        const email = refEmail.current?.value as string;
        setUserEmail(email)
        resetPassWord()
            .then((result) => {
                setInfo(result)
                setLoading(false);
            })
            .catch((result) => {
                setInfo(result)
                setLoading(false);
            });
    }
    
    function onBack() {
        setStepsAuth(StepsAuth.AUTHENTICATION)
    }

    return (
        <Box h={'350px'} >
            <IoArrowBack size={20} onClick={onBack} cursor={'pointer'} />
            <Text fontSize="15px" my="4" display="block" color="gray.400">
                Por favor, insira o endereço de e-mail vinculado à sua conta para que possamos enviar o link de recuperação de palavra-passe.
            </Text>
            <Text fontSize="15px" my="4" display="block" color="red.100">{info}</Text>
            <FormControl mb={'10'}>
                <FormLabel>Email</FormLabel>
                <Input id="email" type="email" ref={refEmail} />
            </FormControl>

            <ZentaakButton
                variant="primary"
                width="100%"
                mb="5"
                isLoading={loading}
                _disabled={{ background: "red.100", opacity: 0.5 }}
                onClick={onSubmit}
            >
                Enviar
            </ZentaakButton>
        </Box>
    );
}
