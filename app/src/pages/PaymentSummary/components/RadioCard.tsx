import { Box, useRadio } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export function RadioCard(props: any) {
    const { getInputProps, getRadioProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                _checked={{
                    color: 'red',
                    backgroundColor: 'white',
                    boxShadow: '5px 9px 29px 5px rgba(0,0,0,0.1);',
                    borderRadius: 15
                }}

                px={3}
                py={1}
            >
                {props.children}
            </Box>
        </Box>
    )
}