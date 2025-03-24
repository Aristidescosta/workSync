import { TagType } from "@/src/types/TagType";
import { Box, HStack, Text } from "@chakra-ui/react";

interface DetailTaskLateralLabels {
    tags: TagType[]
}

export default function DetailTaskLateralLabels(props: DetailTaskLateralLabels): JSX.Element {

    const {
        tags
    } = props

    return (
        <Box>
            <HStack
                flexWrap={"wrap"}
            >
                {
                    tags.map((tag, index) => (
                        <Text
                            key={index}
                            fontSize={'small'}
                            color={'#fff'}
                            bg={tag.color}
                            px={4}
                            borderRadius={4}
                        >
                            {tag.tag}
                        </Text>
                    ))
                }
            </HStack>
        </Box>
    )
}