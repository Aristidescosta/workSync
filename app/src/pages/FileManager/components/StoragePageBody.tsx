import { Button, Card, CardHeader, Flex, HStack, Input, InputGroup, InputLeftElement, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { AttachmentFileType } from '@/src/types/AttachmentFileType'
import { ZenTaakIcon } from '@/react-icons'
import React from 'react'
import ListAttachmentTable from './ListAttachmentTable'


interface IStoragePageBodyProps {
    isSelectAllDeleteChecked: boolean
    isDeletedIndeterminate: boolean
    isSelectAllChecked: boolean
    isIndeterminate: boolean
    buttonTitle: string

    filteredAttachementsDeleted: AttachmentFileType[]
    seletedDeleteAttachments: AttachmentFileType[]
    filteredAttachements: AttachmentFileType[]
    deletedAttachments: AttachmentFileType[]
    seletedAttachments: AttachmentFileType[]
    allAttachments: AttachmentFileType[]
    searchAttachement: string

    handleSeleteAttachment: (isChecked: boolean, attachment: AttachmentFileType) => void
    onSelectedAllAttachment: (isChecked: boolean) => void
    setSearchAttachement: (value: string) => void
    onOpenModalDeleteAttachment: () => void
    onChooseAttachment: () => void
    emptyTheTrashcan: () => void
    onChooseTrash: () => void
}

export const StoragePageBody: React.FC<IStoragePageBodyProps> = ({
    isSelectAllDeleteChecked,
    isDeletedIndeterminate,
    isSelectAllChecked,
    isIndeterminate,
    buttonTitle,

    filteredAttachementsDeleted,
    seletedDeleteAttachments,
    filteredAttachements,
    deletedAttachments,
    seletedAttachments,
    searchAttachement,
    allAttachments,

    onOpenModalDeleteAttachment,
    onSelectedAllAttachment,
    handleSeleteAttachment,
    setSearchAttachement,
    onChooseAttachment,
    emptyTheTrashcan,
    onChooseTrash,
}) => {
    return (
        <Flex
            justifyContent={'center'}
            py={2}
            pl={10}
        >
            <Card w={'full'}>
                <CardHeader
                    borderBottomWidth={1}
                    borderColor={'gray.100'}
                    bg={'#fafafa'}
                    borderTopStartRadius={15}
                    borderTopEndRadius={15}
                >
                    <HStack position={'relative'}>
                        <Flex pos={'absolute'} gap={8} right={0} top={1} zIndex={1}>
                            {
                                buttonTitle.includes('Restaurar') && <Button
                                    variant='link'
                                    onClick={emptyTheTrashcan}
                                    size={'lg'}
                                    isDisabled={deletedAttachments.length === 0}
                                >
                                    Esvaziar lixeira
                                </Button>
                            }

                            <Button
                                isDisabled={buttonTitle.includes('Apagar') ? seletedAttachments.length === 0 : seletedDeleteAttachments.length === 0}
                                variant='link'
                                onClick={onOpenModalDeleteAttachment}
                                size={'lg'}
                            >
                                {buttonTitle}
                            </Button>

                            <InputGroup w={320} borderColor={'#AFAFAF'} bg={'#FAFAFA'} color={'#AFAFAF'}>
                                <InputLeftElement pointerEvents='none' >
                                    <ZenTaakIcon
                                        package='ionicons5'
                                        name='IoSearchOutline'
                                        color='#AFAFAF'
                                    />
                                </InputLeftElement>
                                <Input value={searchAttachement} onChange={(e) => setSearchAttachement(e.target.value)} borderRadius={14} type='tel' fontSize={14} placeholder='Procurar' />
                            </InputGroup>
                        </Flex>

                        <Tabs position="relative" variant="unstyled" w={'full'}>
                            <TabList>
                                <Tab onClick={onChooseAttachment}>Ficheiros</Tab>
                                <Tab onClick={onChooseTrash}>Lixeira</Tab>
                            </TabList>
                            <TabIndicator
                                mt="-1.5px"
                                height="5px"
                                bg="#DD0000"
                                borderRadius="1px"
                            />

                            <TabPanels mt={8}>
                                <TabPanel w={'full'} p={0} m={0} defaultChecked={true}>
                                    <ListAttachmentTable
                                        isIndeterminate={isIndeterminate}
                                        selectedAttachments={seletedAttachments}
                                        attachments={searchAttachement.length > 0 ? filteredAttachements : allAttachments}
                                        handleSeleteAttachment={handleSeleteAttachment}
                                        handleSelectAllAttachments={onSelectedAllAttachment}
                                        selectAllChecked={isSelectAllChecked}
                                    />
                                </TabPanel>
                                <TabPanel w={'full'} p={0} m={0}>
                                    <ListAttachmentTable
                                        isIndeterminate={isDeletedIndeterminate}
                                        selectedAttachments={seletedDeleteAttachments}
                                        attachments={searchAttachement.length > 0 ? filteredAttachementsDeleted : deletedAttachments}
                                        handleSeleteAttachment={handleSeleteAttachment}
                                        handleSelectAllAttachments={onSelectedAllAttachment}
                                        selectAllChecked={isSelectAllDeleteChecked}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </HStack>
                </CardHeader>
            </Card>
        </Flex>
    )
}
