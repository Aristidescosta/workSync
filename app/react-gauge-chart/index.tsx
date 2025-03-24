import GraphCardContent from '@/src/pages/Charts/Components/GraphCardContent'
import { CircularProgress, CircularProgressLabel, Text, VStack } from '@chakra-ui/react'

interface ReactGaugeChart {
    title: string
    value: number
    isNegativeIndicator: boolean
}

export default function ReactGaugeChart(props: ReactGaugeChart): JSX.Element {

    const {
        title,
        value,
        isNegativeIndicator
    } = props

    const color = isNegativeIndicator ?
        value < 0.3 ? "#009C5B" :
            value >= 0.3 && value <= 0.7 ? "#D7D020" : "#DD0000"
        :
        value < 0.3 ? "#DD0000" :
            value >= 0.3 && value <= 0.7 ? "#D7D020" : "#009C5B"

    return (
        <GraphCardContent
            customStyle={{
                flex: 1,
                height: 400,
                alignItems: "center",
                justifyContent: 'center'
            }}
        >
            <VStack
                w={'full'}
                gap={5}
            >
                <Text
                    fontWeight={'600'}
                    fontSize={'2xl'}
                >
                    {title}
                </Text>
                <CircularProgress
                    size={'35vh'}
                    value={isNaN(value) ? 0 : value * 100}
                    color={color}
                >
                    <CircularProgressLabel
                        fontSize={'5xl'}
                    >
                        {`${(isNaN(value) ? 0 : value * 100).toFixed(1) ?? 0}%`}
                    </CircularProgressLabel>
                </CircularProgress>
            </VStack>
        </GraphCardContent>
    )
}