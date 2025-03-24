import { ZenTaakIcon } from "@/react-icons";
import { TaskType } from "@/src/types/TaskType";
import { Menu, MenuButton, MenuList, MenuItem, IconButton, MenuGroup, MenuDivider } from "@chakra-ui/react";

interface TaskMenuContext {
    task: TaskType
    menuIconButton: JSX.Element
    onMenuClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, menuPosition: number) => void
}

export default function TaskMenuContext(props: TaskMenuContext): JSX.Element {

    const {
        menuIconButton,
        onMenuClick
    } = props

    return (
        <Menu isLazy>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={menuIconButton}
                variant='unstyled'
            />
            <MenuList>
                <MenuGroup title='Colaborador'>
                    <MenuItem
                        onClick={(e) => onMenuClick(e, 0)}
                        icon={
                            <ZenTaakIcon
                                package={"githubocticonsicons"}
                                name={"GoPerson"}
                                size={20}
                            />
                        }
                        _hover={{
                            bg: '#eaeaea'
                        }}
                    >
                        Atribuir a
                    </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title='Tarefa'>
                    <MenuItem
                    onClick={(e) => onMenuClick(e, 1)}
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
                    >
                        Editar
                    </MenuItem>
                    <MenuItem
                    onClick={(e) => onMenuClick(e, 2)}
                        icon={
                            <ZenTaakIcon
                                package={"githubocticonsicons"}
                                name={"GoCheckCircleFill"}
                                size={20}
                            />
                        }
                        _hover={{
                            bg: '#eaeaea'
                        }}
                    >
                       {props.task.isOpen ? " Fechar" : "Reabrir"}
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}