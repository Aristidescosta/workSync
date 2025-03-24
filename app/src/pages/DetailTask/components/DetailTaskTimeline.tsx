import { ZenTaakIcon } from "@/react-icons";
import { TaskLogType } from "@/src/types/TaskLogType";
import { Avatar, Box as VerticalLine, Flex, Box, HStack, Text } from "@chakra-ui/react";

interface DetailTaskTimeline {
    taskLog: TaskLogType
}

export default function DetailTaskTimeline(props: DetailTaskTimeline): JSX.Element {

    const {
        taskLog
    } = props

    return (
        <HStack
            alignItems={'flex-end'}
        >
            <Flex
                w={6}
                flexDir={'column'}
                alignItems={'center'}
            >
                <VerticalLine
                    borderWidth={1}
                    borderColor={'gray.200'}
                    height={6}
                    w={0}
                />
                <Flex
                    boxSize={6}
                    bg={'gray.200'}
                    borderRadius={'full'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name={taskLog.icon}
                        size={14}
                        color="#fafafa"
                    />
                </Flex>
                <VerticalLine
                    borderWidth={1}
                    borderColor={'gray.200'}
                    height={3}
                    w={0}
                />
            </Flex>
            <Box>
                <HStack gap={1}>
                    <Avatar
                        size={'xs'}
                        name={taskLog.user.session.displayName}
                        src={taskLog.user.session.photoUrl as string | undefined}
                    />
                    <Text
                        fontSize={'sm'}
                        fontWeight={'500'}
                    >
                        {taskLog.user.session.displayName}
                    </Text>
                    <Text
                        fontSize={'sm'}
                        color={'gray.300'}
                    >
                        {taskLog.action}
                    </Text>
                    <Text
                        fontSize={'sm'}
                        color={'gray.300'}
                    >
                        {taskLog.data}
                    </Text>
                    <Text
                        fontSize={'sm'}
                        color={'gray.300'}
                    >
                        {taskLog.createAt.convertToString()}
                    </Text>
                </HStack>
                <VerticalLine
                    borderWidth={1}
                    borderColor={'transparent'}
                    height={3}
                    w={0}
                />
            </Box>
        </HStack>
    )
}