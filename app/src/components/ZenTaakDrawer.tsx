import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ZenTaakDrawer extends iModalPage {
    title: string
    size: "xs" | "sm" | "md" | "xl"
}

export default function ZenTaakDrawer(props: PropsWithChildren<ZenTaakDrawer>): JSX.Element {

    const {
        onClose,
        title,
        isOpen,
        size,
        children
    } = props

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size={size}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{title}</DrawerHeader>
                <DrawerBody>
                    {children}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}