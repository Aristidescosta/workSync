import React, { useEffect, useState } from 'react'

import { IconButton, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react'
import { ZenTaakIcon } from '@/react-icons'
import { useTeamStore } from '@/src/hooks/useTeam'
import { useUserStore } from '@/src/hooks/useUser'
import { useWorkspaceStore } from '@/src/hooks/useWorkspace'
import { useUserSessionStore } from '@/src/hooks/useUserSession'


interface WorkspaceMenuContext {
    menuIconButton: JSX.Element
    onOpenMenu: (menuPosition: number) => void
    isLoading: boolean
    workspaceStatus: boolean;
}

export const WorkspaceMenuContext: React.FC<WorkspaceMenuContext> = ({ menuIconButton, isLoading, onOpenMenu, workspaceStatus }) => {
    const user = useUserSessionStore(state => state.user)
    const MESSAGE = workspaceStatus ? 'Abrir' : "Fechar"
    const team = useTeamStore()

    const [role, setRole] = useState(false)

    useEffect(() => {
        if(team && user){
            setRole(team.team?.owner.session.id === user?.session.id)
        }
    }, [])




    return (
        <Menu isLazy >
            <MenuButton isDisabled={!role} as={IconButton} aria-label='Options' icon={menuIconButton} variant='unstyled' />
            <MenuList>
                <MenuGroup title='Opções'>
                    <MenuItem
                        onClick={() => onOpenMenu(0)}
                        icon={
                            <ZenTaakIcon
                                package={"githubocticonsicons"}
                                name={"GoPencil"}
                                size={20}
                            />
                        }
                        _hover={{
                            bg: '#eaeaea'
                        }}
                        fontSize={16}
                    >
                        Editar
                    </MenuItem>
                    <MenuItem
                        onClick={() => onOpenMenu(1)}
                        /* isLoading={isLoading} */
                        icon={
                            <ZenTaakIcon
                                package={"githubocticonsicons"}
                                name={"GoArchive"}
                                size={20}
                            />
                        }
                        _hover={{
                            bg: '#eaeaea'
                        }}
                        fontSize={16}
                    >
                        {isLoading ? workspaceStatus ? "Abrindo..." : "Fechando..." : MESSAGE}
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}
