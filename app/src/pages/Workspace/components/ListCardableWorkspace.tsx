import { Card, CardHeader, Flex, HStack, Text } from '@chakra-ui/react'
import { WorkspaceType } from '@/src/types/WorkspaceType'
import { ZenTaakIcon } from '@/react-icons'

import React, { ReactNode } from 'react'

interface IListCardableWorkspaceProps {
    workspaces: WorkspaceType[]
    onRender: (workspace: WorkspaceType, index: number) => ReactNode
    totalOpenWorkspace: number;
    totalClosedWorkspaces: number;
    toggleWorkspaces: (value: boolean) => void
}

export const ListCardableWorkspace: React.FC<IListCardableWorkspaceProps> = ({ toggleWorkspaces, onRender, workspaces, totalClosedWorkspaces, totalOpenWorkspace }) => {
    return (
        <Flex
            justifyContent={'flex-end'}
            py={2}
            pl={10}
        >
            <Card width={'full'}>
                <CardHeader
                    borderBottomWidth={1}
                    borderColor={'gray.100'}
                    bg={'#fafafa'}
                    borderTopStartRadius={15}
                    borderTopEndRadius={15}
                >
                    <HStack justifyContent={'space-between'}>
                        <Flex gap={10}>
                            <Flex
                                alignItems={'center'}
                                gap={2}
                                cursor={'pointer'}
                                onClick={() => toggleWorkspaces(false)}
                            >
                                <ZenTaakIcon
                                    package='githubocticonsicons'
                                    name='GoProjectSymlink'
                                    size={14}
                                />

                                <Text fontWeight={'500'}>
                                    {`${totalOpenWorkspace} Aberto${totalOpenWorkspace > 1 ? 's' : ''}`}
                                </Text>
                            </Flex>
                            <Flex
                                alignItems={'center'}
                                gap={2}
                                onClick={() => toggleWorkspaces(true)}
                                cursor={'pointer'}
                            >
                                <ZenTaakIcon
                                    package={"githubocticonsicons"}
                                    name={"GoArchive"}
                                    size={16}
                                />
                                <Text>
                                    {`${totalClosedWorkspaces} Fechado${totalClosedWorkspaces > 1 ? 's' : ''}`}
                                </Text>
                            </Flex>
                        </Flex>

                    </HStack>
                </CardHeader>
                {workspaces.map(onRender)}
            </Card>
        </Flex>
    )
}
