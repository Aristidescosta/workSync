import { Button, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup, useDisclosure } from "@chakra-ui/react"
import { ReactNode } from "react"

interface MessagePopover extends iModalPage {
    title: string
    bodyMessage: string
    onOpen: () => void
    onConfirmOperation: () => void
    onButtonRender: () => ReactNode
}

export default function MessagePopover(props: MessagePopover): JSX.Element {

    const {
        title,
        bodyMessage,
        isOpen,
        onOpen,
        onClose,
        onConfirmOperation,
        onButtonRender
    } = props

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            closeOnBlur={false}
        >
            <PopoverTrigger>
                {onButtonRender()}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>{title}</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    {bodyMessage}
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='flex-end'>
                    <ButtonGroup size='sm'>
                        <Button
                            variant='outline'
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirmOperation}
                            colorScheme='red'
                        >
                            Confirmar
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}