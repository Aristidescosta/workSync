import { Box } from "@chakra-ui/react"
import ReactMarkdown from 'react-markdown';

interface FormattedViewTextArea {
    text: string | undefined
}

export default function FormattedViewTextArea(props: FormattedViewTextArea): JSX.Element {

    const formattedText = props.text?.split('\n').map((line, index) => (
        <ReactMarkdown key={index}>{line}</ReactMarkdown>
    ));

    return (

        <Box
            py={4}
        >
            {
                props.text === undefined ?
                    <ReactMarkdown>*Sem relatório, ainda!*</ReactMarkdown>
                    :
                    formattedText
            }
        </Box>
    )
}