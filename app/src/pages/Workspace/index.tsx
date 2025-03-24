import React, { useEffect, useMemo, useState } from 'react'

import { Box, Heading, Skeleton, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { useToastMessage } from '@/src/services/chakra-ui-api/toast'
import { useUserSessionStore } from '@/src/hooks/useUserSession'
import { useWorkspaceStore } from '@/src/hooks/useWorkspace'
import { ZentaakButton } from '@/src/components/Button'
import { useAppStore } from '@/src/hooks/useAppStore'
import { useTeamStore } from '@/src/hooks/useTeam'
import { ZenTaakIcon } from '@/react-icons'

import { ListCardableWorkspace } from './components/ListCardableWorkspace'
import { RowCardableWorkspace } from './components/RowCardableWorkspace'
import { ZenTaakModal } from '@/src/components/ZenTaakModal'
import { WorkspaceType } from '@/src/types/WorkspaceType'

import CreateWorkspacePage from '../Authentication/CreateWorkspacePage'
import { useSubscriptionStore } from '@/src/hooks/useSubscription'
import { ZenTaakPlanType } from '@/src/types/PlanType'

export const WorkspacePage: React.FC = () => {

    const [workspace, setWorkspace] = useState<WorkspaceType | undefined>(undefined);
    const [modalText, setModalText] = useState('Adicionar workspace');
    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
    const [viewOpenWorkspaces, setviewOpenWorkspaces] = useState(false);
    const [totalOpenWorkspaces, setTotalOpenWorkspaces] = useState<number>(0)
    const [totalClosedWorkspaces, setTotalClosedWorkspaces] = useState<number>(0)

    const SESSION = useUserSessionStore(state => state.userSession)

    const onAuthOpen = useAppStore(state => state.onModalOpen)

    const team = useTeamStore(state => state.team)

    const subscription = useSubscriptionStore(state => state.subscription)

    const toggleWorkspaces = (value: boolean) => {
        setviewOpenWorkspaces(value);
    };

    const creatingWorkspace = {
        get conditionalForCreateWorkspaces(): boolean | undefined {
            return subscription?.expiration && ((subscription.package as ZenTaakPlanType)?.feature.workspacesNumber === 0 ||
                (subscription.package as ZenTaakPlanType)?.feature.workspacesNumber > workspaces.length)
        },

        get workspacesNumber(): number {
            if ((subscription?.package as ZenTaakPlanType)?.feature.workspacesNumber === 0) {
                return 100000000000000000000000000000000000
            }

            return (subscription?.package as ZenTaakPlanType)?.feature.workspacesNumber
        }
    }

    const {
        setWorkspaceDescription,
        observingAllWorkspaces,
        setWorkspaceName,
        loadingWorkspaces,
    } = useWorkspaceStore();

    const { toastMessage, ToastStatus } = useToastMessage();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {

        if (team) {
            const unsubscribe = observingAllWorkspaces(team.teamId, (workspace, isRemoving) => {
                if (workspace) {
                    setWorkspaces(state => [...state, workspace])
                }
            })

            return () => {
                setWorkspaces([])
                unsubscribe()
            }
        }

    }, [team, workspace])

    useEffect(() => {

        setTotalOpenWorkspaces(workspaces.filter(workspace => !workspace.isClosed).length)
        setTotalClosedWorkspaces(workspaces.filter(workspace => workspace.isClosed).length)

    }, [workspaces.length])

    const onCloseAndClearInputs = () => {
        setWorkspace(undefined)
        setWorkspaceDescription('')
        setWorkspaceName('')
        onClose();
    }

    const onOpenWorkspace = () => {
        if (SESSION) {
            if (!SESSION.isEmailVerified) {
                toastMessage({
                    title: "Email não verificado.",
                    description: "Para criar um workspace, precisa verificar a sua conta.",
                    statusToast: ToastStatus.WARNING,
                    position: "bottom"
                });
            } else {
                onOpen();
            }
        } else {
            onAuthOpen();
        }
    };

    const handleOpenModalWorkspace = () => {
        onOpen();
        setModalText('Editar workspace');
    };

    const toogleStatusWorkspace = (workspace: WorkspaceType): WorkspaceType => {
        return { ...workspace, isClosed: !workspace.isClosed, updatedAt: new Date() };
    }

    return (
        <Box>
            <Box
                bg="white"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
				px={10}
                h={'7vh'}
            >
                <Heading as='h1' fontSize={'22px'}>
                    Workspaces
                </Heading>
                {
                    team?.owner.session.id === SESSION?.id && creatingWorkspace.conditionalForCreateWorkspaces ?
                        <ZentaakButton
                            variant="info"
                            borderRadius="5px"
                            py="1.5rem"
                            width="15rem"
                            bg={'red.100'}
                            onClick={onOpenWorkspace}
                            loadingText="A criar tarefa"
                            isLoading={false}
                        >
                            <ZenTaakIcon
                                package="feather"
                                name="FiPlusSquare"
                                color="#fff"
                                size={16}
                            />
                            <Text ml="3">Adicionar Workspace</Text>
                        </ZentaakButton>
                        :
                        null
                }
            </Box>

            <Box>
                {loadingWorkspaces ?
                    <Stack px="70px" pt="30">
                        <Skeleton height="30px" />
                        <Skeleton height="30px" />
                        <Skeleton height="30px" />
                    </Stack>
                    :
                    workspaces.length === 0 ? <Box
                        justifyContent="center"
                        alignItems="center"
                        display="flex"
                        height="50vh"
                    >
                        <Heading>Nenhum workspace registado</Heading>
                    </Box>
                        :
                        <ListCardableWorkspace
                            totalClosedWorkspaces={totalClosedWorkspaces}
                            totalOpenWorkspace={totalOpenWorkspaces}
                            workspaces={workspaces.slice(0, creatingWorkspace.workspacesNumber).filter(workspace => workspace.isClosed === viewOpenWorkspaces)}
                            onRender={(workspace) => (
                                <RowCardableWorkspace
                                    key={workspace.workspaceId}
                                    workspace={workspace}
                                    handleOpenModalWorkspace={handleOpenModalWorkspace}
                                    toogleStatusWorkspace={toogleStatusWorkspace}
                                    setWorkspace={setWorkspace}
                                />
                            )}
                            toggleWorkspaces={toggleWorkspaces}
                        />
                }
            </Box>
            <ZenTaakModal
                isOpen={isOpen}
                position='relative'
                subtitle='Insira os detalhes do workspace'
                title={modalText}
                onClose={onCloseAndClearInputs}
            >
                <CreateWorkspacePage workspace={workspace} onClose={onCloseAndClearInputs} />
            </ZenTaakModal>
        </Box>
    )
}