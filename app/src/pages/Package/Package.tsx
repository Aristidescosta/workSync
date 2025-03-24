import { ZenTaakIcon } from "@/react-icons";
import { PlanType } from "@/src/types/PlanType";
import { HStack, VStack, Text, Box, Flex } from "@chakra-ui/react";

interface Package {
    plan: PlanType
    currentPlan: PlanType | undefined
    selected: boolean
    onSelected: (plan: PlanType) => void
}

export default function Package(props: Package): JSX.Element {

    const {
        plan,
        selected,
        currentPlan,
        onSelected
    } = props

    function handleOnSelected() {
        onSelected(plan)
    }

    return (
        <VStack
            w={'full'}
            h={'130px'}
            alignItems={'flex-start'}
            borderWidth={2}
            borderRadius={6}
            borderColor={selected ? 'red.200' : 'gray.100'}
            p={2}
            onClick={handleOnSelected}
        >
            <HStack
                justifyContent={'space-between'}
                w={'full'}
            >
                <Box
                    w={'full'}
                >
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text
                            fontSize={'20'}
                            fontWeight={'bold'}
                            color={selected ? 'red.200' : 'black.100'}
                        >
                            {plan.planName}
                        </Text>
                        {
                            plan.planName === currentPlan?.planName ?
                                <Text
                                    fontSize={14}
                                    fontWeight={'bold'}
                                    color={'red.200'}
                                >
                                    Seu plano activo
                                </Text>
                                :
                                null
                        }
                    </Flex>
                    {
                        plan.type === "subscription" ?
                            <Text
                                fontSize={'16'}
                                fontWeight={'bold'}
                                color={selected ? 'red.200' : 'black.100'}
                            >
                                {plan.anualPrice ? plan.anualPrice?.convertToKwanzaMoney() : (0).convertToKwanzaMoney()}
                            </Text>
                            :
                            <Text
                                fontSize={'16'}
                                fontWeight={'bold'}
                                color={selected ? 'red.200' : 'black.100'}
                            >
                                {`${plan.anualPrice?.convertToKwanzaMoney()} / mês`}
                            </Text>
                    }
                </Box>
                {
                    selected ?
                        <ZenTaakIcon
                            package="githubocticonsicons"
                            name="GoCheckCircleFill"
                            color="#ff2a00"
                        />
                        :
                        null
                }
            </HStack>
            <Text
                fontSize={13}
            >
                {plan.description}
            </Text>
        </VStack>
    )
}