import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface GraphCardContent {
    customStyle?: any
}

export default function GraphCardContent(props: PropsWithChildren<GraphCardContent>): JSX.Element {

    return (
        <Flex
            bg="#fff"
            borderRadius={4}
            shadow="lg"
            {...props.customStyle}
        >
            {props.children}
        </Flex>
    )
}