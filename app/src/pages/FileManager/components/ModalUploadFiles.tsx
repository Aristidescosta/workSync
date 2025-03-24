import React from 'react'

import { useAttachmentStore } from '@/src/hooks/useAttachment';
import { ZenTaakModal } from '@/src/components/ZenTaakModal'
import { HStack, Progress, Text } from '@chakra-ui/react';
import { ToqueButton } from '@/src/components/Button';
import { useStorage } from '@/src/hooks/useStorage';

import Attachments from '../../Task/Attachments'
import { useSubscriptionStore } from '@/src/hooks/useSubscription';
import { ZenTaakPlanType } from '@/src/types/PlanType';

interface IModalUploadFilesProps extends iModalPage {
    addFiles: () => void;
    progress: number;
}

export const ModalUploadFiles: React.FC<IModalUploadFilesProps> = ({ progress, isOpen, onClose, addFiles }) => {

    const loadingAttachment = useAttachmentStore(state => state.loadingAttachment)
    const attachmentsFile = useAttachmentStore(state => state.attachmentsFile)
    const clearAttachements = useAttachmentStore(state => state.clearAttachements)
    const setAttachmentsFile = useAttachmentStore(state => state.setAttachmentsFile)

    const subscription = useSubscriptionStore(state => state.subscription)

    const handleClose = () => {
        clearAttachements()
        onClose()
    }

    const containedFileWhoExceededTheUploadLimit = attachmentsFile?.some(attachmentFile => attachmentFile.size > (subscription?.package as ZenTaakPlanType).feature.zenTaakDrive[1])
    const totalSize = attachmentsFile?.reduce(function (total, obj) {
        return total + obj.size
    }, 0) || 0;

    const { totalSpace, totalSpaceUsed } = useStorage()

    const spaceExceeded = (totalSpace - totalSpaceUsed) < totalSize

    return (
        <ZenTaakModal
            title={"Adicionar ficheiros"}
            subtitle="Selecione os ficheiros"
            isOpen={isOpen}
            position="relative"
            size="5xl"
            onClose={handleClose}
        >
            <Attachments
                onAttachments={setAttachmentsFile}
            />
            <Progress
                value={progress}
                colorScheme='red'
                borderRadius={10}
                hasStripe={true}
            />
            {
                spaceExceeded && <Text color={"#ff2a00"}>{`Os anexos selecionados excedem o espaço disponível. O espaço restante é de ${((totalSpace - totalSpaceUsed) < 0 ? 0 : (totalSpace - totalSpaceUsed)).convertToSystemNumerical(true)}. Os arquivos selecionados ocupam ${totalSize?.convertToSystemNumerical(true)}.`}</Text>
            }
            <HStack
                mt="20px"
                justifyContent="flex-end"
                width={'100%'}
            >
                <ToqueButton
                    variant="secondary"
                    width="20%"
                    borderColor={'red.100'}
                    color={'red.100'}
                    height="50px"
                    mr="20px"
                    onClick={onClose}
                    isDisabled={loadingAttachment}
                >
                    Fechar
                </ToqueButton>

                <ToqueButton
                    bg={'red.100'}
                    variant="info"
                    width="20%"
                    height="50px"
                    isLoading={loadingAttachment}
                    loadingText={"Carregando..."}
                    onClick={addFiles}
                    isDisabled={containedFileWhoExceededTheUploadLimit || spaceExceeded || !attachmentsFile || attachmentsFile.length === 0}
                >
                    Carregar ficheiros
                </ToqueButton>

            </HStack>
        </ZenTaakModal>
    )
}
