import { ZenTaakIcon } from "@/react-icons";
import { Box, Flex, FormControl, FormLabel, HStack, Input, Spacer, Text } from "@chakra-ui/react";
import ListAttachmentsItem from "./components/ListAttachmentsItem";
import { useEffect, useState } from "react";
import { useStorage } from "@/src/hooks/useStorage";
import { useSubscriptionStore } from "@/src/hooks/useSubscription";
import { ZenTaakPlanType } from "@/src/types/PlanType";

interface Attachments {
    onAttachments: (files: File[]) => void
    onFileSizeExceeded?: (isFileExceeded: boolean) => void
    onSizeSpaceExceeded?: (isFileExceeded: boolean) => void
    ExistingsAttachments?: File[]
}

export default function Attachments(props: Attachments): JSX.Element {

    const {
        onAttachments,
        onFileSizeExceeded,
        onSizeSpaceExceeded,
        ExistingsAttachments
    } = props

    const [attachments, setAttachments] = useState<File[] | undefined>(ExistingsAttachments)

    const totalSpace = useStorage(state => state.totalSpace)
    const totalSpaceUsed = useStorage(state => state.totalSpaceUsed)
    const subscription = useSubscriptionStore(state => state.subscription)

    useEffect(() => {
        if (attachments) {
            onAttachments(attachments)
        }

        return () => onAttachments([])
    }, [attachments?.length])

    useEffect(() => {

        if (onSizeSpaceExceeded && onFileSizeExceeded && attachments) {
            if (attachments.length > 0) {

                const sizes: number[] = []

                for (const at of attachments) {
                    sizes.push(at.size)
                }

                const sizeTotal = sizes.reduce((prev, val) => prev + val)
                const freeSpace = totalSpace - totalSpaceUsed
                onSizeSpaceExceeded(sizeTotal > freeSpace)
                onFileSizeExceeded(sizeTotal > (subscription?.package as ZenTaakPlanType).feature.zenTaakDrive[1])

            } else {
                onSizeSpaceExceeded(false)
                onFileSizeExceeded(false)
            }
        }

    }, [attachments])

    function onHandleGettingAttachments() {
        document.getElementById('attachFiles')?.click()
    }

    function onAddFileToAttachments(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files ? e.target.files : null;

        if (files) {
            for (const file of files) {
                const reader = new FileReader();

                reader.readAsDataURL(file);
                setAttachments(state => [...(state || []), file]);
            }
        }
    }

    function handleOnDeleteFile(fileName: string) {
        setAttachments(state => state?.filter(a => a.name !== fileName))
    }

    return (
        <Box my="20px">
            <FormControl>
                <FormLabel fontSize="14px">Anexos</FormLabel>
                <Flex
                    alignItems={'center'}
                    gap={2}
                    cursor={'pointer'}
                    _active={{
                        opacity: 0.8
                    }}
                >
                    <Flex
                        p={3}
                        borderRadius="md"
                        bg="white"
                        boxShadow={"md"}
                        onClick={onHandleGettingAttachments}
                    >
                        <ZenTaakIcon
                            package="ionicons5"
                            name="IoAttach"
                            size={24}
                            color="#555"
                        />
                        <Text
                            fontWeight={'500'}
                        >
                            Anexar documento
                        </Text>
                    </Flex>
                    <Input
                        type="file"
                        id='attachFiles'
                        multiple
                        hidden
                        onChange={onAddFileToAttachments}
                        accept='image/*, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx'
                    />
                </Flex>
            </FormControl>
            <Spacer height={5} />
            <HStack
                gap={6}
                flexGrow={1}
                flexWrap="wrap"
            >
                {
                    attachments?.map((attach, index) => (
                        <ListAttachmentsItem
                            key={index}
                            fileName={attach.name}
                            onDelete={handleOnDeleteFile}
                            fileSize={attach.size}
                        />
                    ))
                }
            </HStack>
        </Box>
    )
}