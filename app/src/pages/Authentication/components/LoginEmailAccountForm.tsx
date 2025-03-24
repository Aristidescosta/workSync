import { FormAuth } from "@/src/enums/FormAuth";
import { Collapse, Box, FormControl, FormLabel, Input, Link } from "@chakra-ui/react";

interface LoginEmailAccountForm {
    showAuthForm: FormAuth
    email: string
    password: string
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onChangeEmail: (arg: string) => void
    onChangePassword: (arg: string) => void
    onClickToRecoverPassword: () => void
}

export default function LoginEmailAccountForm(props: LoginEmailAccountForm): JSX.Element {

    const {
        showAuthForm,
        email,
        password,
        onChangeEmail,
        onKeyDown,
        onChangePassword,
        onClickToRecoverPassword
    } = props

    function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeEmail(e.target.value)
    }

    function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        onChangePassword(e.target.value)
    }

    return (
        <Collapse in={showAuthForm === FormAuth.EMAIL_LOGIN}>
        <Box>
            <FormControl mb={'4'}>
                <FormLabel>Email</FormLabel>
                <Input  type="email" name="userEmail" onChange={handleChangeEmail} value={email} onKeyDown={onKeyDown} />
            </FormControl>

            <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input type="password" name="userPassword" onChange={handleChangePassword} value={password} onKeyDown={onKeyDown}/>
            </FormControl>
            <Link
                display="block"
                fontSize="13"
                textAlign="right"
                textDecoration="none"
                color="#555"
                fontWeight="400"
                mt="10px"
                onClick={onClickToRecoverPassword}
            >
                Esqueceu sua senha?
            </Link>
        </Box>
    </Collapse>
    )
}