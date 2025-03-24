import { ZenTaakIcon } from "@/react-icons";
import { FormAuth } from "@/src/enums/FormAuth";
import { Collapse, VStack, FormControl, FormLabel, Input, FormHelperText, Button, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

interface CreateEmailAccountForm {
    showAuthForm: FormAuth
    email: string
    password: string
    fullName: string
    onChangeFullName: (arg: string) => void
    onChangeEmail: (arg: string) => void
    onChangePassword: (arg: string) => void
}

export default function CreateEmailAccountForm(props: CreateEmailAccountForm): JSX.Element {

    const {
        showAuthForm,
        fullName,
        email,
        password,
        onChangeFullName,
        onChangeEmail,
        onChangePassword
    } = props

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement> | undefined) {
        if (e) {
            onChangeEmail(e.target.value)
        }
    }

    function handleFullName(e: React.ChangeEvent<HTMLInputElement> | undefined) {
        if (e) {
            onChangeFullName(e.target.value)
        }
    }

    function handleChangePassword(e: React.ChangeEvent<HTMLInputElement> | undefined) {
        if (e) {
            onChangePassword(e.target.value)
        }
    }

    return (
        <Collapse in={showAuthForm === FormAuth.EMAIL_REGISTER}>
            <VStack
                gap={4}
            >
                <FormControl isRequired>
                    <FormLabel>Nome completo</FormLabel>
                    <Input type="text" name="userFullName" onChange={handleFullName} value={fullName} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>E-mail</FormLabel>
                    <Input type="email" name="userEmail" onChange={handleChangeEmail} value={email} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Palavra-passe</FormLabel>
                    <InputGroup size='md'>
                        <Input 
                            type={show ? 'text' : 'password'}
                            name="userPassword" 
                            onChange={handleChangePassword} 
                            value={password} 
                        />
                        <InputRightElement width='4.5rem'>
                            <ZenTaakIcon 
                                package={"githubocticonsicons"} 
                                name={show ? 'GoEye' : 'GoEyeClosed'}
                                onClick={handleClick}
                                size={18}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormHelperText
                        fontSize={'12'}
                        color={'red.200'}
                    >
                        Deve conter pelo menos um número, uma letra maiúscula e um símbolo.
                    </FormHelperText>
                </FormControl>
            </VStack>
        </Collapse>
    )
}