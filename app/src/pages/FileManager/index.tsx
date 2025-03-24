import React, { useEffect, useState } from 'react'

import { useToastMessage } from '@/src/services/chakra-ui-api/toast'
import { AttachmentFileType } from '@/src/types/AttachmentFileType'
import { useUserSessionStore } from '@/src/hooks/useUserSession'
import { useAttachmentStore } from '@/src/hooks/useAttachment'
import { useWorkspaceStore } from '@/src/hooks/useWorkspace'
import { ModalDelete } from '@/src/components/ModalDelete'
import { Box, Button, Heading, Modal, ModalBody, ModalContent, ModalOverlay, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { useStorage } from '@/src/hooks/useStorage'
import { useTeamStore } from '@/src/hooks/useTeam'

import { ModalUploadFiles } from './components/ModalUploadFiles'
import { StoragePageBody } from './components/StoragePageBody'
import { StorageStats } from './components/StorageStats'
import { StorageHeaderPage } from './StorageHeaderPage'
import PackagePlanPage from '../Package/PackagePlanPage'
import PaymentSummary from '../PaymentSummary'
import { PlanType } from '@/src/types/PlanType'
import { useSubscriptionStore } from '@/src/hooks/useSubscription'


export const StoragePage: React.FC = () => {
    const { attachmentsFile, observingAllAttachments, deleteAttachments, addAttachmentDocuments } = useAttachmentStore()
    const { totalSpace, totalSpaceUsed, observingSpaces } = useStorage()
    const { toastMessage, ToastStatus } = useToastMessage()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isPackagePageOpen, onOpen: onPackagePageOpen, onClose: onPackagePageClose } = useDisclosure();
    const { isOpen: isResumePaymentOpen, onOpen: onResumePaymentOpen, onClose: onResumePaymentClose } = useDisclosure();

    const setAttachmentsFile = useAttachmentStore(state => state.setAttachmentsFile)

    const userSession = useUserSessionStore(state => state.userSession)

    const workspace = useWorkspaceStore(state => state.workspace)

    const team = useTeamStore(state => state.team)

    const observingSubscription = useSubscriptionStore(state => state.observingSubscription)

    const [modalTitle, setModalTitle] = useState('Tem a certeza que deseja excluir?');
    const [buttonTitle, setButtonTitle] = useState('Apagar selecionados');
    const [searchAttachement, setSearchAttachement] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>()
    const [typeOfPayment, setTypeOfPayment] = useState<string>('unico')
    const [selectedMethod, setSelectedMethod] = useState('1')

    const [seletedDeleteAttachments, setSeletedDeleteAttachments] = useState<AttachmentFileType[]>([])
    const [seletedAttachments, setSeletedAttachments] = useState<AttachmentFileType[]>([])
    const [attachments, setAttachments] = useState<AttachmentFileType[]>([])

    const [isSelectAllDeleteChecked, setIsSelectAllDeleteChecked] = useState(false);
    const [isDeletedIndeterminate, setDeletedIsIndeterminate] = useState(false);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [isIndeterminate, setIsIndeterminate] = useState(false);

    const [IsItToEmptyTheTrash, setIsItToEmptyTheTrash] = useState<boolean>(false);
    const [isOpenModalUpload, setIsOpenModalUpload] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const allAttachments = attachments.filter(attachment => !attachment.wasDeleted)
    const deletedAttachments = attachments.filter(attachment => attachment.wasDeleted)
    const filteredAttachements = searchAttachement.length > 0
        ? allAttachments.filter(attachment => attachment.fileName.toLowerCase().includes(searchAttachement.toLowerCase()))
        : []

    const filteredAttachementsDeleted = searchAttachement.length > 0
        ? deletedAttachments.filter(attachment => attachment.fileName.toLowerCase().includes(searchAttachement.toLowerCase()))
        : []

    useEffect(() => {
        if (IsItToEmptyTheTrash) {
            onOpenModalDeleteAttachment();
        }
    }, [IsItToEmptyTheTrash]);

    useEffect(() => {
        setIsSelectAllChecked(allAttachments.filter(attachment => !attachment.taskId).length > 0 && seletedAttachments.filter(attachment => !attachment.taskId).length === allAttachments.filter(attachment => !attachment.taskId).length);
        setIsSelectAllDeleteChecked(deletedAttachments.length > 0 && seletedDeleteAttachments.length === deletedAttachments.length);
        setIsIndeterminate(seletedAttachments.length > 0 && seletedAttachments.length < allAttachments.length)
        setDeletedIsIndeterminate(seletedDeleteAttachments.length > 0 && seletedDeleteAttachments.length < deletedAttachments.length)
    }, [seletedAttachments, seletedDeleteAttachments]);


    useEffect(() => {
        if (team) {
            const unsubscribe = observingAllAttachments(team.owner.session.id, (attachment, isRemoving, isUpdating) => {
                if (isUpdating) {
                    setAttachments(state => state.map(a => a.attachId === attachment.attachId ? attachment : a))
                } else if (isRemoving) {
                    setAttachments(state => state.filter(a => a.attachId !== attachment.attachId))
                } else {
                    setAttachments(state => [...state, attachment])
                }
            })

            return () => {
                setAttachments([])
                unsubscribe()
            }
        }
    }, [team])

    useEffect(() => {

        if (userSession) {
            const unsubscribe = observingSpaces(userSession.id)
            const planSubscribe = observingSubscription(userSession.id, "storage")
            
            return () => {
                planSubscribe()
                unsubscribe()
            }
        }
    }, [userSession])

    const createFiles = () => {
        console.log(userSession, attachmentsFile, workspace)
        if (userSession && attachmentsFile && workspace) {
            const totalFiles = attachmentsFile.length;
            let totalSize = 0;

            for (let i = 0; i < totalFiles; i++) {
                totalSize += attachmentsFile[i].size;
            }

            const updateTotalProgress = (uploadedSize: number) => {
                setUploadProgress(uploadedSize);
            };

            addAttachmentDocuments(userSession, workspace.workspaceId, updateTotalProgress)
                .then(() => {
                    setAttachmentsFile([])
                    onCloseModalUploads()
                    setUploadProgress(0)
                }).catch((error) => {
                    toastMessage({
                        title: error as string,
                        statusToast: ToastStatus.INFO,
                        position: "bottom",
                    });
                })
        }
    }

    const onOpenModalUploads = () => {
        if (userSession) {
            setIsOpenModalUpload(true)
        } else {
            toastMessage({
                title: "Selecione uma workspace para continuar",
                statusToast: ToastStatus.INFO,
                position: "bottom",
            });
        }
    }

    const onCloseModalUploads = () => {
        setIsOpenModalUpload(false)
    }

    const onChooseTrash = () => {
        setButtonTitle('Restaurar selecionados')
        setModalTitle('Restaurar anexos')
    };

    const onChooseAttachment = () => {
        setButtonTitle('Apagar selecionados')
        setModalTitle('Tem a certeza que deseja excluir?')
    };

    const handleSeleteAttachment = (isChecked: boolean, attachment: AttachmentFileType) => {
        const attachmentsToUpdate = buttonTitle.includes('Apagar') ? seletedAttachments : seletedDeleteAttachments;
        const onSetAttachments = buttonTitle.includes('Apagar') ? setSeletedAttachments : setSeletedDeleteAttachments;
        if (isChecked) {
            onSetAttachments([...attachmentsToUpdate, { ...attachment, wasDeleted: !attachment.wasDeleted }]);
        } else {
            onSetAttachments(attachmentsToUpdate.filter(attachmentFiltered => attachmentFiltered.attachId !== attachment.attachId));
        }
    };

    const onOpenCloseDeleteAttachment = () => {
        setIsItToEmptyTheTrash(false);
        onClose()
    }

    const onOpenModalDeleteAttachment = () => {
        const isToErase = buttonTitle.includes('Apagar');
        const selectedAttachments = isToErase ? seletedAttachments : seletedDeleteAttachments;
        const messageTitle = 'Nenhum anexo selecionado';

        if (selectedAttachments.length === 0 && !IsItToEmptyTheTrash) {
            toastMessage({
                statusToast: ToastStatus.INFO,
                title: messageTitle,
                position: 'top-right'
            });
        } else {
            onOpen();
        }
    };

    const handleDeleteOrRestore = (option: number) => {
        if (userSession && team && workspace) {
            let isToErase = false;
            const isOnTrash = buttonTitle.includes('Restaurar')

            switch (option) {
                case 0:
                    isToErase = false;
                    break;
                case 1:
                    isToErase = true;
                    break;
            }
            setIsLoading(true);


            if (!isOnTrash) {
                console.log('Estou aqui para eliminar');
                deleteAttachments(workspace.workspaceId, team.owner.session.email, seletedAttachments, isToErase)
                    .then(() => {
                        setSeletedDeleteAttachments([])
                        setSeletedAttachments([])
                    })
                    .catch(error => {
                        toastMessage({
                            title: "Gestão de armazenamento",
                            description: error,
                            statusToast: ToastStatus.WARNING,
                            position: "bottom",
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                        onOpenCloseDeleteAttachment()
                    });
            } else {

                const items = IsItToEmptyTheTrash ? deletedAttachments : seletedDeleteAttachments;

                deleteAttachments(workspace.workspaceId, team.owner.session.email, items, isToErase)
                    .then(() => {
                        setSeletedAttachments([])
                        setSeletedDeleteAttachments([])
                    })
                    .catch(error => {
                        toastMessage({
                            title: "Gestão de armazenamento",
                            description: error,
                            statusToast: ToastStatus.WARNING,
                            position: "bottom",
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                        onOpenCloseDeleteAttachment()
                    });
            }
        } else {
            toastMessage({
                title: "Selecione uma workspace para constinuar",
                statusToast: ToastStatus.INFO,
                position: "bottom",
            });
        }
    };

    const onSelectedAllAttachment = (isChecked: boolean) => {
        const onSetAttachments = buttonTitle.includes('Apagar') ? setSeletedAttachments : setSeletedDeleteAttachments;
        const attachmentsToUpdate = buttonTitle.includes('Apagar') ? allAttachments : deletedAttachments;

        if (isChecked) {
            const allSelected = attachmentsToUpdate.every(attachment => seletedAttachments.includes(attachment));

            if (allSelected) {
                onSetAttachments(prev => prev.filter(attachment => !attachmentsToUpdate.includes(attachment)));
            } else {
                const updatedSelection = attachmentsToUpdate
                    .filter(attachment => !attachment.taskId)
                    .map(attachment => ({
                        ...attachment,
                        wasDeleted: !attachment.wasDeleted
                    }));
                onSetAttachments(prev => [...prev, ...updatedSelection]);
            }
        } else {
            onSetAttachments(prev => prev.filter(attachment => !attachmentsToUpdate.includes(attachment)));
        }
    };

    const emptyTheTrashcan = () => {
        setIsItToEmptyTheTrash(true);
    };

    function onPlanSelected(plan: PlanType) {
        setSelectedPlan(plan)
        onResumePaymentOpen()
    }

    function handlePaymentComplete() {
        onPackagePageClose()
        onResumePaymentClose()
    }

    return (
        <>
            <Box>
                <StorageHeaderPage
                    onPackagePageOpen={onPackagePageOpen}
                    onModalUploadFilesOpen={onOpenModalUploads}
                />
                <Box>
                    <StorageStats
                        totalSpace={totalSpace}
                        totalSpaceUsed={totalSpaceUsed}
                    />
                    <StoragePageBody
                        filteredAttachementsDeleted={filteredAttachementsDeleted}
                        seletedDeleteAttachments={seletedDeleteAttachments}
                        isSelectAllDeleteChecked={isSelectAllDeleteChecked}
                        isDeletedIndeterminate={isDeletedIndeterminate}
                        filteredAttachements={filteredAttachements}
                        isSelectAllChecked={isSelectAllChecked}
                        deletedAttachments={deletedAttachments}
                        seletedAttachments={seletedAttachments}
                        searchAttachement={searchAttachement}
                        isIndeterminate={isIndeterminate}
                        allAttachments={allAttachments}
                        buttonTitle={buttonTitle}
                        handleSeleteAttachment={handleSeleteAttachment}
                        onSelectedAllAttachment={onSelectedAllAttachment}
                        setSearchAttachement={setSearchAttachement}
                        onOpenModalDeleteAttachment={onOpenModalDeleteAttachment}
                        onChooseAttachment={onChooseAttachment}
                        emptyTheTrashcan={emptyTheTrashcan}
                        onChooseTrash={onChooseTrash}
                    />
                </Box>
            </Box>
            {
                isOpen && <ModalDelete
                    isOpen={isOpen}
                    onCloseModal={onOpenCloseDeleteAttachment}
                    primaryAction={handleDeleteOrRestore}
                    secondaryAction={modalTitle.includes('anexos') ? onOpenCloseDeleteAttachment : handleDeleteOrRestore}
                    title={IsItToEmptyTheTrash ? "Esvaziar a lixeira" : modalTitle}
                    subtitle={IsItToEmptyTheTrash ? 'Ao excluir não será possível recuperar' : modalTitle.includes('anexos') ? 'Restaurar todos os anexos selecionados?' : 'Essa operação é irreversível'}
                    buttonSecundaryTitle={modalTitle.includes('anexos') ? undefined : 'Mover para lixeira'}
                    buttonTitle={IsItToEmptyTheTrash ? 'Eliminar tudo' : modalTitle.includes('anexos') ? 'Restaurar' : 'Eliminar de forma permanente'}
                    loading={isLoading}
                />
            }

            {
                isOpenModalUpload && userSession && <ModalUploadFiles progress={uploadProgress} addFiles={createFiles} isOpen={isOpenModalUpload} onClose={onCloseModalUploads} />
            }
            <Modal
                isOpen={isPackagePageOpen}
                onClose={onPackagePageClose}
                size={'full'}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody
                        bg={"#F1F1F1"}
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Box>
                            <Heading size={'lg'}>ZenTaak Drive</Heading>
                            <Text>
                                Inclua mais armazenamento para os dados e funcionalidades das <br /> tarefas da sua equipa.
                            </Text>
                            <VStack
                                borderWidth={0.5}
                                boxSize={'lg'}
                                mt={4}
                                px={8}
                                pt={24}
                                pb={20}
                                justifyContent={'center'}
                                bg={'#fff'}
                            >
                                <PackagePlanPage
                                    planType='storage'
                                    noHeader
                                    onPlanSelected={onPlanSelected}
                                />
                            </VStack>
                        </Box>
                        <Button
                            variant={'link'}
                            my={4}
                            onClick={onPackagePageClose}
                        >
                            Cancelar
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
            {
                selectedPlan &&
                <PaymentSummary
                    planType='storage'
                    isOpenResumePayment={isResumePaymentOpen}
                    selectedPlan={selectedPlan}
                    expandingStorage={true}
                    typeOfPayment={typeOfPayment}
                    selectedMethod={selectedMethod}
                    handlePaymentComplete={handlePaymentComplete}
                    setTypeOfPayment={setTypeOfPayment}
                    setSelectedMethod={setSelectedMethod}
                    onCloseResumePayment={onResumePaymentClose}
                />
            }
        </>
    )
}
