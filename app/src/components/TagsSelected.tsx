import { HStack, Box, Text } from "@chakra-ui/react"
import { TagType } from "../types/TagType"

interface TagsSelected {
    tags: TagType[]
}

export default function TagsSelected(props: TagsSelected): JSX.Element {
    return (
        <HStack
            flexWrap="wrap"
        >
            {
                props.tags.map((tag, index) => (
                    <Box
                        key={index}
                        bg={`${tag.color}1A`}
                        borderWidth={1}
                        borderColor={tag.color}
                        color={tag.color}
                        py={0.2}
                        px={2}
                        borderRadius={20}
                    >
                        <Text
                            fontSize={12}
                            fontWeight={'bold'}
                        >
                            {tag.tag}
                        </Text>
                    </Box>
                ))
            }
        </HStack>
    )
}