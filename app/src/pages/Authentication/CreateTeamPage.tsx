import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkSyncIcon } from '@/react-icons'
import { useToastMessage } from '@/react-toastify'
import { StepsAuth } from '@/src/enums/StepsAuth'
import { useUserSessionStore } from '@/src/hooks'
import { useTeamStore } from '@/src/hooks/useTeam'
import { handleFileAttached } from '@/src/utils/helpers'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
interface ICreateTeamPageProps {
    buttonText: string
    onCreateTeam?: () => void
}

export const CreateTeamPage = (props: ICreateTeamPageProps) => {
    const {
        buttonText,
        onCreateTeam
    } = props

    const [imageSelected, setImageSelected] = useState<string>()

    const teamName = useTeamStore(state => state.teamName)
    const setTeamName = useTeamStore(state => state.setTeamName)
    const createTeam = useTeamStore(state => state.createTeam)
    const loadingTeams = useTeamStore(state => state.loadingTeams)
    const setFileToUpload = useTeamStore(state => state.setFileToUpload)

    const user = useUserSessionStore(state => state.user)
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
                        title: err,
                        statusToast: ToastStatus.WARNING,
                        position: "top-right",
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
        <div className='flex flex-col gap-4 items-center justify-center'>
            {
                !imageSelected ?
                    <div
                        className='w-32 h-32 bg-[#999] flex items-center justify-center cursor-pointer'
                        onClick={() => document.getElementById('imageCover')?.click()}
                    >
                        <p className='text-center text-xs text-white'>
                            Clique para aplicar uma capa
                        </p>
                    </div>
                    :
                    <div className='relative cursor-pointer'>
                        <img src={imageSelected} alt="Imagem da equipa" className='w-32 h-32 bg-cover' />
                        <div className='absolute top-0 right-0 m-2 z-10 bg-primary p-2 rounded-md cursor-pointer' onClick={onDeleteImageOnPreview}>
                            <WorkSyncIcon
                                package='feather'
                                name='FiTrash'
                                color='#ff2a00'
                                size={16}
                            />
                        </div>
                    </div>
            }
            <input
                type='file'
                id='imageCover'
                onChange={previewImageTeam}
                accept='image/png, image/jpeg, image/jpg'
                hidden
            />
            <div className='flex flex-col gap-4 w-full'>
                <div className='flex flex-col gap-4 w-full'>
                    <Label>Nome da equipa</Label>
                    <Input
                        onChange={onChangeValue}
                        value={teamName}
                    />
                </div>
                <Button
                    variant={"secondary"}
                    disabled={teamName === "" || loadingTeams}
                    onClick={handleCreateTeam}
                >
                    {
                        loadingTeams ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <Label>Criando a equipa</Label>
                            </>
                        )
                            :
                            <Label>{buttonText}</Label>
                    }
                </Button>
            </div>
        </div>
    )
}
