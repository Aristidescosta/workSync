import { LogActivityType } from "@/src/types/LogActivityType";
import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

interface Activity {
    activity: LogActivityType
}

export default function Activity(props: Activity): JSX.Element {

    const {
        activity
    } = props

    return (
        <HStack
            px={4}
            py={2}

        >
            <Avatar
                name={activity.user.displayName}
                src={activity.user.photoUrl as string | undefined}
                size={'md'}
            />
            <Box>
                <Text>
                    <strong>{`${activity.user.displayName}, `}</strong>
                    {activity.action}
                </Text>
                <Text
                    fontSize={'small'}
                    color={'gray.300'}
                >
                    {activity.createdAt.convertToString()}
                </Text>
            </Box>
        </HStack>
    )
}