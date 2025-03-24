
import { ZenTaakIcon } from "@/react-icons";
import { Box, Heading, Text } from "@chakra-ui/react";

interface HeaderAuth {
	title: string;
	subheader: string;
}
export function HeaderAuth(props: HeaderAuth) {

	return (
		<Box as="header">
			<Box display="flex" alignItems="center" justifyContent="space-between">
				<Heading as="h1" fontSize="22px">
					{props.title}
				</Heading>
			</Box>

			<Text as="span" fontSize="15px" my="4" display="block" color="gray.400">
				{props.subheader}
			</Text>
		</Box>
	);
}
