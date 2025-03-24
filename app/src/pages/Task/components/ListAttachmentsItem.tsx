import { ZenTaakIcon } from "@/react-icons";
import { Box, HStack, Image, Text, Tooltip } from "@chakra-ui/react";
import { useAttachmentStore } from "@/src/hooks/useAttachment";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";
import { ZenTaakPlanType } from "@/src/types/PlanType";

interface ListAttachmentsItem {
    fileName: string
    attachAsComment?: boolean
    attachAsCommentSize?: number
    filePath?: string
    fileSize?: number
    onOpenFile?: (path: string) => void
    onDelete?: (fileName: string) => void
}

export default function ListAttachmentsItem(props: ListAttachmentsItem): JSX.Element {

    const extensionFiles: Record<string, string> = {
        "xls": "/excell.png",
        "xlsx": "/excell.png",
        "doc": "/word.png",
        "docx": "/word.png",
        "ppt": "/ppoint.png",
        "pptx": "/ppoint.png",
        "pdf": "/pdf.webp",
        "png": "/image.webp",
        "jpeg": "/image.webp",
        "jpg": "/image.webp",
        "gif": "/image.webp",
        "webp": "/image.webp",
        "svg": "/image.webp",
    }

    const {
        fileSize,
        fileName,
        filePath,
        attachAsComment,
        attachAsCommentSize,
        onOpenFile,
        onDelete
    } = props

    const subscription = useSubscriptionStore(state => state.subscription)
    const uploading = useAttachmentStore(state => state.uploading)

    function handleOnDelete() {
        onDelete && onDelete(fileName)
    }

    function handleOpenFile() {
        if (filePath && onOpenFile) {
            onOpenFile(filePath)
        }
    }

    return (
        <Box>
            <HStack>
                {
                    attachAsComment ?
                        <Image
                            src={extensionFiles[fileName.getExtensionFile()] ?? "/document.png"}
                            boxSize={attachAsCommentSize}
                        />
                        :
                        <Box
                            bg='#ccc'
                            p={4}
                            cursor={'pointer'}
                            onClick={handleOpenFile}
                        >
                            <Image
                                src={extensionFiles[fileName.getExtensionFile()] ?? "/document.png"}
                                h={'12'}
                                w={'12'}
                            />
                        </Box>
                }
                <Tooltip
                    label={fileName}
                    fontSize={'sm'}
                >
                    <Text
                        fontSize={'sm'}
                        noOfLines={1}
                        w={attachAsComment ? 20 : 170}
                    >
                        {fileName}
                    </Text>
                </Tooltip>
                {
                    onDelete && (
                        <Box
                            cursor={'pointer'}
                            onClick={uploading ? undefined : handleOnDelete}
                        >
                            <ZenTaakIcon
                                package="githubocticonsicons"
                                name="GoTrash"
                                size={attachAsComment ? (attachAsCommentSize as number + 10) : 20}
                                color={uploading ? "#F3B7B7" : "#ff2a00"}
                            />
                        </Box>
                    )
                }
                {
                    fileSize as number > (subscription?.package as ZenTaakPlanType).feature.zenTaakDrive[1] ?
                        <ZenTaakIcon
                            package="githubocticonsicons"
                            name="GoAlertFill"
                            size={16}
                            color="#ff2a00"
                        />
                        :
                        null
                }
            </HStack>
        </Box>
    )
}