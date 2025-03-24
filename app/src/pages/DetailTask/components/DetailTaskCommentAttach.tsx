import { HStack, Flex, Box, Text } from "@chakra-ui/react";
import ListAttachmentsItem from "../../Task/components/ListAttachmentsItem";

interface DetailTaskCommentAttach {
    index: number
    fileSize: number
    filename: string
    quantity: number
}

export default function DetailTaskCommentAttach(props: DetailTaskCommentAttach): JSX.Element {

    const {
        index,
        filename,
        fileSize,
        quantity
    } = props

    return (
        <HStack>
            {
                index < 2 ?
                    <Box
                        borderWidth={1}
                        borderColor={'gray.100'}
                        borderRadius={20}
                        px={2}
                        key={index}
                    >
                        <ListAttachmentsItem
                            fileName={filename}
                            fileSize={fileSize}
                            attachAsComment
                            attachAsCommentSize={4}
                        />
                    </Box> : null
            }

            {
                index === 2 ?
                    <Flex
                        borderWidth={1}
                        borderColor={'gray.100'}
                        borderRadius={20}
                        w={12}
                        px={2}
                        justifyContent={'center'}
                    >
                        <Text>+{quantity - 2}</Text>
                    </Flex>
                    :
                    null
            }
        </HStack>
    )
}