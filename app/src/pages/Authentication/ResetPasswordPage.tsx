import { ToqueButton } from '@/src/components/Button';
import { useUserSessionStore } from '@/src/hooks/useUserSession';
import { Box, Text, Input, FormControl, FormLabel, Image, InputGroup, IconButton, InputRightElement } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ResetPasswordPage(): JSX.Element {

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const refPassword = useRef<HTMLInputElement>(null);
    const refConfirmedPassword = useRef<HTMLInputElement>(null);

    const [info, setInfo] = useState<{ message: string, type: string }> ({ message: '', type: '' })

    const onResetPassWord = useUserSessionStore(state => state.onResetPassword)
    const history = useNavigate()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const oobCode = searchParams.get("oobCode");
    const codeRef = useRef<string | null>(null);

    useEffect(() => {
        codeRef.current = oobCode as string;
    }, [oobCode]);

    function resetPassword() {
        setLoading(true);

        const password = refPassword.current?.value as string;
        const confirmedPassword = refConfirmedPassword.current?.value as string;
        if (codeRef.current) {
            onResetPassWord(codeRef.current, password, confirmedPassword)
                .then((result) => {
                    setInfo(result);
                    setLoading(false);
                    history('/');
                })
                .catch((result) => {
                    setInfo(result);
                    setLoading(false);
                });
        } else {
            setInfo({message:'Código de redefinição de palavra-passe não disponível.', type:'error'});
            setLoading(false);
        }
    }

    const getColorByType = (type: string) => {
        switch (type) {
            case 'warning':
                return '#ff5f00';
            case 'success':
                return 'green.700';
            case 'error':
                return 'red.100';
            default:
                return 'black';
        }
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100vh'
        >
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                w='auto'
                h='auto'
                p={7}
                borderRadius='md'
                boxShadow='md'
                bg='white'
            >
                <Image src='/ZEN_TAAK_Vertical.jpg' alt='Zen Taak' bg={'#c9c'} width='160px'/>
                <Text fontSize='15px' mt='3' textAlign={'center'} color='gray.500' width='310px' >
                    Por motivos de segurança, nunca compartilhe sua palavra-passe com mais ninguém.
                </Text>
                <Text fontSize='15px' my='3' textAlign={'center'} color={getColorByType(info.type)} width='300px'>{info.message}</Text>
                <Box width='310px'>
                    <FormControl mb={5}>
                        <FormLabel fontSize='15px'mb={2}>Digite sua nova palavra-passe abaixo:</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                ref={refPassword}
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton
                                    aria-label={showPassword ? 'Esconder palavra-passe' : 'Mostrar palavra-passe'}
                                    onClick={() => setShowPassword(!showPassword)}
                                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                    bg='transparent'
                                    _hover={{ bg: 'transparent' }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel fontSize='15px' mb={2}>Confirma sua nova palavra-passe:</FormLabel>
                        <InputGroup>
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                ref={refConfirmedPassword}
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton
                                    aria-label={showConfirmPassword ? 'Esconder palavra-passe' : 'Mostrar palavra-passe'}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    bg='transparent'
                                    _hover={{ bg: 'transparent' }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <ToqueButton
                        variant='primary'
                        width='100%'
                        isLoading={loading}
                        _disabled={{ background: 'red.100', opacity: 0.5 }}
                        onClick={resetPassword}
                    >
                        Redefinir
                    </ToqueButton>
                </Box>
            </Box >
        </Box>
    );
}
