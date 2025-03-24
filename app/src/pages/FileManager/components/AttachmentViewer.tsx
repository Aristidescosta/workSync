import { ZenTaakIcon } from '@/react-icons';
import { AttachmentFileType } from '@/src/types/AttachmentFileType'
import { Checkbox, Flex, Image, Td, Text, Tr } from '@chakra-ui/react'
import React from 'react'

interface IAttachmentProps {
    attachment: AttachmentFileType;
    handleSeleteAttachment: (isChecked: boolean, attachment: AttachmentFileType) => void
    isChecked: boolean
}

export const AttachmentViewer: React.FC<IAttachmentProps> = ({ attachment, handleSeleteAttachment, isChecked }) => {
    let iconPath;
    let typeName = 'document';

    switch (attachment.type) {
        case 'application/pdf':
            iconPath = '/pdf.webp'
            typeName = 'pdf';
            break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            iconPath = '/excell.png'
            typeName = 'excel';
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            iconPath = '/word.png'
            typeName = 'word';
            break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            iconPath = '/ppoint.png'
            typeName = 'power point';
            break;
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
        case 'image/webp':
            iconPath = '/image.webp'
            typeName = 'imagem';
            break;
        default: iconPath = '/document.png';
    }

    const timestamp = { seconds: 1707210876, nanoseconds: 31000000 };

    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

    const handleAttachmentViewer = () => {
        window.open(attachment.fileUrl, '_blank');
    }    

    return (
        <Tr _odd={{ bg: '#DDDDDD' }} _even={{ bg: '#FAFAFA' }}>
            <Td>
                <Checkbox size='lg' isDisabled={attachment.taskId ? true : false} onChange={(e) => handleSeleteAttachment(e.target.checked, attachment)} isChecked={isChecked}>
                    <Flex alignItems={'center'} gap={2}>
                        <Image src={iconPath} boxSize={10} />
                        <Text fontWeight={'normal'} fontSize={14}>{attachment.fileName}</Text>
                    </Flex>
                </Checkbox>
            </Td>
            <Td>{formattedDate}</Td>
            <Td>{`${attachment.size.convertToSystemNumerical(true)}`}</Td>
            <Td>{typeName.toLowerCase()}</Td>
            <Td >
                <ZenTaakIcon
                    package='ionicons5'
                    name='IoOpenOutline'
                    size={20}
                    onClick={handleAttachmentViewer}
                    cursor={"pointer"}
                />
            </Td>
        </Tr>
    )
}
