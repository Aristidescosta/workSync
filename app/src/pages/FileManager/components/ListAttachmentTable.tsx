import { Checkbox, Table, TableContainer, Tbody, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { AttachmentFileType } from '@/src/types/AttachmentFileType'
import React from 'react'
import { AttachmentViewer } from './AttachmentViewer'

interface IListAttachmentTableProps {
    attachments: AttachmentFileType[]
    selectedAttachments: AttachmentFileType[]
    handleSeleteAttachment: (isChecked: boolean, attachment: AttachmentFileType) => void
    handleSelectAllAttachments: (isChecked: boolean) => void
    selectAllChecked: boolean
    isIndeterminate: boolean
}

const ListAttachmentTable: React.FC<IListAttachmentTableProps> = React.memo(({ isIndeterminate, selectedAttachments, attachments, selectAllChecked, handleSeleteAttachment, handleSelectAllAttachments }) => {

    return (
        <TableContainer>
            <Table defaultChecked={true}>
                <Thead>
                    <Tr>
                        <Th>
                            <Checkbox size='lg' isIndeterminate={isIndeterminate} isChecked={selectAllChecked} onChange={(e) => handleSelectAllAttachments(e.target.checked)}>
                                <Text fontWeight={'normal'} fontSize={14}>Nome do ficheiro</Text>
                            </Checkbox>
                        </Th>
                        <Th fontWeight={'normal'} fontSize={14}>Data de criação</Th>
                        <Th fontWeight={'normal'} fontSize={14}>Tamanho</Th>
                        <Th fontWeight={'normal'} fontSize={14}>Tipo</Th>
                        <Th fontWeight={'normal'} fontSize={14}>Acção</Th>
                    </Tr>
                </Thead>
                <Tbody color={'#000000'}>
                    {
                        attachments.length > 0 &&
                        attachments.map((attachment) => (
                            <AttachmentViewer isChecked={selectedAttachments.some(attachmentFinded => attachmentFinded.attachId === attachment.attachId)} key={attachment.attachId} attachment={attachment} handleSeleteAttachment={handleSeleteAttachment} />
                        ))
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}/* , (prevProps, nextProps) => {
    return prevProps.attachments === nextProps.attachments && prevProps.selectedAttachments === nextProps.selectedAttachments && prevProps.selectAllChecked === nextProps.selectAllChecked;
} */);

export default ListAttachmentTable
