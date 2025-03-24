import { ZenTaakIcon } from "@/react-icons"
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import { ToqueButton } from "./Button"

interface BadgeFree {
    info: string
    onClickToBuyAPlan?: () => void
    onClickToRenewPlan?: () => void
}

export default function BadgeFree(props: BadgeFree): JSX.Element {

    return (
        <HStack
            gap={3}
            mr={10}
        >
            <Stack
                boxSize={{ md: 10, lg: 10, '2xl': 12 }}
                bg={'red.200'}
                borderRadius={10}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <ZenTaakIcon
                    package="githubocticonsicons"
                    name="GoStarFill"
                    color="#fff"
                />
            </Stack>
            {
                props.onClickToBuyAPlan ?
                    <Box
                        pt={1.5}
                    >
                        <Text
                            fontWeight={'500'}
                            lineHeight={0.8}
                            fontSize={{ md: 10, lg: '13', '2xl': '17' }}
                        >
                            {props.info}
                        </Text>
                        <ToqueButton
                            variant={"link"}
                            color={'red.200'}
                            as={'u'}
                            cursor={'pointer'}
                            fontSize={{ md: 10, lg: '13', '2xl': '17' }}
                            onClick={props.onClickToBuyAPlan}
                        >
                            Actualizar o plano
                        </ToqueButton>
                    </Box>
                    :
                    <Box
                        pt={1.5}
                    >
                        <Text
                            fontWeight={'500'}
                            lineHeight={0.8}
                            fontSize={{ md: 10, lg: '13', '2xl': '17' }}
                        >
                            {props.info}
                        </Text>
                        <ToqueButton
                            variant={"link"}
                            color={'red.200'}
                            as={'u'}
                            cursor={'pointer'}
                            fontSize={{ md: 10, lg: '13', '2xl': '17' }}
                            onClick={props.onClickToRenewPlan}
                        >
                            Renovar o plano
                        </ToqueButton>
                    </Box>
            }
        </HStack>
    )
}