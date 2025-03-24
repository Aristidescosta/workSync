import { Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';

import React from 'react'

import { ToqueButton } from './Button';

interface IModalDeleteProps {
    title: string;
    subtitle?: string;
    primaryAction: (option: number) => void;
    secondaryAction: (option: number) => void;
    isOpen: boolean;
    onCloseModal: () => void;
    buttonSecundaryTitle?: string;
    buttonTitle: string;
    loading: boolean;
}

export const ModalDelete: React.FC<IModalDeleteProps> = ({ loading ,buttonTitle, title, subtitle, isOpen, primaryAction, secondaryAction, onCloseModal, buttonSecundaryTitle }) => {
    const buttonValue = buttonTitle.includes('Restaurar') ? 0 : 1
    
    return (
        <Modal onClose={onCloseModal} isOpen={isOpen} isCentered={true}>
            <ModalOverlay
            />
            <ModalContent>
                <ModalHeader>
                    {title}
                </ModalHeader>
                <ModalCloseButton />
                {
                    subtitle &&
                    <ModalBody py={4}>
                        <Center>
                            <Text>{subtitle}</Text>
                        </Center>
                    </ModalBody>
                }
                <ModalFooter justifyContent={'space-around'} gap={4} alignItems={'center'}>
                    <ToqueButton onClick={() => secondaryAction(0)} isLoading={loading} variant='outline'>{buttonSecundaryTitle ? buttonSecundaryTitle : 'Cancelar'}</ToqueButton>
                    <ToqueButton onClick={() => primaryAction(buttonValue)} isLoading={loading} variant={buttonValue === 0 ? 'secondary' : 'primary'}>{buttonTitle}</ToqueButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
