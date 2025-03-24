import { ZenTaakIcon } from "@/react-icons";
import { ToqueButton } from "@/src/components/Button";
import { StepsAuth } from "@/src/enums/StepsAuth";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useUserSessionStore } from "@/src/hooks/useUserSession";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";
import { handleFileAttached } from "@/src/utils/helpers";
import { Image, VStack, Input, FormControl, FormLabel, Spacer, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

interface CreateTeamPage {
    buttonText: string
    onCreateTeam?: () => void
}

export default function CreateTeamPage(props: CreateTeamPage): JSX.Element {

    const {
        buttonText,
        onCreateTeam
    } = props

    const [imageSelected, setImageSelected] = useState<string>()

    const teamName = useTeamStore(state => state.teamName)
    const setTeamName = useTeamStore(state => state.setTeamName)
    const createTeam = useTeamStore(state => state.createTeam)
    const setFileToUpload = useTeamStore(state => state.setFileToUpload)

    const user = useUserSessionStore(state => state.user)
    const loadingUserSession = useUserSessionStore(state => state.loadingUserSession)
    const setStepsAuth = useUserSessionStore(state => state.setStepsAuth)

    const { toastMessage, ToastStatus, } = useToastMessage();

    async function handleCreateTeam() {
        if (user) {
            createTeam(user)
                .then(() => {
                    if (onCreateTeam) {
                        onCreateTeam()
                        setTeamName("")
                    } else {
                        setStepsAuth(StepsAuth.CREATE_PROJECT)
                    }
                })
                .catch(err => {
                    toastMessage({
                        title: "Criar conta",
                        description: err,
                        statusToast: ToastStatus.WARNING,
                        position: "bottom",
                    });
                })
        }
    }

    function onChangeValue(e: React.ChangeEvent<HTMLInputElement>) {
        setTeamName(e?.target.value)
    }

    function previewImageTeam(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            handleFileAttached(file)
                .then(data => {
                    setImageSelected(data.filePath);
                    setFileToUpload(data.file);
                })
                .catch(console.error)
        }
    }

    function onDeleteImageOnPreview() {
        setImageSelected("")
        setFileToUpload(undefined)
    }

    return (
        <VStack>
            {
                !imageSelected ?
                    <Box
                        boxSize={"138px"}
                        bg={'#999'}
                        display={'flex'}
                        flexShrink={0}
                        justifyContent={'center'}
                        alignItems={'center'}
                        cursor={'pointer'}
                        onClick={() => document.getElementById('imageCover')?.click()}
                    >
                        <Text
                            textAlign={'center'}
                            color={'#fff'}
                            fontSize={'12'}
                        >
                            Clique para aplicar uma capa
                        </Text>
                    </Box>
                    :
                    <Box
                        position='relative'
                        cursor={'pointer'}
                    >
                        <Image
                            src={imageSelected}
                            boxSize='138px'
                            objectFit='cover'
                            alt='Imagem da equipa'
                        />
                        <Box
                            position='absolute'
                            top='0'
                            right='0'
                            margin='2'
                            zIndex='1'
                            bg={'#fff'}
                            p={'2'}
                            borderRadius={'8'}
                            cursor='pointer'
                            onClick={onDeleteImageOnPreview}
                        >
                            <ZenTaakIcon
                                package="feather"
                                name="FiTrash"
                                color="ff2a00"
                                size={16}
                            />
                        </Box>
                    </Box>
            }

            <Input
                type='file'
                id='imageCover'
                onChange={previewImageTeam}
                accept='image/png, image/jpeg, image/jpg'
                hidden
            />
            <VStack
                width={'100%'}
            >
                <Spacer />
                <FormControl>
                    <FormLabel>Nome da equipa</FormLabel>
                    <Input
                        type="text"
                        onChange={onChangeValue}
                        value={teamName}
                    />
                </FormControl>

                <ToqueButton
                    variant="primary"
                    width="100%"
                    mt="5"
                    isDisabled={teamName === ""}
                    isLoading={loadingUserSession}
                    _disabled={{ background: "red.100", opacity: 0.5 }}
                    onClick={handleCreateTeam}
                >
                    {buttonText}
                </ToqueButton>
            </VStack>
        </VStack>
    )
}