import { ToqueButton } from "@/src/components/Button";
import { useIntegrationStore } from "@/src/hooks/useIntegration";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { Box, Flex, FormControl, FormLabel, Heading, Input, Switch, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";


export default function IntegrationWithGithub(): JSX.Element {
    const [repositoryWithWorkSpace, setRepositoryWithWorkSpace] = useState<boolean>(true)
    const [loadingIntegrationWithGithub, setLoadingIntegrationWithGithub] = useState<boolean>(false)

    const [info, setInfo] = useState<{ message: string, color: string }>({ message: '', color: '' })

    const { toastMessage, ToastStatus } = useToastMessage()

    const createGitHubIntegration = useIntegrationStore(state => state.createGitHubIntegration)
    const updateGitHubIntegration = useIntegrationStore(state => state.updateGitHubIntegration)
    const integrationWithGithub = useIntegrationStore(state => state.integrationWithGithub)
    const setIntegrationWithGithub = useIntegrationStore(state => state.setIntegrationWithGithub)

    const [userName, setUserName] = useState<string>(integrationWithGithub?.userName ?? '')
    const [repoName, setRepoName] = useState<string>(integrationWithGithub?.repoName ?? '')
    const [token, setToken] = useState<string>(integrationWithGithub?.token ?? '')
    const [id, setId] = useState<string>(integrationWithGithub?.id ?? '')

    const workspace = useWorkspaceStore(state => state.workspace)

    function onChangeUserName(e: React.ChangeEvent<HTMLInputElement>) {
        setUserName(e.target.value)
    }
    function onChangeRepoName(e: React.ChangeEvent<HTMLInputElement>) {
        const newRepoName = e.target.value;
        setRepoName(newRepoName);

        const hasSpaces = /\s/.test(newRepoName);

        if (hasSpaces) {
            setInfo({ message: 'O nome do repositório não pode conter espaços.', color: 'red' });
        } else {
            setInfo({ message: '', color: '' });
        }
    }

    function onChangeToken(e: React.ChangeEvent<HTMLInputElement>) {
        setToken(e.target.value)
    }

    function onSave() {
        setIntegrationWithGithub({id: id, userName: userName, repoName: repoName, token: token })
        setLoadingIntegrationWithGithub(true)
        createGitHubIntegration()
            .then(() => {
                toastMessage({
                    title: "Integração com o GitHub.",
                    description: 'Dados salvos com sucesso',
                    statusToast: ToastStatus.SUCCESS,
                    position: "bottom"
                })
                setLoadingIntegrationWithGithub(false)
            })
            .catch((error) => {
                console.log(error)
                if (typeof error == 'string') {
                    toastMessage({
                        title: "Integração com o GitHub.",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom"
                    })
                    setLoadingIntegrationWithGithub(false)
                } else {
                    toastMessage({
                        title: "Integração com o GitHub.",
                        description: 'Ocorreu algum erro inesperado!',
                        statusToast: ToastStatus.ERROR,
                        position: "bottom"
                    })
                    setLoadingIntegrationWithGithub(false)
                }
            });
    }

    function onEdit() {
        setLoadingIntegrationWithGithub(true)
        setIntegrationWithGithub({id: id, userName: userName, repoName: repoName, token: token })
        updateGitHubIntegration(repoName)
            .then(() => {
                toastMessage({
                    title: "Integração com o GitHub.",
                    description: 'Dados salvos com sucesso',
                    statusToast: ToastStatus.SUCCESS,
                    position: "bottom"
                })
                setLoadingIntegrationWithGithub(false)
            })
            .catch((error) => {
                console.log(error)
                if (typeof error == 'string') {
                    toastMessage({
                        title: "Integração com o GitHub.",
                        description: error,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom"
                    })
                    setLoadingIntegrationWithGithub(false)
                } else {
                    toastMessage({
                        title: "Integração com o GitHub.",
                        description: 'Ocorreu algum erro inesperado!',
                        statusToast: ToastStatus.ERROR,
                        position: "bottom"
                    })
                    setLoadingIntegrationWithGithub(false)
                }
            });
    }

    useEffect(() => {
        if (repositoryWithWorkSpace && workspace?.workspaceName) {
            const workspaceName = workspace?.workspaceName as string;

            const repoNameWithoutSpaces = workspaceName.replace(/\s/g, '-');

            setRepoName(repoNameWithoutSpaces);
            setId(workspace?.workspaceId as string)
        }
    }, [repositoryWithWorkSpace, workspace]);


    return (
        <Box w={'100%'} h={'90%'} p={'10px 20px'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
            <Heading as={'h2'} fontSize={'24px'} pb={'20px'} fontWeight={'500'}>Integração com Git Hub</Heading>

            <Flex w={'auto'} mb={'15px'} >
                <Text fontSize={'15px'} fontWeight={'500'}>Usar o nome do Workspace como nome do Repositório</Text>
                <Switch ml={'20px'} size='md' colorScheme='red' isChecked={repositoryWithWorkSpace} onChange={() => setRepositoryWithWorkSpace(!repositoryWithWorkSpace)} />
            </Flex>

            <Box width='400px'>
                <FormControl mb={5}>
                    <FormLabel fontSize='15px' mb={2}>Nome do utilizador:</FormLabel>
                    <Input
                        type='text'
                        w={'300px'}
                        h={'35px'}
                        onChange={onChangeUserName}
                        value={userName}
                    />
                </FormControl>
                <FormControl mb={5}>
                    <FormLabel fontSize='15px' mb={2}>Repositório:</FormLabel>
                    <Text fontSize='12px' color={info.color} width='300px'>{info.message}</Text>
                    <Input
                        isDisabled={repositoryWithWorkSpace}
                        type='text'
                        w={'300px'}
                        h={'35px'}
                        onChange={onChangeRepoName}
                        value={repoName}
                    />
                </FormControl>
                <FormControl mb={5}>
                    <FormLabel fontSize='15px' mb={2}>Token:</FormLabel>
                    <Input
                        type='text'
                        w={'300px'}
                        h={'35px'}
                        onChange={onChangeToken}
                        value={token}
                    />
                </FormControl>
            </Box>
            <ToqueButton
                variant='primary'
                mt={'auto'}
                width='150px'
                isLoading={loadingIntegrationWithGithub}
                _disabled={{ background: 'red.100', opacity: 0.5 }}
                onClick={integrationWithGithub ? onEdit : onSave}
            >
                {integrationWithGithub ? 'Editar' : 'Salvar'}
            </ToqueButton>
        </Box>
    )
}