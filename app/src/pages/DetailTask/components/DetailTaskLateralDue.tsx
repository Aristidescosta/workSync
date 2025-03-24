import { ZenTaakIcon } from "@/react-icons";
import { Box, HStack, Text } from "@chakra-ui/react";

interface DetailTaskLateralDue {
    deadline: Date
}

export default function DetailTaskLateralDue(props: DetailTaskLateralDue): JSX.Element {

    const {
        deadline
    } = props

    return (
        <HStack
            justifyContent={'space-between'}
        >
            <Box>
                <Text
                    fontSize={"sm"}
                    fontWeight={'semibold'}
                >
                    Dias de atraso
                </Text>
                <HStack>
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name="GoClock"
                        size={14}
                        color="#888"
                    />
                    <Text
                        fontSize={12}
                        color="#888"
                    >
                        {deadline.getDueDays()}
                    </Text>
                </HStack>
            </Box>
            <Box>
                <Text
                    fontSize={"sm"}
                    fontWeight={'semibold'}
                >
                    Data limite
                </Text>
                <HStack>
                    <ZenTaakIcon
                        package="githubocticonsicons"
                        name="GoCalendar"
                        size={14}
                        color="#888"
                    />
                    <Text
                        fontSize={12}
                        color="#888"
                    >
                        {deadline.getDayAndMonth()}
                    </Text>
                </HStack>
            </Box>
        </HStack>
    )
}