import { ZenTaakIcon } from "@/react-icons";
import { Box, Text } from "@chakra-ui/react";
import GraphCardContent from "./GraphCardContent";


interface CardProps {
    color: string
    countNumber: number
    title: string
    icon: string
}
export default function Card(props: CardProps): JSX.Element {

    const {
        color,
        countNumber,
        title,
        icon
    } = props

    return (
        <GraphCardContent
            customStyle={{
                height: 150,
                width: 288,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <Box textAlign="center">
                <Text
                    color={color}
                    fontWeight={400}
                    fontSize={18}
                >
                    {title}
                </Text>
                <Text
                    fontSize={40}
                    fontWeight={500}
                    color={color}
                >
                    {isNaN(countNumber) ? 0 : countNumber}
                </Text>
            </Box>

            <Box
                display="flex"
                justifyContent="flex-end"
                mr={4}
            >
                <ZenTaakIcon
                    package="githubocticonsicons"
                    name={icon}
                    color={color}
                    size={25}
                />
            </Box>
        </GraphCardContent>

    )
}