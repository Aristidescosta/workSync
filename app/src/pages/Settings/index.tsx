import { Box, Card, CardHeader, Flex, Heading, Text } from "@chakra-ui/react";
import SettingsScreen from "./settingsScreen";

export default function SettingsPage(): JSX.Element {

    const width = window.innerWidth

    return (
        <Box >
            <Box
                bg="white"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="1.3rem 60px"
            >
                <Heading as='h1' fontSize={'22px'}>
                    Definições
                </Heading>
            </Box>
            <Flex
                justifyContent={'center'}
                py={2}
            >
                <Card
                    width={width / 1.1}
                >
                    <CardHeader
                        borderBottomWidth={1}
                        borderColor={'gray.100'}
                        bg={'#fafafa'}
                    >
                    </CardHeader>
                    <Box w={'70%'}>
                        <SettingsScreen />
                    </Box>
                </Card>
            </Flex>
        </Box>
    )
}
