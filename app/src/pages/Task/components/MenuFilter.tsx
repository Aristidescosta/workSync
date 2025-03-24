import { ZenTaakIcon } from "@/react-icons";
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItemOption, MenuList } from "@chakra-ui/react";

interface MenuFilter {
    title: string
    handleClear: () => void
    children: React.ReactNode
}
export default function MenuFilter(props: MenuFilter): JSX.Element {

    const {
        title,
        handleClear,
        children
    } = props;

    return (
        <Menu closeOnSelect={false}>
            <MenuButton
                as={Button}
                rightIcon={<ZenTaakIcon
                    package={"fontawesome6"}
                    name={"FaArrowDown"}
                    size={14}
                />}
                variant='unstyled'
            >
                {title}
            </MenuButton>
            <MenuList>
                {children}
                <MenuDivider />
                <MenuGroup>
                    <MenuItemOption 
                        fontSize={13}
                        pl={4}
                        onClick={handleClear}
                    >
                        Limpar
                    </MenuItemOption>
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}