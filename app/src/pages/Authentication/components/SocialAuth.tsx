import { ZenTaakIcon } from "@/react-icons"
import { ToqueButton } from "@/src/components/Button"
import { Box, Text, Link } from "@chakra-ui/react"

interface SocialAuth {
    googleTitleButton: string
    phoneNumberTitleButton: string
    emailTitleButton: string
    type: number
    hasAlreadyAccount: (type: boolean) => void
    onGoogleSignIn: () => void
}

export default function SocialAuth(props: SocialAuth): JSX.Element {

    const {
        type,
        googleTitleButton,
        onGoogleSignIn,
        hasAlreadyAccount
    } = props

    function handleHasAlreadyAccount() {
        hasAlreadyAccount(false)
    }

    return (
        <>
            <ToqueButton
                variant="secondary"
                width="100%"
                mt="5"
                onClick={onGoogleSignIn}
            >
                <ZenTaakIcon package="flatcolor" name="FcGoogle" size={16} />
                <Text ml="3">{googleTitleButton}</Text>
            </ToqueButton>
            {
                type === 1 ?
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        mt="5"
                        fontSize="13px"
                        onClick={handleHasAlreadyAccount}
                    >
                        <Text mr="1">Ainda não tem uma conta?</Text>
                        <Link color="red.100">
                            Crie agora!
                        </Link>
                    </Box>
                    :
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        mt="5"
                        fontSize="13px"
                        onClick={handleHasAlreadyAccount}
                    >
                        <Text mr="1">Já tens uma conta?</Text>
                        <Link color="red.100">
                            Entre agora!
                        </Link>
                    </Box>
            }
        </>
    )
}