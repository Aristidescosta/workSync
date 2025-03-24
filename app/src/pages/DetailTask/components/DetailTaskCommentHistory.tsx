import { Box, Text } from "@chakra-ui/react";

interface DetailTaskCommentHistory {
    message: string
    updateAt: string
}

export default function DetailTaskCommentHistory(props: DetailTaskCommentHistory): JSX.Element {

    return (
        <Box
            pb={2}
            pt={1}
            borderBottomWidth={1}
            borderBottomColor={'gray.100'}
        >
            <Text
                fontWeight={'500'}
            >
                {props.updateAt}
            </Text>
            <Text>
                {props.message}
            </Text>
        </Box>
    )
}