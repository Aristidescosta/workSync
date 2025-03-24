import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState } from 'react'

import { useToastMessage } from '@/src/services/chakra-ui-api/toast';
import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react'
import { useWorkspaceStore } from '@/src/hooks/useWorkspace';
import { WorkspaceType } from '@/src/types/WorkspaceType'
import { ZenTaakIcon } from '@/react-icons'

import { WorkspaceMenuContext } from './WorkspaceMenuContext'

interface IRowCardableWorkspaceProps {
    workspace: WorkspaceType;
    handleOpenModalWorkspace: () => void;
    toogleStatusWorkspace: (workspace: WorkspaceType) => WorkspaceType;
    setWorkspace: (workspace: WorkspaceType | undefined) => void;
}

export const RowCardableWorkspace: React.FC<IRowCardableWorkspaceProps> = ({ workspace, setWorkspace, handleOpenModalWorkspace, toogleStatusWorkspace }) => {
    const [isLoading, setIsloading] = useState(false);

    const { toastMessage, ToastStatus } = useToastMessage();
    const { editWorkspace } = useWorkspaceStore();

    const formatUpdatedAt = (updatedAt: any): string => {
        const dateObject = new Date(updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1e6);

        const difference = formatDistanceToNow(dateObject, { addSuffix: true, locale: ptBR });

        if (difference.includes('7 dias')) {
            return 'atualizado na semana passada';
        }

        if (difference.includes('ano')) {
            return format(dateObject, "'atualizado em' dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        }

        return `atualizado ${difference} atrás`;
    };

    const onChangeWorkspaceStatus = () => {
        setWorkspace(workspace)
        const EDITED_WORKSPACE = toogleStatusWorkspace(workspace)
        setIsloading(true)
        editWorkspace(EDITED_WORKSPACE)
            .then(() => {
                toastMessage({
                    title: "Editar Workspace",
                    description: 'Workspace fechado',
                    statusToast: ToastStatus.WARNING,
                    position: "bottom",
                });
                setWorkspace(undefined)
            })
            .catch(error => {
                toastMessage({
                    title: "Editar Workspace",
                    description: error,
                    statusToast: ToastStatus.WARNING,
                    position: "bottom",
                });
            })
            .finally(() => setIsloading(false))
    };

    const handleOpenMenu = (menuPosition: number) => {
        switch (menuPosition) {
            case 0:
                handleOpenModalWorkspace();
                setWorkspace(workspace);
                break;
            case 1:
                onChangeWorkspaceStatus();
                break;
        }
    }

    return (
        <HStack
            borderBottomWidth={1}
            borderColor={'gray.100'}
            py={3}
            pl={5}
            justifyContent={'space-between'}
            cursor={'pointer'}
            _hover={{
                bg: '#fafafa',
            }}
        >
            <Box
                w={'full'}
            >
                <Flex
                    alignItems={'center'}
                    gap={2}
                    justifyContent={'space-between'}
                >
                    <Flex alignItems={'flex-start'} gap={2} flexDir={'column'}>
                        <Flex alignItems={'center'} gap={2}>
                            <ZenTaakIcon
                                package='githubocticonsicons'
                                name='GoProjectSymlink'
                                size={18}
                            />
                            <Heading as={'h4'} fontSize={18}>{workspace.workspaceName}</Heading>
                        </Flex>
                        <Text fontSize={12} fontWeight={'normal'}># {formatUpdatedAt(workspace.updatedAt)}</Text>
                    </Flex>

                    <Text fontSize={18} fontWeight={'normal'}>{workspace.workspaceDescription}</Text>

                    <Flex mr={8}>
                        <WorkspaceMenuContext
                            menuIconButton={<ZenTaakIcon
                                package='githubocticonsicons'
                                name='GoKebabHorizontal'
                                size={18}
                            />}
                            onOpenMenu={handleOpenMenu}
                            isLoading={isLoading}
                            workspaceStatus={workspace.isClosed}
                        />
                    </Flex>
                </Flex>
            </Box>
        </HStack>
    )
}
